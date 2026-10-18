import { describe, expect, it } from "vitest";
import { packageIds, packages } from "@/config/pricing";
import { getService, serviceHref, serviceIds, services } from "@/config/services";
import { getDictionary } from "@/content";
import { quoteHref } from "@/lib/quote";
import { standardIds, valueIds } from "@/types/content";

describe("services config", () => {
  it("lists every service once, in order", () => {
    expect(services.map((s) => s.id)).toEqual([...serviceIds]);
  });

  it("uses unique, URL-safe anchors", () => {
    const anchors = services.map((s) => s.anchor);
    expect(new Set(anchors).size).toBe(anchors.length);
    for (const anchor of anchors) expect(anchor).toMatch(/^[a-z0-9-]+$/);
  });

  it("only references existing packages, and every package belongs to a service", () => {
    const known = new Set(packages.map((p) => p.id));
    const used = new Set(services.flatMap((s) => s.packages));
    for (const id of used) expect(known.has(id), id).toBe(true);
    for (const id of packageIds) expect(used.has(id), id).toBe(true);
  });

  it("builds deep links to service sections", () => {
    expect(serviceHref("ecommerce")).toBe("/sherbimet#dyqane-online");
    // @ts-expect-error unknown id
    expect(() => getService("seo")).toThrow(/Unknown service/);
  });
});

describe("quoteHref", () => {
  it("links to the contact page, pre-selecting a package when given", () => {
    expect(quoteHref()).toBe("/kontakt");
    expect(quoteHref("starter")).toBe("/kontakt?paketa=starter");
    expect(quoteHref("custom")).toBe("/kontakt?paketa=custom");
  });
});

describe("services and about copy", () => {
  const dict = getDictionary("sq");

  it("describes every service in full", () => {
    for (const id of serviceIds) {
      const detail = dict.servicesPage.details[id];
      expect(detail.description, id).toBeTruthy();
      expect(detail.idealFor.length, id).toBeGreaterThanOrEqual(2);
      expect(detail.includes.length, id).toBeGreaterThanOrEqual(3);
    }
  });

  it("has copy for every quality standard and value", () => {
    for (const id of standardIds) expect(dict.servicesPage.standards.items[id].title, id).toBeTruthy();
    for (const id of valueIds) expect(dict.aboutPage.values.items[id].title, id).toBeTruthy();
  });

  it("does not make unverifiable claims on the about page", () => {
    const text = JSON.stringify(dict.aboutPage);
    expect(text).not.toMatch(/\b(19|20)\d{2}\b/); // founding years
    expect(text).not.toMatch(/\d+\s*\+/); // "50+ projects"
    expect(text).not.toMatch(/\d+\s*%/); // percentages
    expect(text).not.toMatch(/klient[ëe] t[ëe] k[ëe]naqur|ekipi ynë|themeluar/i); // satisfied clients, team, founded
  });
});
