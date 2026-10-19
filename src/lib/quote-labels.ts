import { addOnIds, pageRules } from "@/config/estimator";
import { formatPrice, getPackage, packageIds, type PackageId } from "@/config/pricing";
import type { QuotePackageId } from "@/config/quote";
import { addOnStatus, type EstimateInput, type EstimateLine } from "@/lib/estimator";
import { formatList } from "@/lib/format";
import { fill } from "@/lib/template";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/content";

/**
 * The dictionary parts the quote labels need (keeps client props small).
 * `locale` sets the price and list notation (Albanian when omitted).
 */
export type QuoteCopy = Pick<Dictionary, "contactPage" | "pricing" | "estimator"> & { locale?: Locale };

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
      : `${dict.pricing.from.toLowerCase()} ${formatPrice(startingPrice, dict.locale)}`;
  return `${dict.pricing.packages[packageId].name} (${price})`;
}

/**
 * The configuration behind an estimate that its price lines do not show: the
 * total number of pages and the features the package already includes.
 * Shared by the form's estimate card and the email.
 */
export function estimateDetailRows(input: EstimateInput, dict: QuoteCopy): Array<[string, string]> {
  const copy = dict.contactPage.form.estimate;
  const rows: Array<[string, string]> = [];
  const rule = pageRules[input.packageId];
  if (rule && input.pages !== null) {
    const pages =
      input.pages > rule.included
        ? fill(copy.pagesWithIncluded, { count: String(input.pages), included: String(rule.included) })
        : fill(copy.pagesValue, { count: String(input.pages) });
    rows.push([copy.pages, pages]);
  }
  const included = addOnIds.filter((id) => addOnStatus(id, input.packageId) === "included");
  if (included.length > 0) {
    rows.push([copy.includedFeatures, formatList(included.map((id) => dict.estimator.addOns[id].label), dict.locale)]);
  }
  return rows;
}

/** Label of one estimator line, worded like the estimator's own summary. */
export function estimateLineLabel(line: EstimateLine, dict: QuoteCopy): string {
  const copy = dict.estimator;
  if (line.kind === "base") return fill(copy.summary.base, { name: dict.pricing.packages[line.packageId].name });
  if (line.kind === "extraPages") {
    return fill(copy.summary.extraPages, { count: String(line.quantity), price: formatPrice(line.unitPrice, dict.locale) });
  }
  return copy.addOns[line.addOnId].label;
}
