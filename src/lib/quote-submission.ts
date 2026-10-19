import { findProject } from "@/config/projects";
import { quoteProtection } from "@/config/quote";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { defaultLocale, isLocale } from "@/i18n/config";
import { logQuoteEmail, resolveDeliveryConfig, sendWithResend, type DeliveryConfig } from "@/lib/quote-delivery";
import { buildQuoteEmail } from "@/lib/quote-email";
import {
  normalizeQuoteEstimate,
  validateQuoteValues,
  type QuoteFieldErrors,
  type QuoteRequest,
} from "@/lib/quote-request";
import { RateLimiter } from "@/lib/rate-limit";

/** What the Server Action returns. Shaped for the UI; never contains secrets or internals. */
export type QuoteSubmitResult =
  /** Emailed through Resend. The only result that leads to a success confirmation. */
  | { status: "sent" }
  | { status: "invalid"; errors: QuoteFieldErrors }
  | { status: "rateLimited"; retryAfterSeconds: number }
  /** Sent sooner after the form appeared than a person can fill it in. */
  | { status: "tooFast" }
  /** Malformed request or honeypot filled in. */
  | { status: "rejected" }
  /** Delivery is not configured (or only logged for developers); nothing was sent. */
  | { status: "unavailable" }
  /** The email provider failed; nothing was sent. */
  | { status: "failed" };

type Logger = Pick<Console, "info" | "warn" | "error">;

export type SubmissionContext = {
  /** Rate-limit key for the visitor, usually the IP address. */
  visitorKey: string;
  now?: number;
  config?: DeliveryConfig;
  fetchImpl?: typeof fetch;
  limiters?: { perVisitor: RateLimiter; global: RateLimiter };
  log?: Logger;
};

// Shared by all requests handled by this server instance (see RateLimiter).
const defaultLimiters = {
  perVisitor: new RateLimiter(quoteProtection.perVisitor.limit, quoteProtection.perVisitor.windowMs),
  global: new RateLimiter(quoteProtection.global.limit, quoteProtection.global.windowMs),
};

const SUBMISSION_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;
/** A form left open longer than this is still fine; beyond it the timing value is implausible. */
const MAX_ELAPSED_MS = 7 * 24 * 60 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Handles one quote request from untrusted input: rate limiting, spam checks,
 * validation, then delivery. Only reports "sent" when Resend accepted the email.
 */
export async function handleQuoteSubmission(raw: unknown, context: SubmissionContext): Promise<QuoteSubmitResult> {
  const {
    visitorKey,
    now = Date.now(),
    config = resolveDeliveryConfig(),
    fetchImpl,
    limiters = defaultLimiters,
    log = console,
  } = context;

  const visitorLimit = limiters.perVisitor.hit(visitorKey, now);
  if (!visitorLimit.allowed) {
    return { status: "rateLimited", retryAfterSeconds: Math.ceil(visitorLimit.retryAfterMs / 1000) };
  }

  if (!isRecord(raw) || !isRecord(raw.values)) return { status: "rejected" };

  if (typeof raw.website !== "string" || raw.website.trim() !== "") {
    log.warn("[quote] Rejected a request with the honeypot field filled in.");
    return { status: "rejected" };
  }

  const elapsed = raw.elapsedMs;
  if (typeof elapsed !== "number" || !Number.isFinite(elapsed) || elapsed > MAX_ELAPSED_MS) return { status: "rejected" };
  if (elapsed < quoteProtection.minFillMs) return { status: "tooFast" };

  const validation = validateQuoteValues(raw.values);
  if (!validation.ok) return { status: "invalid", errors: validation.errors };

  if (config.mode === "disabled") {
    log.warn(`[quote] Quote requests are disabled: ${config.problems.join("; ")}.`);
    return { status: "unavailable" };
  }

  const request: QuoteRequest = {
    ...validation.values,
    estimate: normalizeQuoteEstimate(validation.values.packageId, raw.estimate),
    projectSlug: typeof raw.projectSlug === "string" ? (findProject(raw.projectSlug)?.slug ?? null) : null,
    // Only a supported language is accepted; anything else (or nothing) counts as Albanian.
    locale: isLocale(raw.locale) ? raw.locale : defaultLocale,
  };

  const submissionId =
    typeof raw.submissionId === "string" && SUBMISSION_ID_PATTERN.test(raw.submissionId)
      ? raw.submissionId
      : crypto.randomUUID();
  const email = buildQuoteEmail(request, { submissionId, siteUrl: siteConfig.url }, getDictionary());

  if (config.mode === "log") {
    // Developer aid only: the visitor gets the same honest "not sent" answer as when delivery is off.
    logQuoteEmail(email, log);
    return { status: "unavailable" };
  }

  const globalLimit = limiters.global.hit("all", now);
  if (!globalLimit.allowed) {
    log.warn("[quote] Site-wide limit for quote emails reached.");
    return { status: "rateLimited", retryAfterSeconds: Math.ceil(globalLimit.retryAfterMs / 1000) };
  }

  const sent = await sendWithResend(config, email, submissionId, { fetchImpl, log });
  return sent ? { status: "sent" } : { status: "failed" };
}
