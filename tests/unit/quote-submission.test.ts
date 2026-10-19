import { describe, expect, it, vi } from "vitest";
import { quoteProtection } from "@/config/quote";
import { getDictionary } from "@/content";
import { resolveDeliveryConfig, type DeliveryConfig } from "@/lib/quote-delivery";
import { buildQuoteEmail, escapeHtml } from "@/lib/quote-email";
import type { QuoteRequest, QuoteSubmission } from "@/lib/quote-request";
import { handleQuoteSubmission, type SubmissionContext } from "@/lib/quote-submission";
import { RateLimiter, visitorKey } from "@/lib/rate-limit";

const resendConfig: DeliveryConfig = {
  mode: "resend",
  apiKey: "re_test_secret_key",
  to: ["owner@example.com"],
  from: "WideCode <quotes@example.com>",
  endpoint: "https://api.resend.com/emails",
};

function submission(overrides: Partial<QuoteSubmission> = {}): QuoteSubmission {
  return {
    values: {
      name: "Arta Krasniqi",
      business: "Restoranti Test",
      email: "arta@example.com",
      phone: "",
      projectType: "business",
      packageId: "business",
      budget: "300-600",
      timeline: "flexible",
      description: "Website për restorantin tonë me menu dhe rezervime.",
    },
    estimate: null,
    projectSlug: null,
    website: "",
    elapsedMs: 20_000,
    submissionId: "11111111-2222-3333-4444-555555555555",
    ...overrides,
  };
}

function setup(config: DeliveryConfig = resendConfig, response = new Response(JSON.stringify({ id: "x" }), { status: 200 })) {
  const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(response);
  const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const context: SubmissionContext = {
    visitorKey: "203.0.113.7",
    now: 1_000_000,
    config,
    fetchImpl,
    log,
    limiters: { perVisitor: new RateLimiter(5, 600_000), global: new RateLimiter(50, 3_600_000) },
  };
  return { fetchImpl, log, context };
}

function sentBody(fetchImpl: ReturnType<typeof vi.fn>) {
  const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
  return { url, init, body: JSON.parse(String(init.body)) as Record<string, unknown> };
}

describe("handleQuoteSubmission", () => {
  it("emails a valid request through Resend and reports it as sent", async () => {
    const { fetchImpl, context } = setup();
    await expect(handleQuoteSubmission(submission(), context)).resolves.toEqual({ status: "sent" });

    const { url, init, body } = sentBody(fetchImpl);
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer re_test_secret_key");
    expect(headers["Idempotency-Key"]).toMatch(/^quote-11111111-2222-3333-4444-555555555555-[0-9a-f]{16}$/);
    expect(body).toMatchObject({
      from: "WideCode <quotes@example.com>",
      to: ["owner@example.com"],
      reply_to: "arta@example.com",
      subject: "Kërkesë për ofertë: Arta Krasniqi (Restoranti Test) – Website biznesi",
    });
    expect(body.text).toContain("Website për restorantin tonë me menu dhe rezervime.");
  });

  it("reports a provider failure honestly and never leaks the API key", async () => {
    const { context, log } = setup(
      resendConfig,
      new Response(JSON.stringify({ name: "validation_error", message: "Invalid `from` field" }), { status: 422 }),
    );
    const result = await handleQuoteSubmission(submission(), context);
    expect(result).toEqual({ status: "failed" });
    expect(JSON.stringify(result)).not.toContain("re_test");
    const logged = JSON.stringify(log.error.mock.calls);
    expect(logged).toContain("422");
    expect(logged).not.toContain("re_test_secret_key");
    expect(logged).not.toContain("arta@example.com");
  });

  it("reports network errors and timeouts as failed", async () => {
    const { context } = setup();
    context.fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new DOMException("timed out", "TimeoutError"));
    await expect(handleQuoteSubmission(submission(), context)).resolves.toEqual({ status: "failed" });
  });

  it("does not send anything when delivery is not configured", async () => {
    const { fetchImpl, context, log } = setup({ mode: "disabled", problems: ["RESEND_API_KEY is not set"] });
    await expect(handleQuoteSubmission(submission(), context)).resolves.toEqual({ status: "unavailable" });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(log.warn.mock.calls[0]?.[0]).toContain("RESEND_API_KEY is not set");
  });

  it("in log mode only prints for developers and tells the visitor it was not sent", async () => {
    const { fetchImpl, context, log } = setup({ mode: "log" });
    // Never a success: only an email accepted by Resend counts as sent.
    await expect(handleQuoteSubmission(submission(), context)).resolves.toEqual({ status: "unavailable" });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(log.info.mock.calls[0]?.[0]).toContain("NOT emailed");
  });

  it("returns field errors for invalid data without sending", async () => {
    const { fetchImpl, context } = setup();
    const result = await handleQuoteSubmission(
      submission({ values: { ...submission().values, email: "nope", description: "" } }),
      context,
    );
    expect(result).toEqual({ status: "invalid", errors: { email: "invalid", description: "required" } });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects bots that fill the honeypot", async () => {
    const { fetchImpl, context } = setup();
    await expect(handleQuoteSubmission(submission({ website: "https://spam.example" }), context)).resolves.toEqual({
      status: "rejected",
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects submissions sent faster than a person can fill the form", async () => {
    const { fetchImpl, context } = setup();
    const result = await handleQuoteSubmission(submission({ elapsedMs: quoteProtection.minFillMs - 1 }), context);
    expect(result).toEqual({ status: "tooFast" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects malformed payloads", async () => {
    const { fetchImpl, context } = setup();
    const payloads = [null, "text", [], {}, { values: "x" }, { ...submission(), elapsedMs: "5000" }, { ...submission(), website: undefined }];
    for (const [index, raw] of payloads.entries()) {
      // A separate visitor each time, so the rate limit does not answer first.
      await expect(handleQuoteSubmission(raw, { ...context, visitorKey: `visitor-${index}` })).resolves.toEqual({
        status: "rejected",
      });
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rate-limits each visitor, including invalid attempts", async () => {
    const { context } = setup();
    for (let i = 0; i < quoteProtection.perVisitor.limit; i++) {
      const result = await handleQuoteSubmission(submission(), { ...context, now: 1_000_000 + i });
      expect(result.status).toBe("sent");
    }
    const blocked = await handleQuoteSubmission(submission(), { ...context, now: 1_000_100 });
    expect(blocked).toMatchObject({ status: "rateLimited" });
    expect(blocked.status === "rateLimited" && blocked.retryAfterSeconds).toBeGreaterThan(500);

    // Other visitors are unaffected, and the window slides.
    await expect(handleQuoteSubmission(submission(), { ...context, visitorKey: "198.51.100.1" })).resolves.toEqual({
      status: "sent",
    });
    await expect(
      handleQuoteSubmission(submission(), { ...context, now: 1_000_000 + quoteProtection.perVisitor.windowMs + 10 }),
    ).resolves.toEqual({ status: "sent" });
  });

  it("caps the number of emails site-wide", async () => {
    const { fetchImpl, context } = setup();
    context.limiters = { perVisitor: new RateLimiter(100, 600_000), global: new RateLimiter(2, 3_600_000) };
    fetchImpl.mockImplementation(async () => new Response("{}", { status: 200 }));
    await handleQuoteSubmission(submission(), context);
    await handleQuoteSubmission(submission(), context);
    await expect(handleQuoteSubmission(submission(), context)).resolves.toMatchObject({ status: "rateLimited" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("recalculates the estimate on the server and ignores a forged total", async () => {
    const { fetchImpl, context } = setup();
    const forged = { pages: 7, addOns: ["blog", "payments"], total: 1 } as QuoteSubmission["estimate"];
    await handleQuoteSubmission(submission({ estimate: forged, projectSlug: "klinike-dentare" }), context);
    const text = String(sentBody(fetchImpl).body.text).replace(/\s/g, " ");
    expect(text).toContain("2 faqe shtesë × 30 €: 60 €");
    expect(text).toContain("Blog / lajme: 100 €");
    expect(text).not.toContain("Pagesa online");
    expect(text).toContain("Totali orientues: nga 559 €");
    expect(text).toContain("Klinikë dentare (http://localhost:3000/projektet/klinike-dentare)");
  });

  it("emails the complete estimator configuration, rebuilt from the configured rules", async () => {
    const { fetchImpl, context } = setup();
    const values = { ...submission().values, packageId: "professional" };
    // A tampered request: too many pages, an add-on the package already includes, unknown ids, a fake total.
    const tampered = { pages: 500, addOns: ["multilingual", "booking", "blog", "free-shop"], total: 0 } as unknown as QuoteSubmission["estimate"];
    await handleQuoteSubmission(submission({ values, estimate: tampered }), context);
    const { body } = sentBody(fetchImpl);
    const text = String(body.text).replace(/\s/g, " ");
    expect(text).toContain("Vlerësimi orientues nga llogaritësi:");
    expect(text).toContain("Numri i faqeve: 40 faqe (10 të përfshira në paketë)");
    expect(text).toContain("Të përfshira në paketë: Blog / lajme dhe Analitikë");
    expect(text).toContain("Paketa Professional: 699 €");
    expect(text).toContain("30 faqe shtesë × 30 €: 900 €");
    expect(text).toContain("Website në dy gjuhë: 150 €");
    expect(text).toContain("Rezervime ose takime: 200 €");
    expect(text).toContain("Totali orientues: nga 1949 €");
    expect(text).not.toContain("free-shop");
    // The HTML version carries the same configuration.
    expect(String(body.html)).toContain("Numri i faqeve");
    expect(String(body.html)).toContain("1949");
  });

  it("drops unknown project references and replaces malformed submission ids", async () => {
    const { fetchImpl, context } = setup();
    await handleQuoteSubmission(submission({ projectSlug: "../admin", submissionId: "bad id\r\nX: y" }), context);
    const { init, body } = sentBody(fetchImpl);
    expect(String(body.text)).not.toContain("admin");
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toMatch(/^quote-[0-9a-f-]{36}-[0-9a-f]{16}$/);
  });

  it("retries of an unchanged request reuse the key and body, so Resend sends only one email", async () => {
    const { fetchImpl, context } = setup();
    await handleQuoteSubmission(submission(), context);
    // Minutes later (e.g. the first response was lost): Resend needs the same key AND the same body.
    await handleQuoteSubmission(submission(), { ...context, now: context.now! + 5 * 60_000 });
    const [first, retry] = fetchImpl.mock.calls.map(([, init]) => init as RequestInit);
    expect(retry!.body).toBe(first!.body);
    const key = (init: RequestInit) => (init.headers as Record<string, string>)["Idempotency-Key"];
    expect(key(retry!)).toBe(key(first!));
  });

  it("a corrected request gets a new key, so Resend does not reject it as a conflicting repeat", async () => {
    const { fetchImpl, context } = setup();
    await handleQuoteSubmission(submission(), context);
    const corrected = submission();
    corrected.values.phone = "+383 44 123 456";
    await handleQuoteSubmission(corrected, context);
    const [first, second] = fetchImpl.mock.calls.map(([, init]) => (init as RequestInit).headers as Record<string, string>);
    expect(second!["Idempotency-Key"]).not.toBe(first!["Idempotency-Key"]);
    // Both keep the form's reference, and stay within Resend's 256-character limit.
    expect(second!["Idempotency-Key"]).toMatch(/^quote-11111111-2222-3333-4444-555555555555-/);
    expect(second!["Idempotency-Key"]!.length).toBeLessThanOrEqual(256);
  });
});

describe("buildQuoteEmail", () => {
  const request: QuoteRequest = {
    name: '<img src=x onerror="alert(1)">',
    business: "A & B",
    email: "arta@example.com",
    phone: "",
    projectType: "other",
    packageId: "unsure",
    budget: "unsure",
    timeline: "asap",
    description: "<script>alert('x')</script>\nRreshti i dytë",
    estimate: null,
    projectSlug: null,
  };
  const email = buildQuoteEmail(
    request,
    { submissionId: "abc12345", siteUrl: new URL("https://example.test") },
    getDictionary(),
  );

  it("escapes every visitor value in the HTML version", () => {
    expect(email.html).not.toContain("<script>");
    expect(email.html).not.toContain("<img");
    expect(email.html).toContain("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
    expect(email.html).toContain("A &amp; B");
  });

  it("has a readable plain-text version with all fields", () => {
    expect(email.text).toContain("Paketa: Ende nuk e di");
    expect(email.text).toContain("Numri i telefonit: Nuk është dhënë");
    expect(email.text).toContain("Referenca: abc12345");
    expect(email.replyTo).toBe("arta@example.com");
  });

  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
});

describe("resolveDeliveryConfig", () => {
  const complete = {
    RESEND_API_KEY: "re_123",
    QUOTE_TO_EMAIL: "owner@example.com",
    QUOTE_FROM_EMAIL: "WideCode <quotes@example.com>",
  };

  it("uses Resend when fully configured", () => {
    expect(resolveDeliveryConfig({ ...complete, NODE_ENV: "production" })).toEqual({
      mode: "resend",
      apiKey: "re_123",
      to: ["owner@example.com"],
      from: "WideCode <quotes@example.com>",
      endpoint: "https://api.resend.com/emails",
    });
    expect(resolveDeliveryConfig({ ...complete, QUOTE_TO_EMAIL: "a@example.com, b@example.com" })).toMatchObject({
      to: ["a@example.com", "b@example.com"],
    });
  });

  it("is disabled in production when anything is missing or invalid, naming only the variables", () => {
    const result = resolveDeliveryConfig({ NODE_ENV: "production", RESEND_API_KEY: "re_secret", QUOTE_FROM_EMAIL: "bad" });
    expect(result.mode).toBe("disabled");
    expect(result.mode === "disabled" && result.problems).toEqual([
      "QUOTE_TO_EMAIL is not set",
      'QUOTE_FROM_EMAIL must look like "WideCode <name@your-domain>"',
    ]);
    expect(JSON.stringify(result)).not.toContain("re_secret");
    expect(resolveDeliveryConfig({ ...complete, NODE_ENV: "production", QUOTE_TO_EMAIL: "x@y.com; z@w.com" }).mode).toBe(
      "disabled",
    );
  });

  it("with only the API key and receiving address set, never sends and names only the missing sender", () => {
    const partial = { RESEND_API_KEY: "re_123", QUOTE_TO_EMAIL: "owner@example.com" };
    expect(resolveDeliveryConfig({ ...partial, NODE_ENV: "development" })).toEqual({ mode: "log" });
    expect(resolveDeliveryConfig({ ...partial, NODE_ENV: "production" })).toEqual({
      mode: "disabled",
      problems: ["QUOTE_FROM_EMAIL is not set"],
    });
    // Resend's own test sender completes the configuration (it delivers only to the Resend account's address).
    expect(
      resolveDeliveryConfig({ ...partial, NODE_ENV: "production", QUOTE_FROM_EMAIL: "WideCode <onboarding@resend.dev>" }).mode,
    ).toBe("resend");
  });

  it("only logs (internally) in local development without Resend", () => {
    expect(resolveDeliveryConfig({ NODE_ENV: "development" })).toEqual({ mode: "log" });
  });

  it("accepts an endpoint override for tests only on the loopback interface", () => {
    expect(resolveDeliveryConfig({ ...complete, RESEND_API_URL: "http://127.0.0.1:3199/emails" })).toMatchObject({
      mode: "resend",
      endpoint: "http://127.0.0.1:3199/emails",
    });
    expect(resolveDeliveryConfig({ ...complete, RESEND_API_URL: "http://localhost:3199/emails" }).mode).toBe("resend");
    for (const url of ["https://evil.example/emails", "http://127.0.0.1.evil.example/", "file:///etc/passwd", "not a url"]) {
      const result = resolveDeliveryConfig({ ...complete, NODE_ENV: "production", RESEND_API_URL: url });
      expect(result.mode, url).toBe("disabled");
      expect(JSON.stringify(result)).not.toContain("re_123");
    }
  });

  it("honours QUOTE_DELIVERY=log, even with Resend configured, except on Vercel production", () => {
    expect(resolveDeliveryConfig({ ...complete, NODE_ENV: "production", QUOTE_DELIVERY: "log" })).toEqual({ mode: "log" });
    expect(
      resolveDeliveryConfig({ ...complete, NODE_ENV: "production", VERCEL_ENV: "production", QUOTE_DELIVERY: "log" }).mode,
    ).toBe("disabled");
    expect(resolveDeliveryConfig({ NODE_ENV: "development", VERCEL_ENV: "production" }).mode).toBe("disabled");
  });
});

describe("rate limiting helpers", () => {
  it("takes the first forwarded address", () => {
    expect(visitorKey(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
    expect(visitorKey(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(visitorKey(new Headers())).toBe("unknown");
    expect(visitorKey(new Headers({ "x-forwarded-for": "x".repeat(500) }))).toHaveLength(64);
  });

  it("bounds memory by forgetting the least recently used keys", () => {
    const limiter = new RateLimiter(1, 60_000, 3);
    for (const key of ["a", "b", "c", "d"]) expect(limiter.hit(key, 0).allowed).toBe(true);
    // "a" was evicted, so it is allowed again; "d" is still tracked.
    expect(limiter.hit("a", 1).allowed).toBe(true);
    expect(limiter.hit("d", 1).allowed).toBe(false);
  });
});
