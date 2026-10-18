import type { QuoteEmail } from "@/lib/quote-email";
import { isValidEmail } from "@/lib/quote-request";

/**
 * How quote requests are delivered, decided from server-side environment
 * variables only (never NEXT_PUBLIC_*, so nothing here reaches the browser):
 *
 * - "resend": RESEND_API_KEY, QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL are set and
 *   valid. Requests are emailed through the Resend API.
 * - "log": local testing. Requests are validated and printed to the server
 *   console; no email is sent and the visitor is told so. Used automatically
 *   in `next dev` when Resend is not configured, or when QUOTE_DELIVERY=log
 *   (e.g. for e2e tests). Never allowed on a Vercel production deployment.
 * - "disabled": anything else. The form says it is not active yet and the
 *   server refuses submissions. It never pretends a request was sent.
 */
export type DeliveryConfig =
  | { mode: "resend"; apiKey: string; to: string[]; from: string }
  | { mode: "log" }
  /** `problems` names missing or invalid variables (never their values), for server logs. */
  | { mode: "disabled"; problems: string[] };

export type DeliveryMode = DeliveryConfig["mode"];

type Env = Record<string, string | undefined>;

const RESEND_ENDPOINT = "https://api.resend.com/emails";
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

  if (problems.length === 0) return { mode: "resend", apiKey, to, from };
  // Local development without (complete) Resend settings: test mode instead of a dead form.
  if (env.NODE_ENV === "development" && logAllowed && requested !== "resend") return { mode: "log" };
  return { mode: "disabled", problems };
}

type Logger = Pick<Console, "info" | "warn" | "error">;

/**
 * Sends the email through Resend's REST API. Returns whether Resend accepted it.
 * Logs only the status and Resend's error name, never the API key or form data.
 */
export async function sendWithResend(
  config: Extract<DeliveryConfig, { mode: "resend" }>,
  email: QuoteEmail,
  idempotencyKey: string,
  { fetchImpl = fetch, log = console }: { fetchImpl?: typeof fetch; log?: Logger } = {},
): Promise<boolean> {
  try {
    const response = await fetchImpl(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        // Resend ignores repeats of the same key for 24 hours, so a retried request is not emailed twice.
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: config.from,
        to: config.to,
        reply_to: email.replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
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

/** Test mode: prints the request to the server console instead of sending it. */
export function logQuoteEmail(email: QuoteEmail, log: Logger = console): void {
  log.info(
    [
      "[quote] TEST MODE: the request below was validated but NOT emailed (Resend is not configured).",
      `Subject: ${email.subject}`,
      `Reply-To: ${email.replyTo}`,
      "",
      email.text,
    ].join("\n"),
  );
}
