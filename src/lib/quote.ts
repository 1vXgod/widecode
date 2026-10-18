import type { PackageId } from "@/config/pricing";
import { routes } from "@/config/routes";
import { ESTIMATE_PARAMS, estimateToSearchParams, type EstimateInput } from "@/lib/estimator";

/** Query parameter the contact page reads to pre-select a package in the quote form. */
export const QUOTE_PACKAGE_PARAM = ESTIMATE_PARAMS.package;

/** Contact link, optionally pre-selecting a pricing package for the quote form. */
export function quoteHref(packageId?: PackageId): string {
  return packageId ? `${routes.contact}?${QUOTE_PACKAGE_PARAM}=${packageId}` : routes.contact;
}

/** Contact link carrying a full estimate (package, pages and add-ons) to the quote form. */
export function quoteHrefForEstimate(input: EstimateInput): string {
  return `${routes.contact}?${estimateToSearchParams(input).toString()}`;
}

/** Estimator link with a package pre-selected. */
export function estimatorHref(packageId?: PackageId): string {
  return packageId ? `${routes.estimator}?${QUOTE_PACKAGE_PARAM}=${packageId}` : routes.estimator;
}
