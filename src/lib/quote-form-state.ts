import { findProject, type ProjectSlug } from "@/config/projects";
import { budgetIds, projectTypeIds, quoteLimits, quotePackageIds, timelineIds } from "@/config/quote";
import type { EstimateInput } from "@/lib/estimator";
import {
  emptyQuoteValues,
  normalizeQuoteEstimate,
  quoteFields,
  type QuoteField,
  type QuoteFormValues,
  type QuotePrefill,
} from "@/lib/quote-request";

/**
 * State helpers for the quote form: applying the configuration from the URL
 * and keeping an unsent draft, so neither a trip back to the estimator nor a
 * page refresh costs the visitor what they already entered. Pure, except for
 * the sessionStorage wrappers at the end.
 */

/** Everything in the form a visitor would not want to enter twice. */
export type QuoteFormState = {
  values: QuoteFormValues;
  estimate: EstimateInput | null;
  projectSlug: ProjectSlug | null;
};

/**
 * Applies the configuration from a (new) URL: what the URL states replaces the
 * old choice, what it does not state is kept. Contact details are never touched.
 */
export function applyPrefill(state: QuoteFormState, prefill: QuotePrefill): QuoteFormState {
  return {
    values: {
      ...state.values,
      packageId: prefill.packageId ?? state.values.packageId,
      projectType: prefill.projectType ?? state.values.projectType,
    },
    estimate: prefill.estimate ?? state.estimate,
    projectSlug: prefill.projectSlug ?? state.projectSlug,
  };
}

const allowedOptions: Partial<Record<QuoteField, readonly string[]>> = {
  projectType: projectTypeIds,
  packageId: quotePackageIds,
  budget: budgetIds,
  timeline: timelineIds,
};

/**
 * Reads a stored draft. Storage can be edited by hand, so every value is
 * checked like URL input: unknown options are dropped, text is cut to the
 * form's limits, and the estimate is rebuilt from the configured rules.
 */
export function parseQuoteDraft(raw: unknown): QuoteFormState | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { values, estimate, projectSlug } = raw as Record<string, unknown>;
  if (typeof values !== "object" || values === null) return null;

  const parsed = { ...emptyQuoteValues };
  for (const field of quoteFields) {
    const value = (values as Record<string, unknown>)[field];
    if (typeof value !== "string") continue;
    const options = allowedOptions[field];
    if (options) {
      if (options.includes(value)) parsed[field] = value;
    } else {
      parsed[field] = value.slice(0, quoteLimits[field as keyof typeof quoteLimits].max);
    }
  }

  const estimatePackage = (estimate as { packageId?: unknown } | null)?.packageId;
  return {
    values: parsed,
    estimate:
      typeof estimatePackage === "string" && (quotePackageIds as readonly string[]).includes(estimatePackage)
        ? normalizeQuoteEstimate(estimatePackage as (typeof quotePackageIds)[number], estimate)
        : null,
    projectSlug: typeof projectSlug === "string" ? (findProject(projectSlug)?.slug ?? null) : null,
  };
}

/**
 * Restores a draft into a freshly opened form: the URL's configuration wins,
 * and the draft fills in whatever is still empty.
 */
export function mergeDraft(state: QuoteFormState, draft: QuoteFormState, prefill: QuotePrefill): QuoteFormState {
  const values = { ...state.values };
  for (const field of quoteFields) {
    if (values[field] === "") values[field] = draft.values[field];
  }
  return {
    values,
    estimate: prefill.estimate ?? state.estimate ?? draft.estimate,
    projectSlug: prefill.projectSlug ?? state.projectSlug ?? draft.projectSlug,
  };
}

/** Whether the visitor has entered or chosen anything worth keeping. */
export function isEmptyState(state: QuoteFormState): boolean {
  return quoteFields.every((field) => state.values[field] === "") && !state.estimate && !state.projectSlug;
}

// The draft lives in sessionStorage: only in this browser tab, gone when the
// tab closes, and cleared once the request is sent. It never leaves the browser.
const DRAFT_KEY = "widecode:quote-draft";

export function readStoredDraft(): QuoteFormState | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? parseQuoteDraft(JSON.parse(raw)) : null;
  } catch {
    // Storage blocked (privacy settings) or malformed JSON: start empty.
    return null;
  }
}

export function storeDraft(state: QuoteFormState): void {
  try {
    if (isEmptyState(state)) window.sessionStorage.removeItem(DRAFT_KEY);
    else window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the form still works, only without a draft.
  }
}

export function clearStoredDraft(): void {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing stored.
  }
}
