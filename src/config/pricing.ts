/**
 * Central pricing configuration. All prices are indicative starting prices in
 * EUR, not guaranteed final quotes. Package names, descriptions and feature
 * lists live in src/content/<locale>/pricing.ts and are keyed by PackageId.
 */
export const currency = "EUR";

export const packageIds = ["starter", "business", "professional", "ecommerce", "custom"] as const;

export type PackageId = (typeof packageIds)[number];

export type PricingPackage = {
  id: PackageId;
  /** Starting price in whole euros; null means "custom quote". */
  startingPrice: number | null;
  /** Visually highlighted as the recommended option. */
  recommended?: boolean;
};

export const packages: readonly PricingPackage[] = [
  { id: "starter", startingPrice: 199 },
  { id: "business", startingPrice: 399, recommended: true },
  { id: "professional", startingPrice: 699 },
  { id: "ecommerce", startingPrice: 999 },
  { id: "custom", startingPrice: null },
];

export function getPackage(id: PackageId): PricingPackage {
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown package "${id}"`);
  return pkg;
}

/** Lowest configured starting price, used for "from X €" copy. */
export function lowestStartingPrice(): number {
  const prices = packages.flatMap((p) => (p.startingPrice === null ? [] : [p.startingPrice]));
  if (prices.length === 0) throw new Error("No priced packages configured");
  return Math.min(...prices);
}

/** Formats whole-euro amounts using the locale's conventions, e.g. "199 €" in Albanian. */
export function formatPrice(amount: number, locale = "sq"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
