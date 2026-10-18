import type { PackageId } from "@/config/pricing";

/**
 * Price estimator rules. Base prices come from src/config/pricing.ts; this
 * file only adds what the estimator needs on top of them. All amounts are
 * whole euros and, like the package prices, indicative only.
 *
 * The add-on and extra-page prices below were confirmed by the owner on
 * 2026-10-18 as initial indicative prices for STANDARD implementations;
 * complex requirements may need a custom quote. No other fees (setup, VAT,
 * recurring) are added anywhere, and third-party costs (payment-provider
 * transaction fees, external subscriptions) are never included.
 */

export type PageRule = {
  /** Pages included in the package's starting price. */
  included: number;
  /** Highest page count the estimator accepts for this package. */
  max: number;
  /** Price per page above `included`; omitted when extra pages are not offered. */
  extraPagePrice?: number;
};

/** Packages where the number of pages changes the estimate. */
export const pageRules: Partial<Record<PackageId, PageRule>> = {
  starter: { included: 1, max: 1 },
  business: { included: 5, max: 30, extraPagePrice: 30 },
  professional: { included: 10, max: 40, extraPagePrice: 30 },
};

export const addOnIds = ["multilingual", "blog", "booking", "analytics", "payments"] as const;

export type AddOnId = (typeof addOnIds)[number];

export type AddOn = {
  id: AddOnId;
  price: number;
  /** Packages where the add-on can be chosen for an extra price. */
  availableFor: readonly PackageId[];
  /** Packages whose starting price already includes it (no extra charge). */
  includedIn?: readonly PackageId[];
};

export const addOns: readonly AddOn[] = [
  { id: "multilingual", price: 150, availableFor: ["starter", "business", "professional", "ecommerce"] },
  { id: "blog", price: 100, availableFor: ["business"], includedIn: ["professional"] },
  { id: "booking", price: 200, availableFor: ["starter", "business", "professional"] },
  { id: "analytics", price: 40, availableFor: ["starter", "business", "ecommerce"], includedIn: ["professional"] },
  { id: "payments", price: 150, availableFor: ["ecommerce"] },
];

/** Package preselected when the estimator opens without a choice in the URL. */
export const defaultEstimatorPackage: PackageId = "business";
