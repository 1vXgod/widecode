import { createHash } from "node:crypto";
import type { QuoteEmail } from "@/lib/quote-email";
import { isValidEmail } from "@/lib/quote-request";

/**
 * How quote requests are delivered, decided from server-side environment
 * variables only (never NEXT_PUBLIC_*, so nothing here reaches the browser):
 *
 * - "resend": RESEND_API_KEY, QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL are set and
 *   valid. Requests are emailed through the Resend API. This is the only mode
 *   in which a visitor ever sees a success confirmation.
 * - "log": developer aid. Requests are validated and printed to the server
 *   console only. Used automatically in `next dev` when Resend is not
 *   configured, or when QUOTE_DELIVERY=log. Visitors are never told about it:
 *   the form looks normal and a submission ends with the "not sent" message.
 *   Never allowed on a Vercel production deployment.
 * - "disabled": anything else. The page shows a "temporarily unavailable"
 *   message instead of the form and the server refuses submissions.
 *
 * Automated tests use "resend" against a local mock server (RESEND_API_URL),
 * so the real success path is tested without sending email.
 */
export type DeliveryConfig =
  | { mode: "resend"; apiKey: string; to: string[]; from: string; endpoint: string }
  | { mode: "log" }
  /** `problems` names missing or invalid variables (never their values), for server logs. */
  | { mode: "disabled"; problems: string[] };

export type DeliveryMode = DeliveryConfig["mode"];

type Env = Record<string, string | undefined>;

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * RESEND_API_URL replaces the Resend endpoint for automated tests. It is only
 * accepted on this machine's loopback interface, so a misconfiguration can
 * never send the API key or visitors' data to another host.
 */
function resolveEndpoint(value: string | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return RESEND_ENDPOINT;
  try {
    const url = new URL(raw);
    return (url.protocol === "http:" || url.protocol === "https:") && LOOPBACK_HOSTS.has(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}
const RESEND_TIMEOUT_MS = 10_000;
const MAX_RECIPIENTS = 5;

/** Accepts "ofertat@example.com" or "WideCode <ofertat@example.com>". */
function isValidSender(value: string): boolean {
  const match = /^(?:[^<>\r\n"]{1,64}\s)?<([^<>\s]+)>$/.exec(value);
  return isValidEmail(match ? match[1]! : value);
}

export function resolveDeliveryConfig(env: Env = process.env): DeliveryConfig {
  const requested = env.QUOTE_DELIVERY?.trim().toLowerCase();
  const logAllowed = env.VERCEL_ENV !== "production";

  if (requested === "log") {
    return logAllowed
      ? { mode: "log" }
      : { mode: "disabled", problems: ["QUOTE_DELIVERY=log is not allowed on a production deployment"] };
  }

  const problems: string[] = [];
  const apiKey = env.RESEND_API_KEY?.trim() ?? "";
  if (!apiKey) problems.push("RESEND_API_KEY is not set");

  const to = (env.QUOTE_TO_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (to.length === 0) problems.push("QUOTE_TO_EMAIL is not set");
  else if (to.length > MAX_RECIPIENTS || !to.every(isValidEmail)) {
    problems.push(`QUOTE_TO_EMAIL must be an email address (or up to ${MAX_RECIPIENTS}, comma-separated)`);
  }

  const from = env.QUOTE_FROM_EMAIL?.trim() ?? "";
  if (!from) problems.push("QUOTE_FROM_EMAIL is not set");
  else if (!isValidSender(from)) problems.push('QUOTE_FROM_EMAIL must look like "WideCode <name@your-domain>"');

  const endpoint = resolveEndpoint(env.RESEND_API_URL);
  if (!endpoint) problems.push("RESEND_API_URL may only point to a local (loopback) test server");

  if (problems.length === 0 && endpoint) return { mode: "resend", apiKey, to, from, endpoint };
  // Local development without (complete) Resend settings: log instead of a dead form.
  if (env.NODE_ENV === "development" && logAllowed && requested !== "resend") return { mode: "log" };
  return { mode: "disabled", problems };
}

type Logger = Pick<Console, "info" | "warn" | "error">;

/**
 * Idempotency key for one email: the form's submission id plus a hash of the
 * exact request body. Resend answers a repeat of the same key and body with the
 * original result (no second email) for 24 hours, but rejects the same key with
 * a different body (HTTP 409). Hashing the body means a retry of an unchanged
 * request is deduplicated, while a corrected request is sent as a new email.
 */
export function quoteIdempotencyKey(submissionId: string, body: string): string {
  return `quote-${submissionId}-${createHash("sha256").update(body).digest("hex").slice(0, 16)}`;
}

/**
 * Sends the email through Resend's REST API. Returns whether Resend accepted it.
 * Logs only the status and Resend's error name, never the API key or form data.
 */
export async function sendWithResend(
  config: Extract<DeliveryConfig, { mode: "resend" }>,
  email: QuoteEmail,
  submissionId: string,
  { fetchImpl = fetch, log = console }: { fetchImpl?: typeof fetch; log?: Logger } = {},
): Promise<boolean> {
  const body = JSON.stringify({
    from: config.from,
    to: config.to,
    reply_to: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
  try {
    const response = await fetchImpl(config.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": quoteIdempotencyKey(submissionId, body),
      },
      body,
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      cache: "no-store",
    });
    if (response.ok) return true;

    let reason = "unknown error";
    try {
      const body = (await response.json()) as { name?: unknown };
      if (typeof body.name === "string") reason = body.name.slice(0, 80);
    } catch {
      // Non-JSON error body; the status code is enough.
    }
    log.error(`[quote] Resend did not accept the email (HTTP ${response.status}, ${reason}).`);
    return false;
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown error";
    log.error(`[quote] Could not reach Resend (${reason}).`);
    return false;
  }
}

/** "log" mode: prints the request to the server console (developers only) instead of sending it. */
export function logQuoteEmail(email: QuoteEmail, log: Logger = console): void {
  log.info(
    [
      "[quote] Resend is not configured: the request below was validated but NOT emailed. The visitor was told it was not sent.",
      `Subject: ${email.subject}`,
      `Reply-To: ${email.replyTo}`,
      "",
      email.text,
    ].join("\n"),
  );
}
