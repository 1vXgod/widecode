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
    expect(headers["Idempotency-Key"]).toBe("quote-11111111-2222-3333-4444-555555555555");
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

  it("only logs in test mode and says so", async () => {
    const { fetchImpl, context, log } = setup({ mode: "log" });
    await expect(handleQuoteSubmission(submission(), context)).resolves.toEqual({ status: "test" });
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
    const { context } = setup({ mode: "log" });
    for (let i = 0; i < quoteProtection.perVisitor.limit; i++) {
      const result = await handleQuoteSubmission(submission(), { ...context, now: 1_000_000 + i });
      expect(result.status).toBe("test");
    }
    const blocked = await handleQuoteSubmission(submission(), { ...context, now: 1_000_100 });
    expect(blocked).toMatchObject({ status: "rateLimited" });
    expect(blocked.status === "rateLimited" && blocked.retryAfterSeconds).toBeGreaterThan(500);

    // Other visitors are unaffected, and the window slides.
    await expect(handleQuoteSubmission(submission(), { ...context, visitorKey: "198.51.100.1" })).resolves.toEqual({
      status: "test",
    });
    await expect(
      handleQuoteSubmission(submission(), { ...context, now: 1_000_000 + quoteProtection.perVisitor.windowMs + 10 }),
    ).resolves.toEqual({ status: "test" });
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

  it("drops unknown project references and replaces malformed submission ids", async () => {
    const { fetchImpl, context } = setup();
    await handleQuoteSubmission(submission({ projectSlug: "../admin", submissionId: "bad id\r\nX: y" }), context);
    const { init, body } = sentBody(fetchImpl);
    expect(String(body.text)).not.toContain("admin");
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toMatch(/^quote-[0-9a-f-]{36}$/);
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
    { submissionId: "abc12345", submittedAt: new Date("2026-10-19T08:30:00Z"), siteUrl: new URL("https://example.test") },
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
    expect(email.text).toContain("Dërguar më (UTC): 2026-10-19 08:30");
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

  it("falls back to test mode in local development", () => {
    expect(resolveDeliveryConfig({ NODE_ENV: "development" })).toEqual({ mode: "log" });
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
