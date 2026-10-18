import { packageIds } from "@/config/pricing";
import { serviceIds } from "@/config/services";

/**
 * Quote request form options and limits. Labels live in
 * src/content/<locale>/contact-page.ts, keyed by these ids.
 */

/** Project types mirror the services, plus "other" for anything that does not fit. */
export const projectTypeIds = [...serviceIds, "other"] as const;
export type ProjectTypeId = (typeof projectTypeIds)[number];

/** Every pricing package, plus "unsure" for visitors who want advice. */
export const quotePackageIds = [...packageIds, "unsure"] as const;
export type QuotePackageId = (typeof quotePackageIds)[number];

export const budgetIds = ["under-300", "300-600", "600-1000", "1000-2000", "over-2000", "unsure"] as const;
export type BudgetId = (typeof budgetIds)[number];

export const timelineIds = ["asap", "within-month", "one-to-three-months", "flexible"] as const;
export type TimelineId = (typeof timelineIds)[number];

/** Character limits, enforced on the client and again on the server. */
export const quoteLimits = {
  name: { min: 2, max: 100 },
  business: { max: 120 },
  email: { max: 254 },
  phone: { max: 20 },
  description: { min: 20, max: 5000 },
} as const;

/** Anti-spam and rate limiting. */
export const quoteProtection = {
  /** Submissions sent sooner than this after the form appeared are treated as automated. */
  minFillMs: 3000,
  /** Requests per visitor (IP address) within the window. */
  perVisitor: { limit: 5, windowMs: 10 * 60 * 1000 },
  /** Delivery attempts for the whole site within the window (protects the email quota). */
  global: { limit: 50, windowMs: 60 * 60 * 1000 },
} as const;
