import { describe, expect, it, vi } from "vitest";
import { packages } from "@/config/pricing";
import { formatPrice } from "@/config/pricing";
import { getDictionary } from "@/content";
import { errorPages } from "@/content/error-pages";
import { localeMeta, locales } from "@/i18n/config";
import {
  allPages,
  localeFromPublicPath,
  localizeHref,
  localizedRoutes,
  pagePath,
  resolvePublicPath,
  switchLocalePath,
  toPublicPath,
} from "@/i18n/routing";
import { calculateEstimate } from "@/lib/estimator";
import { formatList } from "@/lib/format";
import { homeMetadata, pageMetadata } from "@/lib/metadata";
import { handleQuoteSubmission } from "@/lib/quote-submission";
import { RateLimiter } from "@/lib/rate-limit";
import { faqJsonLd, servicesJsonLd, siteJsonLd, sitemapEntries } from "@/lib/seo";

const sq = getDictionary("sq");
const en = getDictionary("en");
const ORIGIN = new URL("https://widecode.example");

/** Every string in a dictionary, keyed by its path ("pricing.packages.starter.name"). */
function strings(value: unknown, path = ""): Map<string, string> {
  const result = new Map<string, string>();
  if (typeof value === "string") result.set(path, value);
  else if (Array.isArray(value)) value.forEach((item, i) => strings(item, `${path}[${i}]`).forEach((v, k) => result.set(k, v)));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) strings(item, path ? `${path}.${key}` : key).forEach((v, k) => result.set(k, v));
  }
  return result;
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("English dictionary", () => {
  const sqStrings = strings(sq);
  const enStrings = strings(en);

  it("has exactly the same entries as the Albanian one (nothing missing, nothing extra)", () => {
    expect([...enStrings.keys()].sort()).toEqual([...sqStrings.keys()].sort());
  });

  it("has no empty texts and the same placeholders as Albanian in every text", () => {
    for (const [key, text] of enStrings) {
      expect(text.trim(), key).not.toBe("");
      expect(placeholders(text), key).toEqual(placeholders(sqStrings.get(key)!));
    }
  });

  it("is actually English: no Albanian letters, and only names and shared terms left untranslated", () => {
    for (const [key, text] of enStrings) expect(text, key).not.toMatch(/[ëçËÇ]/);
    // Reviewed: brand, package and product names that are the same in both languages
    // ("1 minute" is also correct Albanian: "pas 1 minute"). A new entry here needs a reason.
    const shared = new Set([
      ...["Email", "Instagram", "Facebook", "LinkedIn", "GitHub", "TikTok", "X"],
      ...["Starter", "Business", "Professional", "E-commerce", "Custom"],
      ...["Online Shop", "Online shop", "Custom Development", "One-page", "One-page website", "Dashboard", "Responsive"],
      ...["+{price}", "1 minute"],
    ]);
    const untranslated = [...enStrings].filter(([key, text]) => sqStrings.get(key) === text && key !== "locale");
    for (const [key, text] of untranslated) expect(shared.has(text), `${key}: "${text}" is identical in both languages`).toBe(true);
  });

  it("is the language its own dictionary says, and names the languages for the owner email", () => {
    expect(sq.locale).toBe("sq");
    expect(en.locale).toBe("en");
    expect(sq.contactPage.email.languageNames).toEqual({ sq: "Shqip", en: "Anglisht" });
    expect(Object.keys(errorPages).sort()).toEqual([...locales].sort());
    expect(errorPages.en.title).toBe("Something went wrong");
  });
});

describe("locale-aware formatting", () => {
  it("writes prices in each language's notation without changing the amount", () => {
    expect(formatPrice(199, "en")).toBe("€199");
    expect(formatPrice(1149, "en")).toBe("€1,149");
    expect(formatPrice(12500, "en")).toBe("€12,500");
    expect(formatPrice(199, "sq").replace(/\s/g, " ")).toBe("199 €");
    expect(formatPrice(199)).toBe(formatPrice(199, "sq"));
  });

  it("joins lists with the language's conjunction", () => {
    expect(formatList(["Business", "Professional"], "en")).toBe("Business and Professional");
    expect(formatList(["A", "B", "C"], "en")).toBe("A, B and C");
    expect(formatList(["A", "B"], "sq")).toBe("A dhe B");
  });

  it("uses the same prices and rules in every language", () => {
    for (const pkg of packages) {
      expect(en.pricing.packages[pkg.id].name).toBe(sq.pricing.packages[pkg.id].name);
    }
    const input = { packageId: "business", pages: 8, addOns: ["multilingual", "booking", "analytics"] } as const;
    // Calculations do not depend on the language at all; only the notation does.
    const estimate = calculateEstimate(input);
    expect(estimate.kind === "estimate" && estimate.total).toBe(879);
  });
});

describe("English URLs", () => {
  it("serves every English page from the same internal route as the Albanian one", () => {
    for (const page of allPages()) {
      const sqInternal = resolvePublicPath(pagePath("sq", page));
      const enInternal = resolvePublicPath(pagePath("en", page));
      expect(sqInternal.type).toBe("rewrite");
      expect(enInternal).toEqual({ type: "rewrite", path: sqInternal.path.replace(/^\/sq/, "/en") });
      // And back to the public path, as the navigation renders it.
      expect(toPublicPath(enInternal.path)).toBe(pagePath("en", page));
    }
  });

  it("redirects internal (Albanian) slugs under /en to the English URL", () => {
    expect(resolvePublicPath("/en/sherbimet")).toEqual({ type: "redirect", path: "/en/services" });
    expect(resolvePublicPath("/en/kontakt")).toEqual({ type: "redirect", path: "/en/contact" });
    expect(resolvePublicPath("/en/projektet/klinike-dentare")).toEqual({ type: "redirect", path: "/en/projects/klinike-dentare" });
  });

  it("serves the social image per language", () => {
    expect(resolvePublicPath("/opengraph-image")).toEqual({ type: "rewrite", path: "/sq/opengraph-image" });
    expect(resolvePublicPath("/en/opengraph-image")).toEqual({ type: "rewrite", path: "/en/opengraph-image" });
  });

  it("knows the language of every public path", () => {
    expect(localeFromPublicPath("/")).toBe("sq");
    expect(localeFromPublicPath("/sherbimet")).toBe("sq");
    expect(localeFromPublicPath("/en")).toBe("en");
    expect(localeFromPublicPath("/en/services")).toBe("en");
    expect(localeFromPublicPath("/de/leistungen")).toBe("sq");
  });

  it("translates internal links, keeping query strings and anchors", () => {
    expect(localizeHref("/sherbimet#online-shop", "en")).toBe("/en/services#online-shop");
    expect(localizeHref("/kontakt?paketa=business&vleresim=1", "en")).toBe("/en/contact?paketa=business&vleresim=1");
    expect(localizeHref("/projektet/klinike-dentare", "en")).toBe("/en/projects/klinike-dentare");
    expect(localizeHref("/", "en")).toBe("/en");
    // Albanian links, other links and unknown paths stay as they are.
    expect(localizeHref("/sherbimet", "sq")).toBe("/sherbimet");
    expect(localizeHref("https://example.com/", "en")).toBe("https://example.com/");
    expect(localizeHref("#main", "en")).toBe("#main");
    expect(localizeHref("/brand/logo.png", "en")).toBe("/brand/logo.png");
  });

  it("switches to the same page in the other language, or its home page when there is none", () => {
    expect(switchLocalePath("/llogarit-cmimin", "en")).toBe("/en/price-calculator");
    expect(switchLocalePath("/en/price-calculator", "sq")).toBe("/llogarit-cmimin");
    expect(switchLocalePath("/projektet/dyqan-veshjesh", "en")).toBe("/en/projects/dyqan-veshjesh");
    expect(switchLocalePath("/en", "sq")).toBe("/");
    expect(switchLocalePath("/sherbimet", "sq")).toBe("/sherbimet");
    expect(switchLocalePath("/nuk-ekziston", "en")).toBe("/en");
    expect(switchLocalePath("/en/nope", "sq")).toBe("/");
  });

  it("has a unique, English URL for every page", () => {
    const paths = Object.values(localizedRoutes.en);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) expect(path === "/en" || path.startsWith("/en/"), path).toBe(true);
  });
});

describe("localized metadata", () => {
  it("gives English pages English titles, their own canonical URL and hreflang alternates", () => {
    const metadata = pageMetadata("estimator", ORIGIN, "en");
    expect(metadata.title).toBe(en.pages.estimator.title);
    expect(metadata.alternates).toEqual({
      canonical: "https://widecode.example/en/price-calculator",
      languages: {
        sq: "https://widecode.example/llogarit-cmimin",
        en: "https://widecode.example/en/price-calculator",
        "x-default": "https://widecode.example/llogarit-cmimin",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      locale: "en_US",
      alternateLocale: ["sq_AL"],
      url: "https://widecode.example/en/price-calculator",
      images: [expect.objectContaining({ url: "/en/opengraph-image", alt: en.meta.ogImage.alt })],
    });
  });

  it("lists the same alternates on the Albanian page, and none before the domain is set", () => {
    expect(pageMetadata("estimator", ORIGIN).alternates?.languages).toEqual(
      pageMetadata("estimator", ORIGIN, "en").alternates?.languages,
    );
    expect(homeMetadata(ORIGIN, "en").alternates?.canonical).toBe("https://widecode.example/en");
    expect(pageMetadata("estimator", null, "en").alternates).toBeUndefined();
  });

  it("lists every page in every language in the sitemap, each with all its language versions", () => {
    const entries = sitemapEntries(ORIGIN);
    expect(entries).toHaveLength(allPages().length * locales.length);
    const contact = entries.find((entry) => entry.url === "https://widecode.example/en/contact");
    expect(contact?.alternates?.languages).toEqual({
      sq: "https://widecode.example/kontakt",
      en: "https://widecode.example/en/contact",
      "x-default": "https://widecode.example/kontakt",
    });
    for (const entry of entries) {
      expect(Object.values(entry.alternates?.languages ?? {})).toContain(entry.url);
    }
  });

  it("describes the site in the page's language in structured data", () => {
    const [organization, website] = siteJsonLd(en.meta.description, ORIGIN, "en")["@graph"];
    expect(organization).toMatchObject({ url: "https://widecode.example/en", areaServed: { name: "Kosovo" } });
    expect(website).toMatchObject({ inLanguage: "en", url: "https://widecode.example/en" });
    expect(faqJsonLd([], "en").inLanguage).toBe("en");
    const [service] = servicesJsonLd([{ name: "S", description: "D", path: "/en/services#online-shop", startingPrice: 999 }], ORIGIN, "en")["@graph"];
    expect(service).toMatchObject({ url: "https://widecode.example/en/services#online-shop", areaServed: { name: "Kosovo" } });
    expect(localeMeta.en.htmlLang).toBe("en");
  });
});

describe("quote requests from the English site", () => {
  const values = {
    name: "Jane Smith",
    business: "",
    email: "jane@example.com",
    phone: "",
    projectType: "business",
    packageId: "business",
    budget: "300-600",
    timeline: "flexible",
    description: "A website for our restaurant with a menu and bookings.",
  };

  async function send(locale: unknown) {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ id: "x" }), { status: 200 }));
    const result = await handleQuoteSubmission(
      { values, estimate: null, projectSlug: null, website: "", elapsedMs: 20_000, submissionId: "abcdef12", locale },
      {
        visitorKey: "203.0.113.9",
        config: { mode: "resend", apiKey: "k", to: ["o@example.com"], from: "W <w@example.com>", endpoint: "https://api.resend.com/emails" },
        fetchImpl,
        log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
        limiters: { perVisitor: new RateLimiter(5, 600_000), global: new RateLimiter(50, 3_600_000) },
      },
    );
    const body = JSON.parse(String((fetchImpl.mock.calls[0]?.[1] as RequestInit).body)) as { text: string; subject: string };
    return { result, body };
  }

  it("sends the owner email in Albanian, naming the language the customer used", async () => {
    const { result, body } = await send("en");
    expect(result).toEqual({ status: "sent" });
    expect(body.text).toContain("Gjuha e klientit: Anglisht");
    expect(body.text).toContain("Emri dhe mbiemri: Jane Smith");
    expect(body.subject).toMatch(/^Kërkesë për ofertë:/);
  });

  it("accepts only supported languages; anything else counts as Albanian", async () => {
    for (const locale of [undefined, "fr", "EN", "<script>", 42, null]) {
      const { body } = await send(locale);
      expect(body.text, String(locale)).toContain("Gjuha e klientit: Shqip");
    }
  });
});
