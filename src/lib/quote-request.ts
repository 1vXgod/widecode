import type { AddOnId } from "@/config/estimator";
import { getPackage, packageIds, type PackageId } from "@/config/pricing";
import { findProject, type ProjectSlug } from "@/config/projects";
import {
  budgetIds,
  projectTypeIds,
  quoteLimits,
  quotePackageIds,
  timelineIds,
  type BudgetId,
  type ProjectTypeId,
  type QuotePackageId,
  type TimelineId,
} from "@/config/quote";
import { services } from "@/config/services";
import { ESTIMATE_PARAMS, normalizeInput, parseEstimateParams, readParam, type EstimateInput, type ParamSource } from "@/lib/estimator";
import { QUOTE_ESTIMATE_PARAM, QUOTE_PROJECT_PARAM } from "@/lib/quote";

/**
 * Quote request data: sanitization and validation shared by the form (client)
 * and the Server Action (server), and safe parsing of pre-fill URL parameters.
 * Everything here is pure and never throws on untrusted input.
 */

export const quoteFields = [
  "name",
  "business",
  "email",
  "phone",
  "projectType",
  "packageId",
  "budget",
  "timeline",
  "description",
] as const;

export type QuoteField = (typeof quoteFields)[number];

/** Raw form values, exactly as typed or selected. */
export type QuoteFormValues = Record<QuoteField, string>;

export type QuoteFieldError = "required" | "tooShort" | "tooLong" | "invalid";

export type QuoteFieldErrors = Partial<Record<QuoteField, QuoteFieldError>>;

/** Validated, sanitized form values. */
export type QuoteValues = {
  name: string;
  /** Empty when not given. */
  business: string;
  email: string;
  /** Empty when not given. */
  phone: string;
  projectType: ProjectTypeId;
  packageId: QuotePackageId;
  budget: BudgetId;
  timeline: TimelineId;
  description: string;
};

/** A complete, trusted quote request, ready for delivery. */
export type QuoteRequest = QuoteValues & {
  /** Estimator choices, re-normalized on the server; only for the selected priced package. */
  estimate: EstimateInput | null;
  /** Website concept the visitor came from, if any. */
  projectSlug: ProjectSlug | null;
};

/** Estimator choices sent with the form; the price is always recalculated, never sent. */
export type QuoteEstimateChoices = { pages: number | null; addOns: AddOnId[] };

/** What the form sends to the Server Action. */
export type QuoteSubmission = {
  values: QuoteFormValues;
  estimate: QuoteEstimateChoices | null;
  projectSlug: string | null;
  /** Honeypot: hidden from people, so anything in it means a bot filled the form. */
  website: string;
  /** Milliseconds between the form appearing and the submission. */
  elapsedMs: number;
  /** Random id per form fill; makes retries of the same request idempotent. */
  submissionId: string;
};

export const emptyQuoteValues: QuoteFormValues = {
  name: "",
  business: "",
  email: "",
  phone: "",
  projectType: "",
  packageId: "",
  budget: "",
  timeline: "",
  description: "",
};

// Control characters (except tab and newline, handled per field), zero-width
// characters and bidirectional overrides, which can disguise text in emails.
// Built from code points so the source never contains invisible characters.
const UNSAFE_RANGES: ReadonlyArray<[number, number]> = [
  [0x00, 0x08],
  [0x0b, 0x0c],
  [0x0e, 0x1f],
  [0x7f, 0x9f],
  [0x200b, 0x200f],
  [0x202a, 0x202e],
  [0x2060, 0x2064],
  [0x2066, 0x2069],
  [0xfeff, 0xfeff],
];
const codePoint = (code: number) => `${String.fromCharCode(92)}u${code.toString(16).padStart(4, "0")}`;
const UNSAFE_CHARS = new RegExp(`[${UNSAFE_RANGES.map(([from, to]) => `${codePoint(from)}-${codePoint(to)}`).join("")}]`, "g");

// Deliberately stricter than RFC 5322: no spaces, quotes, commas, angle
// brackets or semicolons, so one value can never become several recipients.
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"']+\.[^\s@<>()[\]\\,;:"'.]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9\s()-]+$/;
const MIN_PHONE_DIGITS = 6;

/** One line of text: no control characters, line breaks or repeated spaces. */
export function cleanLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.normalize("NFC").replace(/[\t\r\n]+/g, " ").replace(UNSAFE_CHARS, "").replace(/ {2,}/g, " ").trim();
}

/** Multi-line text: keeps line breaks (normalized to \n), at most two blank lines in a row. */
export function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, " ")
    .replace(UNSAFE_CHARS, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function oneOf<T extends string>(options: readonly T[], value: unknown): T | null {
  return typeof value === "string" && (options as readonly string[]).includes(value) ? (value as T) : null;
}

function isPackageId(value: unknown): value is PackageId {
  return oneOf(packageIds, value) !== null;
}

export function isValidEmail(value: string): boolean {
  return value.length <= quoteLimits.email.max && EMAIL_PATTERN.test(value);
}

export function isValidPhone(value: string): boolean {
  if (value.length > quoteLimits.phone.max || !PHONE_PATTERN.test(value)) return false;
  return value.replace(/\D/g, "").length >= MIN_PHONE_DIGITS;
}

type ValidationResult = { ok: true; values: QuoteValues } | { ok: false; errors: QuoteFieldErrors };

/** Validates form values. Accepts anything (e.g. a hand-crafted request) and never throws. */
export function validateQuoteValues(raw: unknown): ValidationResult {
  const input = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<QuoteField, unknown>>;
  const errors: QuoteFieldErrors = {};

  const name = cleanLine(input.name);
  if (!name) errors.name = "required";
  else if (name.length < quoteLimits.name.min) errors.name = "tooShort";
  else if (name.length > quoteLimits.name.max) errors.name = "tooLong";

  const business = cleanLine(input.business);
  if (business.length > quoteLimits.business.max) errors.business = "tooLong";

  const email = cleanLine(input.email);
  if (!email) errors.email = "required";
  else if (!isValidEmail(email)) errors.email = "invalid";

  const phone = cleanLine(input.phone);
  if (phone && !isValidPhone(phone)) errors.phone = "invalid";

  const projectType = oneOf(projectTypeIds, input.projectType);
  if (!projectType) errors.projectType = "required";

  const packageId = oneOf(quotePackageIds, input.packageId);
  if (!packageId) errors.packageId = "required";

  const budget = oneOf(budgetIds, input.budget);
  if (!budget) errors.budget = "required";

  const timeline = oneOf(timelineIds, input.timeline);
  if (!timeline) errors.timeline = "required";

  const description = cleanText(input.description);
  if (!description) errors.description = "required";
  else if (description.length < quoteLimits.description.min) errors.description = "tooShort";
  else if (description.length > quoteLimits.description.max) errors.description = "tooLong";

  if (!projectType || !packageId || !budget || !timeline || Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    values: { name, business, email, phone, projectType, packageId, budget, timeline, description },
  };
}

/** Whether the estimator applies to a package (priced packages only; Custom is always a quote). */
export function hasEstimate(packageId: QuotePackageId | ""): packageId is PackageId {
  return isPackageId(packageId) && getPackage(packageId).startingPrice !== null;
}

/**
 * Rebuilds estimator choices for the selected package from untrusted input.
 * Returns null when the package has no estimate; prices are never taken from input.
 */
export function normalizeQuoteEstimate(packageId: QuotePackageId, raw: unknown): EstimateInput | null {
  if (!hasEstimate(packageId) || !raw || typeof raw !== "object") return null;
  const { pages, addOns } = raw as { pages?: unknown; addOns?: unknown };
  return normalizeInput({
    packageId,
    pages: typeof pages === "number" ? pages : undefined,
    addOns: Array.isArray(addOns) ? addOns.slice(0, 20) : [],
  });
}

/** Project type that matches a package, via the service ↔ package mapping. */
export function projectTypeForPackage(packageId: PackageId): ProjectTypeId | null {
  return services.find((s) => s.packages.includes(packageId))?.id ?? null;
}

/** Form pre-selections taken from the URL. */
export type QuotePrefill = {
  packageId: PackageId | null;
  projectType: ProjectTypeId | null;
  /** Present when the visitor arrives from the estimator with a priced package. */
  estimate: EstimateInput | null;
  projectSlug: ProjectSlug | null;
};

export const emptyQuotePrefill: QuotePrefill = { packageId: null, projectType: null, estimate: null, projectSlug: null };

/**
 * Reads ?paketa=…&faqe=…&shtesa=…&vleresim=1&projekti=… from pricing, project
 * and estimator links. Unknown or malformed values are ignored, never guessed.
 */
export function parseQuotePrefill(source: ParamSource): QuotePrefill {
  const project = findProject(readParam(source, QUOTE_PROJECT_PARAM)?.trim() ?? "");
  const requested = readParam(source, ESTIMATE_PARAMS.package)?.trim();
  const packageId = isPackageId(requested) ? requested : (project?.packageId ?? null);

  // Estimator links carry the marker; older links (before it existed) are recognised by pages or add-ons.
  const fromEstimator =
    readParam(source, QUOTE_ESTIMATE_PARAM)?.trim() === "1" ||
    readParam(source, ESTIMATE_PARAMS.pages) !== undefined ||
    readParam(source, ESTIMATE_PARAMS.addOns) !== undefined;
  // parseEstimateParams clamps pages and drops unknown or unavailable add-ons.
  const estimate =
    packageId && isPackageId(requested) && fromEstimator && hasEstimate(packageId) ? parseEstimateParams(source) : null;

  return {
    packageId,
    projectType: project?.category ?? (packageId ? projectTypeForPackage(packageId) : null),
    estimate,
    projectSlug: project?.slug ?? null,
  };
}
