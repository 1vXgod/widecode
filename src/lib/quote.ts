import type { PackageId } from "@/config/pricing";
import { routes } from "@/config/routes";

/** Query parameter the contact page reads to pre-select a package in the quote form. */
export const QUOTE_PACKAGE_PARAM = "paketa";

/** Contact link, optionally pre-selecting a pricing package for the quote form. */
export function quoteHref(packageId?: PackageId): string {
  return packageId ? `${routes.contact}?${QUOTE_PACKAGE_PARAM}=${packageId}` : routes.contact;
}
