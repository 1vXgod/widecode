import { describe, expect, it } from "vitest";
import { formatPrice, getPackage, lowestStartingPrice, packageIds, packages } from "@/config/pricing";
import { getDictionary } from "@/content";
import { formatList } from "@/lib/format";

describe("pricing config", () => {
  it("has the agreed starting prices", () => {
    expect(Object.fromEntries(packages.map((p) => [p.id, p.startingPrice]))).toEqual({
      starter: 199,
      business: 399,
      professional: 699,
      ecommerce: 999,
      custom: null,
    });
  });

  it("defines every package exactly once, in ascending price order", () => {
    expect(packages.map((p) => p.id)).toEqual([...packageIds]);
    const priced = packages.flatMap((p) => (p.startingPrice === null ? [] : [p.startingPrice]));
    expect(priced).toEqual([...priced].sort((a, b) => a - b));
  });

  it("highlights at most one package as recommended", () => {
    expect(packages.filter((p) => p.recommended).length).toBeLessThanOrEqual(1);
  });

  it("finds packages by id and rejects unknown ids", () => {
    expect(getPackage("business").startingPrice).toBe(399);
    // @ts-expect-error unknown id
    expect(() => getPackage("gold")).toThrow(/Unknown package/);
  });

  it("reports the lowest starting price", () => {
    expect(lowestStartingPrice()).toBe(199);
  });
});

describe("formatPrice", () => {
  it("formats euros the Albanian way, without decimals", () => {
    expect(formatPrice(199).replace(/\s/g, " ")).toBe("199 €");
    expect(formatPrice(999).replace(/\s/g, " ")).toBe("999 €");
  });

  it("keeps the amount and currency together with a non-breaking space", () => {
    expect(formatPrice(199)).toBe("199 €");
    expect(formatPrice(199)).not.toContain(" ");
  });

  it("groups thousands only from five digits up, like Albanian locale data", () => {
    expect(formatPrice(1299)).toBe("1299 €");
    expect(formatPrice(12500)).toBe("12 500 €");
    expect(formatPrice(1250000)).toBe("1 250 000 €");
  });

  it("rounds to whole euros and handles zero", () => {
    expect(formatPrice(0)).toBe("0 €");
    expect(formatPrice(199.6)).toBe("200 €");
  });

  it("does not depend on the runtime's Intl locale data (server and browser must match)", () => {
    // Chromium formats `sq` currency as "€199" while Node gives "199 €"; ours is fixed.
    expect(formatPrice(399)).toMatch(/^399\s€$/);
  });
});

describe("formatList", () => {
  it("joins items the Albanian way", () => {
    expect(formatList([])).toBe("");
    expect(formatList(["Starter"])).toBe("Starter");
    expect(formatList(["Starter", "Business"])).toBe("Starter dhe Business");
    expect(formatList(["Starter", "Business", "Professional"])).toBe("Starter, Business dhe Professional");
  });
});

describe("pricing copy", () => {
  const dict = getDictionary("sq");

  it("has a name, summary and features for every package", () => {
    for (const id of packageIds) {
      const copy = dict.pricing.packages[id];
      expect(copy.name, id).toBeTruthy();
      expect(copy.summary, id).toBeTruthy();
      expect(copy.features.length, id).toBeGreaterThanOrEqual(3);
    }
  });

  it("states that prices are indicative starting prices", () => {
    expect(dict.pricing.disclaimer).toMatch(/orientuese/);
    expect(dict.pricing.disclaimer).toMatch(/fillestare/);
  });
});
