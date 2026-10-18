import { describe, expect, it } from "vitest";
import { addOnIds, addOns, defaultEstimatorPackage, pageRules } from "@/config/estimator";
import { getPackage, packageIds, packages } from "@/config/pricing";
import { getDictionary } from "@/content";
import {
  addOnStatus,
  calculateEstimate,
  estimateToSearchParams,
  normalizeInput,
  parseEstimateParams,
  type Estimate,
} from "@/lib/estimator";
import { estimatorHref, quoteHref, quoteHrefForEstimate } from "@/lib/quote";

function total(estimate: Estimate): number {
  if (estimate.kind !== "estimate") throw new Error("expected a priced estimate");
  return estimate.total;
}

describe("calculateEstimate", () => {
  it("equals the package starting price when nothing is added", () => {
    for (const pkg of packages) {
      const estimate = calculateEstimate({ packageId: pkg.id });
      if (pkg.startingPrice === null) expect(estimate.kind).toBe("quote");
      else expect(total(estimate)).toBe(pkg.startingPrice);
    }
  });

  it("charges only for pages above those included", () => {
    expect(total(calculateEstimate({ packageId: "business", pages: 5 }))).toBe(399);
    expect(total(calculateEstimate({ packageId: "business", pages: 3 }))).toBe(399);
    expect(total(calculateEstimate({ packageId: "business", pages: 8 }))).toBe(399 + 3 * 30);
    expect(total(calculateEstimate({ packageId: "professional", pages: 12 }))).toBe(699 + 2 * 30);
  });

  it("adds available add-ons and itemises every line", () => {
    const estimate = calculateEstimate({ packageId: "business", pages: 7, addOns: ["multilingual", "blog"] });
    expect(estimate.kind).toBe("estimate");
    if (estimate.kind !== "estimate") return;
    expect(estimate.lines).toEqual([
      { kind: "base", packageId: "business", amount: 399 },
      { kind: "extraPages", quantity: 2, unitPrice: 30, amount: 60 },
      { kind: "addOn", addOnId: "multilingual", amount: 150 },
      { kind: "addOn", addOnId: "blog", amount: 100 },
    ]);
    expect(estimate.total).toBe(709);
    expect(estimate.total).toBe(estimate.lines.reduce((sum, line) => sum + line.amount, 0));
  });

  it("never charges for add-ons already included in the package", () => {
    expect(total(calculateEstimate({ packageId: "professional", addOns: ["blog", "analytics"] }))).toBe(699);
  });

  it("ignores add-ons that do not apply to the package", () => {
    expect(total(calculateEstimate({ packageId: "starter", addOns: ["payments", "blog"] }))).toBe(199);
    expect(total(calculateEstimate({ packageId: "ecommerce", addOns: ["payments", "booking"] }))).toBe(999 + 150);
  });

  it("never produces a number for a custom quote, whatever the options", () => {
    const estimate = calculateEstimate({ packageId: "custom", pages: 25, addOns: [...addOnIds] });
    expect(estimate).toEqual({ kind: "quote", input: { packageId: "custom", pages: null, addOns: [] } });
  });

  it("only uses integer euro amounts", () => {
    const estimate = calculateEstimate({ packageId: "professional", pages: 40, addOns: [...addOnIds] });
    if (estimate.kind !== "estimate") throw new Error("expected estimate");
    for (const line of estimate.lines) expect(Number.isInteger(line.amount)).toBe(true);
  });
});

describe("normalizeInput (edge cases)", () => {
  it("falls back to the default package for unknown or missing ids", () => {
    expect(normalizeInput({}).packageId).toBe(defaultEstimatorPackage);
    expect(normalizeInput({ packageId: "gold" }).packageId).toBe(defaultEstimatorPackage);
    expect(normalizeInput({ packageId: 42 }).packageId).toBe(defaultEstimatorPackage);
  });

  it("clamps and rounds page counts", () => {
    expect(normalizeInput({ packageId: "business", pages: 0 }).pages).toBe(1);
    expect(normalizeInput({ packageId: "business", pages: -5 }).pages).toBe(1);
    expect(normalizeInput({ packageId: "business", pages: 999 }).pages).toBe(30);
    expect(normalizeInput({ packageId: "business", pages: 6.6 }).pages).toBe(7);
    expect(normalizeInput({ packageId: "business", pages: Number.NaN }).pages).toBe(5);
    expect(normalizeInput({ packageId: "business", pages: "8" }).pages).toBe(5);
    expect(normalizeInput({ packageId: "starter", pages: 10 }).pages).toBe(1);
  });

  it("has no page count for packages not priced by pages", () => {
    expect(normalizeInput({ packageId: "ecommerce", pages: 12 }).pages).toBeNull();
  });

  it("removes duplicate, unknown and unavailable add-ons, keeping config order", () => {
    expect(
      normalizeInput({ packageId: "business", addOns: ["blog", "nope", "multilingual", "blog", "payments"] }).addOns,
    ).toEqual(["multilingual", "blog"]);
  });
});

describe("URL parameters", () => {
  it("round-trips an estimate", () => {
    const input = normalizeInput({ packageId: "business", pages: 8, addOns: ["booking", "multilingual"] });
    const params = estimateToSearchParams(input);
    expect(params.toString()).toBe("paketa=business&faqe=8&shtesa=multilingual%2Cbooking");
    expect(parseEstimateParams(params)).toEqual(input);
  });

  it("omits page and add-on parameters when they do not apply", () => {
    expect(estimateToSearchParams({ packageId: "starter" }).toString()).toBe("paketa=starter");
    expect(estimateToSearchParams({ packageId: "custom", addOns: ["blog"] }).toString()).toBe("paketa=custom");
  });

  it("tolerates hand-edited or malicious values", () => {
    expect(parseEstimateParams(new URLSearchParams("paketa=<script>&faqe=1e9&shtesa=,,blog,%20analytics"))).toEqual({
      packageId: defaultEstimatorPackage,
      pages: 5,
      addOns: ["blog", "analytics"],
    });
    expect(parseEstimateParams({ paketa: ["ecommerce", "starter"], shtesa: "payments" })).toEqual({
      packageId: "ecommerce",
      pages: null,
      addOns: ["payments"],
    });
  });

  it("builds quote and estimator links", () => {
    expect(quoteHref("business")).toBe("/kontakt?paketa=business");
    expect(estimatorHref("ecommerce")).toBe("/llogarit-cmimin?paketa=ecommerce");
    expect(estimatorHref()).toBe("/llogarit-cmimin");
    expect(quoteHrefForEstimate(normalizeInput({ packageId: "professional", pages: 12, addOns: ["booking"] }))).toBe(
      "/kontakt?paketa=professional&faqe=12&shtesa=booking",
    );
  });
});

describe("estimator rules are consistent with the pricing config", () => {
  const dict = getDictionary("sq");

  it("only references existing packages", () => {
    for (const id of Object.keys(pageRules)) expect(packageIds as readonly string[]).toContain(id);
    for (const addOn of addOns) {
      for (const id of [...addOn.availableFor, ...(addOn.includedIn ?? [])]) expect(packageIds).toContain(id);
    }
  });

  it("never offers an add-on as both included and extra for the same package", () => {
    for (const addOn of addOns) {
      for (const id of addOn.includedIn ?? []) expect(addOn.availableFor).not.toContain(id);
    }
  });

  it("uses sensible page rules and positive prices", () => {
    for (const rule of Object.values(pageRules)) {
      expect(rule.included).toBeGreaterThanOrEqual(1);
      expect(rule.max).toBeGreaterThanOrEqual(rule.included);
      if (rule.max > rule.included) expect(rule.extraPagePrice).toBeGreaterThan(0);
    }
    for (const addOn of addOns) expect(addOn.price).toBeGreaterThan(0);
  });

  it("uses one extra-page price for all packages (the pricing page shows a single price)", () => {
    const prices = new Set(Object.values(pageRules).flatMap((r) => (r.extraPagePrice === undefined ? [] : [r.extraPagePrice])));
    expect(prices.size).toBeLessThanOrEqual(1);
  });

  it("never prices custom work", () => {
    expect(getPackage("custom").startingPrice).toBeNull();
    expect(pageRules.custom).toBeUndefined();
    for (const addOn of addOns) expect(addOnStatus(addOn.id, "custom")).toBe("unavailable");
  });

  it("matches the page counts promised in the package copy", () => {
    expect(dict.pricing.packages.business.features).toContain(`Deri në ${pageRules.business?.included} faqe`);
    expect(dict.pricing.packages.professional.features).toContain(`Deri në ${pageRules.professional?.included} faqe`);
    expect(dict.pricing.packages.starter.features).toContain("One-page website");
    expect(pageRules.starter).toEqual({ included: 1, max: 1 });
  });

  it("includes in a package what its copy says is included", () => {
    expect(dict.pricing.packages.professional.features).toContain("Blog ose seksion lajmesh");
    expect(addOnStatus("blog", "professional")).toBe("included");
    expect(dict.pricing.packages.professional.features).toContain("Integrim me analitikë");
    expect(addOnStatus("analytics", "professional")).toBe("included");
  });

  it("states the limits of the estimate: standard scope and no third-party fees", () => {
    expect(dict.estimator.summary.disclaimer).toMatch(/implementime standarde/);
    expect(dict.estimator.summary.disclaimer).toMatch(/ofertë të veçantë/);
    expect(dict.estimator.summary.thirdParty).toMatch(/tarifat e transaksioneve/);
    expect(dict.estimator.summary.thirdParty).toMatch(/abonimet/);
    expect(dict.estimator.summary.thirdParty).toMatch(/nuk përfshihen/);
    expect(dict.estimator.addOns.payments.description).toMatch(/ofruesit të pagesave nuk përfshihen/);
  });

  it("has copy for every add-on", () => {
    for (const id of addOnIds) {
      expect(dict.estimator.addOns[id].label, id).toBeTruthy();
      expect(dict.estimator.addOns[id].description, id).toBeTruthy();
    }
  });
});
