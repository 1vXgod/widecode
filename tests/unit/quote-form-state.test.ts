import { afterEach, describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { normalizeInput } from "@/lib/estimator";
import {
  applyPrefill,
  clearStoredDraft,
  isEmptyState,
  mergeDraft,
  parseQuoteDraft,
  readStoredDraft,
  storeDraft,
  type QuoteFormState,
} from "@/lib/quote-form-state";
import { estimateDetailRows } from "@/lib/quote-labels";
import { emptyQuotePrefill, emptyQuoteValues, parseQuotePrefill } from "@/lib/quote-request";

const dict = getDictionary();
const copy = { contactPage: dict.contactPage, pricing: dict.pricing, estimator: dict.estimator };

const typed: QuoteFormState = {
  values: {
    ...emptyQuoteValues,
    name: "Arta Krasniqi",
    email: "arta@example.com",
    description: "Website për restorantin.",
    projectType: "business",
    packageId: "business",
    budget: "300-600",
  },
  estimate: normalizeInput({ packageId: "business", pages: 7, addOns: ["analytics"] }),
  projectSlug: null,
};

afterEach(() => window.sessionStorage.clear());

describe("applyPrefill", () => {
  it("takes the new estimator configuration and keeps everything the visitor typed", () => {
    const next = applyPrefill(typed, parseQuotePrefill(new URLSearchParams("paketa=professional&faqe=12&shtesa=booking&vleresim=1")));
    expect(next.estimate).toEqual({ packageId: "professional", pages: 12, addOns: ["booking"] });
    expect(next.values).toMatchObject({
      name: "Arta Krasniqi",
      email: "arta@example.com",
      description: "Website për restorantin.",
      budget: "300-600",
      packageId: "professional",
      projectType: "business",
    });
  });

  it("keeps the current configuration when the URL states none (e.g. the header's contact link)", () => {
    expect(applyPrefill(typed, emptyQuotePrefill)).toEqual(typed);
  });
});

describe("parseQuoteDraft", () => {
  it("accepts a stored draft", () => {
    expect(parseQuoteDraft(JSON.parse(JSON.stringify(typed)))).toEqual(typed);
  });

  it("treats a hand-edited draft like untrusted input", () => {
    const parsed = parseQuoteDraft({
      values: {
        name: "A".repeat(500),
        email: 42,
        packageId: "premium",
        budget: "1000000",
        timeline: "asap",
        description: "<script>x</script>",
      },
      estimate: { packageId: "business", pages: 9999, addOns: ["payments", "blog", "evil"], total: 1 },
      projectSlug: "../admin",
    });
    expect(parsed?.values.name).toHaveLength(100);
    expect(parsed?.values).toMatchObject({ email: "", packageId: "", budget: "", timeline: "asap" });
    // Text stays as typed here; it is sanitized and escaped on the server like any other input.
    expect(parsed?.values.description).toBe("<script>x</script>");
    // The estimate is rebuilt from the configured rules; a stored total is never used.
    expect(parsed?.estimate).toEqual({ packageId: "business", pages: 30, addOns: ["blog"] });
    expect(parsed?.projectSlug).toBeNull();
  });

  it("rejects anything that is not a draft", () => {
    for (const raw of [null, "text", 1, [], { values: "x" }]) expect(parseQuoteDraft(raw)).toBeNull();
    expect(parseQuoteDraft({ values: {}, estimate: { packageId: "custom" } })?.estimate).toBeNull();
  });
});

describe("mergeDraft", () => {
  it("lets the URL's configuration win and fills in the rest from the draft", () => {
    const fromUrl = parseQuotePrefill(new URLSearchParams("paketa=ecommerce&shtesa=payments&vleresim=1"));
    const opened: QuoteFormState = {
      values: { ...emptyQuoteValues, packageId: "ecommerce", projectType: "ecommerce" },
      estimate: fromUrl.estimate,
      projectSlug: null,
    };
    const merged = mergeDraft(opened, typed, fromUrl);
    expect(merged.values).toMatchObject({ name: "Arta Krasniqi", packageId: "ecommerce", projectType: "ecommerce", budget: "300-600" });
    expect(merged.estimate).toEqual({ packageId: "ecommerce", pages: null, addOns: ["payments"] });
  });

  it("restores the draft's configuration when the URL has none", () => {
    expect(mergeDraft({ values: emptyQuoteValues, estimate: null, projectSlug: null }, typed, emptyQuotePrefill)).toEqual(typed);
  });
});

describe("draft storage", () => {
  it("stores, restores and clears a draft for this tab", () => {
    storeDraft(typed);
    expect(readStoredDraft()).toEqual(typed);
    clearStoredDraft();
    expect(readStoredDraft()).toBeNull();
  });

  it("does not keep an empty form, and survives malformed storage", () => {
    storeDraft(typed);
    storeDraft({ values: emptyQuoteValues, estimate: null, projectSlug: null });
    expect(window.sessionStorage.length).toBe(0);
    expect(isEmptyState({ values: emptyQuoteValues, estimate: null, projectSlug: null })).toBe(true);

    window.sessionStorage.setItem("widecode:quote-draft", "{not json");
    expect(readStoredDraft()).toBeNull();
  });
});

describe("estimateDetailRows", () => {
  it("states the total number of pages and what the package already includes", () => {
    expect(estimateDetailRows(normalizeInput({ packageId: "business", pages: 7 }), copy)).toEqual([
      ["Numri i faqeve", "7 faqe (5 të përfshira në paketë)"],
    ]);
    expect(estimateDetailRows(normalizeInput({ packageId: "professional" }), copy)).toEqual([
      ["Numri i faqeve", "10 faqe"],
      ["Të përfshira në paketë", "Blog / lajme dhe Analitikë"],
    ]);
    expect(estimateDetailRows(normalizeInput({ packageId: "ecommerce" }), copy)).toEqual([]);
  });
});
