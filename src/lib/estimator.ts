import { addOnIds, addOns, defaultEstimatorPackage, pageRules, type AddOnId } from "@/config/estimator";
import { getPackage, packageIds, type PackageId } from "@/config/pricing";

/** A visitor's choices in the estimator, always normalized before use. */
export type EstimateInput = {
  packageId: PackageId;
  /** Number of pages, or null when the package is not priced by pages. */
  pages: number | null;
  addOns: AddOnId[];
};

export type EstimateLine =
  | { kind: "base"; packageId: PackageId; amount: number }
  | { kind: "extraPages"; quantity: number; unitPrice: number; amount: number }
  | { kind: "addOn"; addOnId: AddOnId; amount: number };

export type Estimate =
  /** An indicative total built only from configured prices. */
  | { kind: "estimate"; input: EstimateInput; lines: EstimateLine[]; total: number }
  /** No price can be estimated (custom quote); the visitor should request an offer. */
  | { kind: "quote"; input: EstimateInput };

export type AddOnStatus = "available" | "included" | "unavailable";

/** URL parameter names shared by the estimator and the quote link. */
export const ESTIMATE_PARAMS = {
  package: "paketa",
  pages: "faqe",
  addOns: "shtesa",
} as const;

function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && (packageIds as readonly string[]).includes(value);
}

function isAddOnId(value: unknown): value is AddOnId {
  return typeof value === "string" && (addOnIds as readonly string[]).includes(value);
}

/** Whether an add-on can be added, is already included, or does not apply to a package. */
export function addOnStatus(addOnId: AddOnId, packageId: PackageId): AddOnStatus {
  const addOn = addOns.find((a) => a.id === addOnId);
  if (!addOn) return "unavailable";
  if (addOn.includedIn?.includes(packageId)) return "included";
  if (addOn.availableFor.includes(packageId)) return "available";
  return "unavailable";
}

/** Brings any (possibly hand-edited) input into a valid state. Never throws. */
export function normalizeInput(raw: {
  packageId?: unknown;
  pages?: unknown;
  addOns?: readonly unknown[];
}): EstimateInput {
  const packageId = isPackageId(raw.packageId) ? raw.packageId : defaultEstimatorPackage;
  const rule = pageRules[packageId];

  let pages: number | null = null;
  if (rule) {
    const requested = typeof raw.pages === "number" && Number.isFinite(raw.pages) ? Math.round(raw.pages) : rule.included;
    pages = Math.min(Math.max(requested, 1), rule.max);
  }

  const chosen = new Set((raw.addOns ?? []).filter(isAddOnId));
  // Keep config order, drop duplicates and anything not purchasable for this package.
  const validAddOns = addOnIds.filter((id) => chosen.has(id) && addOnStatus(id, packageId) === "available");

  return { packageId, pages, addOns: validAddOns };
}

/** Calculates an indicative estimate from configured prices only. */
export function calculateEstimate(raw: Parameters<typeof normalizeInput>[0]): Estimate {
  const input = normalizeInput(raw);
  const { startingPrice } = getPackage(input.packageId);
  if (startingPrice === null) return { kind: "quote", input };

  const lines: EstimateLine[] = [{ kind: "base", packageId: input.packageId, amount: startingPrice }];

  const rule = pageRules[input.packageId];
  if (rule?.extraPagePrice && input.pages !== null && input.pages > rule.included) {
    const quantity = input.pages - rule.included;
    lines.push({ kind: "extraPages", quantity, unitPrice: rule.extraPagePrice, amount: quantity * rule.extraPagePrice });
  }

  for (const addOnId of input.addOns) {
    const addOn = addOns.find((a) => a.id === addOnId);
    if (addOn) lines.push({ kind: "addOn", addOnId, amount: addOn.price });
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return { kind: "estimate", input, lines, total };
}

/** Serializes an estimate input to URL parameters (e.g. ?paketa=business&faqe=8&shtesa=blog). */
export function estimateToSearchParams(raw: Parameters<typeof normalizeInput>[0]): URLSearchParams {
  const input = normalizeInput(raw);
  const params = new URLSearchParams({ [ESTIMATE_PARAMS.package]: input.packageId });
  const rule = pageRules[input.packageId];
  if (input.pages !== null && rule && rule.max > 1) params.set(ESTIMATE_PARAMS.pages, String(input.pages));
  if (input.addOns.length > 0) params.set(ESTIMATE_PARAMS.addOns, input.addOns.join(","));
  return params;
}

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function readParam(source: ParamSource, key: string): string | undefined {
  if (source instanceof URLSearchParams) return source.get(key) ?? undefined;
  const value = source[key];
  return Array.isArray(value) ? value[0] : value;
}

/** Parses URL parameters into a normalized input; invalid values fall back to defaults. */
export function parseEstimateParams(source: ParamSource): EstimateInput {
  const pagesRaw = readParam(source, ESTIMATE_PARAMS.pages);
  const pages = pagesRaw !== undefined && /^\d{1,4}$/.test(pagesRaw.trim()) ? Number(pagesRaw) : undefined;
  const addOnsRaw = readParam(source, ESTIMATE_PARAMS.addOns);
  return normalizeInput({
    packageId: readParam(source, ESTIMATE_PARAMS.package),
    pages,
    addOns: addOnsRaw ? addOnsRaw.split(",").map((s) => s.trim()) : [],
  });
}
