import { getPackage, type PackageId } from "@/config/pricing";
import type { ProjectSlug } from "@/config/projects";
import { routes } from "@/config/routes";
import { ESTIMATE_PARAMS, estimateToSearchParams, type EstimateInput } from "@/lib/estimator";

/** Query parameter the contact page reads to pre-select a package in the quote form. */
export const QUOTE_PACKAGE_PARAM = ESTIMATE_PARAMS.package;

/** Query parameter naming the website concept a quote request starts from (see parseQuotePrefill). */
export const QUOTE_PROJECT_PARAM = "projekti";

/**
 * Contact link, optionally pre-selecting a pricing package and referencing the
 * website concept the visitor was looking at.
 */
export function quoteHref(packageId?: PackageId, projectSlug?: ProjectSlug): string {
  const params = new URLSearchParams();
  if (packageId) params.set(QUOTE_PACKAGE_PARAM, packageId);
  if (projectSlug) params.set(QUOTE_PROJECT_PARAM, projectSlug);
  const query = params.toString();
  return query ? `${routes.contact}?${query}` : routes.contact;
}

/**
 * Marks a contact link as coming from the estimator, so the form shows the
 * estimate even when it has no pages or add-ons in the URL (e.g. Starter or
 * E-commerce as they are). A pricing card's link to the same package has no marker.
 */
export const QUOTE_ESTIMATE_PARAM = "vleresim";

/** Contact link carrying a full estimate (package, pages and add-ons) to the quote form. */
export function quoteHrefForEstimate(input: EstimateInput): string {
  const params = estimateToSearchParams(input);
  if (getPackage(input.packageId).startingPrice !== null) params.set(QUOTE_ESTIMATE_PARAM, "1");
  return `${routes.contact}?${params.toString()}`;
}

/** Estimator link with a package pre-selected. */
export function estimatorHref(packageId?: PackageId): string {
  return packageId ? `${routes.estimator}?${QUOTE_PACKAGE_PARAM}=${packageId}` : routes.estimator;
}
