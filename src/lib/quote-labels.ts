import { formatPrice, getPackage, packageIds, type PackageId } from "@/config/pricing";
import type { QuotePackageId } from "@/config/quote";
import type { EstimateLine } from "@/lib/estimator";
import { fill } from "@/lib/template";
import type { Dictionary } from "@/types/content";

/** The dictionary parts the quote labels need (keeps client props small). */
export type QuoteCopy = Pick<Dictionary, "contactPage" | "pricing" | "estimator">;

/**
 * Human-readable labels for quote request values, shared by the form, its
 * confirmation summary and the email sent to WideCode.
 */

/** "Business (nga 399 €)", "Custom (me ofertë)" or "Ende nuk e di". */
export function packageOptionLabel(id: QuotePackageId, dict: QuoteCopy): string {
  if (!(packageIds as readonly string[]).includes(id)) return dict.contactPage.form.options.packageUnsure;
  const packageId = id as PackageId;
  const { startingPrice } = getPackage(packageId);
  const price =
    startingPrice === null
      ? dict.pricing.customPrice.toLowerCase()
      : `${dict.pricing.from.toLowerCase()} ${formatPrice(startingPrice)}`;
  return `${dict.pricing.packages[packageId].name} (${price})`;
}

/** Label of one estimator line, worded like the estimator's own summary. */
export function estimateLineLabel(line: EstimateLine, dict: QuoteCopy): string {
  const copy = dict.estimator;
  if (line.kind === "base") return fill(copy.summary.base, { name: dict.pricing.packages[line.packageId].name });
  if (line.kind === "extraPages") {
    return fill(copy.summary.extraPages, { count: String(line.quantity), price: formatPrice(line.unitPrice) });
  }
  return copy.addOns[line.addOnId].label;
}
