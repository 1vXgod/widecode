import { describe, expect, it } from "vitest";
import { budgetIds, projectTypeIds, quotePackageIds, timelineIds } from "@/config/quote";
import { getDictionary } from "@/content";
import { quoteHref } from "@/lib/quote";
import {
  cleanLine,
  cleanText,
  isValidEmail,
  isValidPhone,
  normalizeQuoteEstimate,
  parseQuotePrefill,
  quoteFields,
  validateQuoteValues,
  type QuoteFieldError,
  type QuoteFormValues,
} from "@/lib/quote-request";

const valid: QuoteFormValues = {
  name: "Arta Krasniqi",
  business: "",
  email: "arta@example.com",
  phone: "",
  projectType: "business",
  packageId: "business",
  budget: "300-600",
  timeline: "flexible",
  description: "Website për restorantin tonë me menu dhe rezervime.",
};

describe("validateQuoteValues", () => {
  it("accepts a complete request and returns cleaned values", () => {
    const result = validateQuoteValues({ ...valid, name: "  Arta   Krasniqi ", phone: " +383 44 000 000 " });
    expect(result).toEqual({
      ok: true,
      values: { ...valid, name: "Arta Krasniqi", phone: "+383 44 000 000" },
    });
  });

  it("reports every missing required field, but not the optional ones", () => {
    const result = validateQuoteValues({});
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toEqual({
      name: "required",
      email: "required",
      projectType: "required",
      packageId: "required",
      budget: "required",
      timeline: "required",
      description: "required",
    });
  });

  it("checks lengths and formats", () => {
    const result = validateQuoteValues({
      ...valid,
      name: "A",
      business: "x".repeat(121),
      email: "not-an-email",
      phone: "12",
      description: "Shumë shkurt",
    });
    expect(result.ok ? {} : result.errors).toEqual({
      name: "tooShort",
      business: "tooLong",
      email: "invalid",
      phone: "invalid",
      description: "tooShort",
    });
    const long = validateQuoteValues({ ...valid, name: "x".repeat(101), description: "x".repeat(5001) });
    expect(long.ok ? {} : long.errors).toEqual({ name: "tooLong", description: "tooLong" });
  });

  it("only accepts known option ids", () => {
    const result = validateQuoteValues({
      ...valid,
      projectType: "hacking",
      packageId: "premium",
      budget: "1000000",
      timeline: "<script>",
    });
    expect(result.ok ? {} : result.errors).toEqual({
      projectType: "required",
      packageId: "required",
      budget: "required",
      timeline: "required",
    });
  });

  it("never throws on hostile input shapes", () => {
    for (const input of [null, undefined, 42, "text", [], { name: { toString: () => "x" } }, { email: ["a@b.co"] }]) {
      expect(() => validateQuoteValues(input)).not.toThrow();
      expect(validateQuoteValues(input).ok).toBe(false);
    }
  });

  it("rejects email values that could add recipients or headers", () => {
    for (const email of ["a@b.com, c@d.com", "a@b.com\r\nBcc: x@y.com", "<a@b.com>", "a b@c.com", "a@b", "a@@b.com", "a@b.c"]) {
      expect(isValidEmail(cleanLine(email)), email).toBe(false);
    }
    for (const email of ["arta@example.com", "o'brien@example.co.uk", "first.last+tag@sub.example.org"]) {
      expect(isValidEmail(email), email).toBe(true);
    }
  });

  it("accepts common phone formats only", () => {
    expect(isValidPhone("+383 44 000 000")).toBe(true);
    expect(isValidPhone("044-000-000")).toBe(true);
    expect(isValidPhone("(038) 000 000")).toBe(true);
    expect(isValidPhone("call me")).toBe(false);
    expect(isValidPhone("+1")).toBe(false);
    expect(isValidPhone("1".repeat(21))).toBe(false);
  });
});

describe("text cleaning", () => {
  it("removes control, zero-width and bidi-override characters", () => {
    const [zeroWidth, rtlOverride, popDirection] = [0x200b, 0x202e, 0x202c].map((c) => String.fromCharCode(c));
    expect(cleanLine(`Ar\u0000ta${zeroWidth} ${rtlOverride}Krasniqi${popDirection}`)).toBe("Arta Krasniqi");
    expect(cleanLine("Line one\r\nBcc: someone")).toBe("Line one Bcc: someone");
    expect(cleanLine(123)).toBe("");
  });

  it("keeps line breaks in descriptions, normalized and bounded", () => {
    expect(cleanText("Rreshti 1\r\nRreshti 2\n\n\n\n\n\nRreshti 3\u0007")).toBe("Rreshti 1\nRreshti 2\n\n\nRreshti 3");
  });

  it("normalizes Albanian characters to NFC", () => {
    expect(cleanLine("Çështje")).toBe("Çështje");
  });
});

describe("parseQuotePrefill", () => {
  it("is empty without parameters", () => {
    expect(parseQuotePrefill(new URLSearchParams())).toEqual({
      packageId: null,
      projectType: null,
      estimate: null,
      projectSlug: null,
    });
  });

  it("pre-selects the package and matching project type from pricing links", () => {
    expect(parseQuotePrefill(new URLSearchParams("paketa=starter"))).toMatchObject({
      packageId: "starter",
      projectType: "presentation",
      estimate: null,
    });
    expect(parseQuotePrefill({ paketa: "custom" })).toMatchObject({ packageId: "custom", projectType: "platform" });
  });

  it("carries a normalized estimate from estimator links", () => {
    const prefill = parseQuotePrefill(new URLSearchParams("paketa=business&faqe=7&shtesa=blog,analytics"));
    expect(prefill.estimate).toEqual({ packageId: "business", pages: 7, addOns: ["blog", "analytics"] });
  });

  it("clamps and filters hand-edited estimator values", () => {
    const prefill = parseQuotePrefill(new URLSearchParams("paketa=business&faqe=9999&shtesa=payments,blog,blog,evil"));
    expect(prefill.estimate).toEqual({ packageId: "business", pages: 30, addOns: ["blog"] });
  });

  it("never estimates Custom", () => {
    expect(parseQuotePrefill(new URLSearchParams("paketa=custom&faqe=5")).estimate).toBeNull();
  });

  it("references a website concept and uses its package and category", () => {
    expect(parseQuotePrefill(new URLSearchParams("projekti=dyqan-veshjesh"))).toEqual({
      packageId: "ecommerce",
      projectType: "ecommerce",
      estimate: null,
      projectSlug: "dyqan-veshjesh",
    });
    // The links built by the project pages round-trip.
    const href = quoteHref("business", "klinike-dentare");
    expect(parseQuotePrefill(new URL(href, "https://example.test").searchParams)).toMatchObject({
      packageId: "business",
      projectSlug: "klinike-dentare",
    });
  });

  it("ignores unknown or malicious values instead of guessing", () => {
    for (const query of [
      "paketa=premium",
      "paketa=<script>alert(1)</script>",
      "projekti=../../etc/passwd",
      "projekti=javascript:alert(1)",
      "faqe=5&shtesa=blog",
      "paketa=BUSINESS",
    ]) {
      expect(parseQuotePrefill(new URLSearchParams(query)), query).toEqual({
        packageId: null,
        projectType: null,
        estimate: null,
        projectSlug: null,
      });
    }
  });

  it("uses the first value of repeated parameters", () => {
    expect(parseQuotePrefill({ paketa: ["starter", "ecommerce"] }).packageId).toBe("starter");
  });
});

describe("normalizeQuoteEstimate", () => {
  it("rebuilds estimator choices for the selected package only", () => {
    expect(normalizeQuoteEstimate("professional", { pages: 12, addOns: ["booking", "blog"] })).toEqual({
      packageId: "professional",
      pages: 12,
      addOns: ["booking"],
    });
  });

  it("returns null when no estimate applies", () => {
    expect(normalizeQuoteEstimate("custom", { pages: 3, addOns: [] })).toBeNull();
    expect(normalizeQuoteEstimate("unsure", { pages: 3, addOns: [] })).toBeNull();
    expect(normalizeQuoteEstimate("business", null)).toBeNull();
    expect(normalizeQuoteEstimate("business", "free")).toBeNull();
  });

  it("ignores injected prices and nonsense", () => {
    expect(normalizeQuoteEstimate("business", { pages: "1e9", addOns: "blog", total: 1 })).toEqual({
      packageId: "business",
      pages: 5,
      addOns: [],
    });
  });
});

describe("quote form copy", () => {
  const copy = getDictionary().contactPage;

  it("has a message for every error the validator can return", () => {
    const possible: Record<(typeof quoteFields)[number], QuoteFieldError[]> = {
      name: ["required", "tooShort", "tooLong"],
      business: ["tooLong"],
      email: ["required", "invalid"],
      phone: ["invalid"],
      projectType: ["required"],
      packageId: ["required"],
      budget: ["required"],
      timeline: ["required"],
      description: ["required", "tooShort", "tooLong"],
    };
    for (const field of quoteFields) {
      expect(copy.form.fields[field].label, field).toBeTruthy();
      for (const error of possible[field]) {
        expect(copy.errors.fields[field][error], `${field}.${error}`).toBeTruthy();
      }
    }
  });

  it("labels every option", () => {
    for (const id of projectTypeIds) expect(copy.form.options.projectType[id]).toBeTruthy();
    for (const id of budgetIds) expect(copy.form.options.budget[id]).toBeTruthy();
    for (const id of timelineIds) expect(copy.form.options.timeline[id]).toBeTruthy();
    expect(quotePackageIds).toContain("unsure");
  });

  it("never invents contact details", () => {
    const all = JSON.stringify(copy);
    expect(all).not.toMatch(/@(?!domeni\.com)[a-z0-9-]+\.[a-z]{2,}/i);
    expect(all).not.toMatch(/\+383\s?\d{2}/);
  });
});
