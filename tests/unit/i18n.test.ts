import { describe, expect, it, vi } from "vitest";
import { packages } from "@/config/pricing";
import { formatPrice } from "@/config/pricing";
import { getDictionary } from "@/content";
import { errorPages } from "@/content/error-pages";
import { defaultLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import {
  allPages,
  isNotFoundPath,
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
const de = getDictionary("de");
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

/** Brand, package and product names that are the same in every language. */
const names = ["Instagram", "Facebook", "LinkedIn", "GitHub", "TikTok", "X", "Starter", "Business", "Professional", "E-commerce", "Custom"];

/**
 * Reviewed texts that may be identical to the Albanian (and, for German, the
 * English) original. A new entry here needs a reason.
 */
const shared: Record<Exclude<Locale, "sq">, { sq: Set<string>; en?: Set<string> }> = {
  en: {
    // "1 minute" is also correct Albanian ("pas 1 minute").
    sq: new Set([...names, "Email", "Online Shop", "Online shop", "Custom Development", "One-page", "One-page website", "Dashboard", "Responsive", "+{price}", "1 minute"]),
  },
  de: {
    // "Kontakt" and "Katalog" are the German words too; "300–600 €" is the same notation.
    sq: new Set([...names, "Kontakt", "Katalog", "Dashboard", "+{price}", "300–600 €"]),
    // Words German uses as they are (Design, Code, Live, Checkout, Dashboard, FAQ, …).
    en: new Set([...names, "Kosovo", "FAQ", "Design", "Code", "Live", "Navigation", "Checkout", "Dashboard", "Performance", "Mission", "optional", "+{price}"]),
  },
};

describe.each([
  ["English", "en"],
  ["German", "de"],
] as const)("%s dictionary", (_, locale) => {
  const sqStrings = strings(sq);
  const own = strings(getDictionary(locale));

  it("has exactly the same entries as the Albanian one (nothing missing, nothing extra)", () => {
    expect([...own.keys()].sort()).toEqual([...sqStrings.keys()].sort());
  });

  it("has no empty texts and the same placeholders as Albanian in every text", () => {
    for (const [key, text] of own) {
      expect(text.trim(), key).not.toBe("");
      expect(placeholders(text), key).toEqual(placeholders(sqStrings.get(key)!));
    }
  });

  it("is actually translated: no Albanian letters, and only names and reviewed shared terms left as they are", () => {
    for (const [key, text] of own) expect(text, key).not.toMatch(/[ëçËÇ]/);
    for (const [other, allowed] of Object.entries(shared[locale]) as Array<[Locale, Set<string>]>) {
      const otherStrings = strings(getDictionary(other));
      const untranslated = [...own].filter(([key, text]) => otherStrings.get(key) === text && key !== "locale");
      for (const [key, text] of untranslated) {
        expect(allowed.has(text), `${key}: "${text}" is identical in ${locale} and ${other}`).toBe(true);
      }
    }
  });

  it("is the language its own dictionary says", () => {
    expect(getDictionary(locale).locale).toBe(locale);
  });
});

describe("German copy", () => {
  it("uses German typography: „quotes“, and no English quote marks or apostrophes", () => {
    for (const [key, text] of strings(de)) {
      expect(text, key).not.toMatch(/["'’”]/);
      // Every „ is closed by “ (and “ never opens a quote).
      expect((text.match(/„/g) ?? []).length, key).toBe((text.match(/“/g) ?? []).length);
    }
  });

  it("promises no languages of communication the owner has not confirmed", () => {
    // The Albanian original only says "we speak Albanian" (sq: why.items.communication); see aboutPage.
    for (const dict of [en, de]) {
      expect(dict.why.items.communication.text).not.toMatch(/English|Englisch|German|Deutsch/);
      expect(dict.aboutPage.values.items.communication.text).not.toMatch(/English|Englisch|German|Deutsch/);
    }
  });

  it("names the languages for the owner email, and error pages exist in every language", () => {
    expect(sq.contactPage.email.languageNames).toEqual({ sq: "Shqip", en: "Anglisht", de: "Gjermanisht" });
    expect(Object.keys(errorPages).sort()).toEqual([...locales].sort());
    expect(errorPages.en.title).toBe("Something went wrong");
    expect(errorPages.de.title).toBe("Etwas ist schiefgelaufen");
  });

  it("labels the back-to-top button in every language", () => {
    expect([sq.a11y.backToTop, en.a11y.backToTop, de.a11y.backToTop]).toEqual(["Kthehu në krye", "Back to top", "Zurück nach oben"]);
  });
});

describe("locale-aware formatting", () => {
  it("writes prices in each language's notation without changing the amount", () => {
    expect(formatPrice(199, "en")).toBe("€199");
    expect(formatPrice(1149, "en")).toBe("€1,149");
    expect(formatPrice(12500, "en")).toBe("€12,500");
    expect(formatPrice(199, "sq").replace(/\s/g, " ")).toBe("199 €");
    expect(formatPrice(199)).toBe(formatPrice(199, "sq"));
    expect(formatPrice(199, "de").replace(/\s/g, " ")).toBe("199 €");
    expect(formatPrice(1149, "de").replace(/\s/g, " ")).toBe("1.149 €");
    expect(formatPrice(12500, "de").replace(/\s/g, " ")).toBe("12.500 €");
    // A non-breaking space, so the amount and € never wrap apart.
    expect(formatPrice(199, "de")).toBe(`199${String.fromCharCode(0xa0)}€`);
  });

  it("joins lists with the language's conjunction", () => {
    expect(formatList(["Business", "Professional"], "en")).toBe("Business and Professional");
    expect(formatList(["A", "B", "C"], "en")).toBe("A, B and C");
    expect(formatList(["A", "B"], "sq")).toBe("A dhe B");
    expect(formatList(["A", "B", "C"], "de")).toBe("A, B und C");
  });

  it("uses the same prices and rules in every language", () => {
    for (const pkg of packages) {
      for (const dict of [en, de]) expect(dict.pricing.packages[pkg.id].name).toBe(sq.pricing.packages[pkg.id].name);
    }
    const input = { packageId: "business", pages: 8, addOns: ["multilingual", "booking", "analytics"] } as const;
    // Calculations do not depend on the language at all; only the notation does.
    const estimate = calculateEstimate(input);
    expect(estimate.kind === "estimate" && estimate.total).toBe(879);
  });
});

describe.each([
  ["English", "en", "/en/services", "/en/contact", "/en/projects/klinike-dentare", "/en/price-calculator"],
  ["German", "de", "/de/leistungen", "/de/kontakt", "/de/projekte/klinike-dentare", "/de/preisrechner"],
] as const)("%s URLs", (_, locale, services, contact, project, estimator) => {
  it("serves every page from the same internal route as the Albanian one", () => {
    for (const page of allPages()) {
      const sqInternal = resolvePublicPath(pagePath("sq", page));
      const internal = resolvePublicPath(pagePath(locale, page));
      expect(sqInternal.type).toBe("rewrite");
      expect(internal).toEqual({ type: "rewrite", path: sqInternal.path.replace(/^\/sq/, `/${locale}`) });
      // And back to the public path, as the navigation renders it.
      expect(toPublicPath(internal.path)).toBe(pagePath(locale, page));
    }
  });

  it("redirects internal (Albanian) slugs to the language's URL", () => {
    expect(resolvePublicPath(`/${locale}/sherbimet`)).toEqual({ type: "redirect", path: services });
    expect(resolvePublicPath(`/${locale}/llogarit-cmimin`)).toEqual({ type: "redirect", path: estimator });
    expect(resolvePublicPath(`/${locale}/projektet/klinike-dentare`)).toEqual({ type: "redirect", path: project });
  });

  it("serves the social image per language", () => {
    expect(resolvePublicPath(`/${locale}/opengraph-image`)).toEqual({ type: "rewrite", path: `/${locale}/opengraph-image` });
  });

  it("knows the language of its paths", () => {
    expect(localeFromPublicPath(`/${locale}`)).toBe(locale);
    expect(localeFromPublicPath(services)).toBe(locale);
  });

  it("translates internal links, keeping query strings and anchors", () => {
    expect(localizeHref("/sherbimet#online-shop", locale)).toBe(`${services}#online-shop`);
    expect(localizeHref("/kontakt?paketa=business&vleresim=1", locale)).toBe(`${contact}?paketa=business&vleresim=1`);
    expect(localizeHref("/projektet/klinike-dentare", locale)).toBe(project);
    expect(localizeHref("/", locale)).toBe(`/${locale}`);
    expect(localizeHref("https://example.com/", locale)).toBe("https://example.com/");
    expect(localizeHref("#main", locale)).toBe("#main");
    expect(localizeHref("/brand/logo.png", locale)).toBe("/brand/logo.png");
  });

  it("has a unique URL for every page, under its own prefix", () => {
    const paths = Object.values(localizedRoutes[locale]);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) expect(path === `/${locale}` || path.startsWith(`/${locale}/`), path).toBe(true);
  });

  it("sends unknown pages in this language to the 404 page, in this language", () => {
    for (const path of [`/${locale}/nope`, `${services}/extra`, `/${locale}/projekte-x`, `${project}-x`]) {
      expect(resolvePublicPath(path), path).toEqual({ type: "rewrite", path: `/${locale}/_nuk-ekziston` });
      expect(localeFromPublicPath(path)).toBe(locale);
    }
    expect(isNotFoundPath(`/${locale}/_nuk-ekziston`)).toBe(true);
    expect(isNotFoundPath(`/${locale}/sherbimet`)).toBe(false);
  });
});

describe("German URLs", () => {
  it("uses the approved German slugs", () => {
    expect(localizedRoutes.de).toEqual({
      home: "/de",
      services: "/de/leistungen",
      projects: "/de/projekte",
      pricing: "/de/preise",
      estimator: "/de/preisrechner",
      about: "/de/ueber-uns",
      faq: "/de/faq",
      contact: "/de/kontakt",
    });
  });

  it("keeps Albanian URLs unprefixed and their languages apart", () => {
    expect(localeFromPublicPath("/")).toBe("sq");
    expect(localeFromPublicPath("/sherbimet")).toBe("sq");
    expect(localeFromPublicPath("/kontakt")).toBe("sq");
    // /de/kontakt and /kontakt share the slug but are different pages.
    expect(resolvePublicPath("/kontakt")).toEqual({ type: "rewrite", path: "/sq/kontakt" });
    expect(resolvePublicPath("/de/kontakt")).toEqual({ type: "rewrite", path: "/de/kontakt" });
    // English slugs under /de are not German pages.
    expect(resolvePublicPath("/de/services")).toEqual({ type: "rewrite", path: "/de/_nuk-ekziston" });
    expect(localeFromPublicPath("/fr/services")).toBe("sq");
  });

  it("switches between all three languages on the same page, or the home page when there is none", () => {
    expect(switchLocalePath("/llogarit-cmimin", "de")).toBe("/de/preisrechner");
    expect(switchLocalePath("/de/preisrechner", "en")).toBe("/en/price-calculator");
    expect(switchLocalePath("/en/price-calculator", "de")).toBe("/de/preisrechner");
    expect(switchLocalePath("/de/preisrechner", "sq")).toBe("/llogarit-cmimin");
    expect(switchLocalePath("/projektet/dyqan-veshjesh", "de")).toBe("/de/projekte/dyqan-veshjesh");
    expect(switchLocalePath("/de/ueber-uns", "en")).toBe("/en/about");
    expect(switchLocalePath("/de", "sq")).toBe("/");
    expect(switchLocalePath("/de/faq", "de")).toBe("/de/faq");
    expect(switchLocalePath("/de/nope", "en")).toBe("/en");
    expect(switchLocalePath("/nuk-ekziston", "de")).toBe("/de");
  });
});

describe("English URLs (unchanged by German)", () => {
  it("switches to the same page in the other language, or its home page when there is none", () => {
    expect(switchLocalePath("/llogarit-cmimin", "en")).toBe("/en/price-calculator");
    expect(switchLocalePath("/en/price-calculator", "sq")).toBe("/llogarit-cmimin");
    expect(switchLocalePath("/projektet/dyqan-veshjesh", "en")).toBe("/en/projects/dyqan-veshjesh");
    expect(switchLocalePath("/en", "sq")).toBe("/");
    expect(switchLocalePath("/sherbimet", "sq")).toBe("/sherbimet");
    expect(switchLocalePath("/nuk-ekziston", "en")).toBe("/en");
    expect(switchLocalePath("/en/nope", "sq")).toBe("/");
    expect(localizeHref("/sherbimet", "sq")).toBe("/sherbimet");
  });

  it("serves the Albanian social image without a prefix", () => {
    expect(resolvePublicPath("/opengraph-image")).toEqual({ type: "rewrite", path: "/sq/opengraph-image" });
  });
});

describe("localized metadata", () => {
  const estimatorLanguages = {
    sq: "https://widecode.example/llogarit-cmimin",
    en: "https://widecode.example/en/price-calculator",
    de: "https://widecode.example/de/preisrechner",
    "x-default": "https://widecode.example/llogarit-cmimin",
  };

  it("gives English pages English titles, their own canonical URL and hreflang alternates", () => {
    const metadata = pageMetadata("estimator", ORIGIN, "en");
    expect(metadata.title).toBe(en.pages.estimator.title);
    expect(metadata.alternates).toEqual({ canonical: "https://widecode.example/en/price-calculator", languages: estimatorLanguages });
    expect(metadata.openGraph).toMatchObject({
      locale: "en_US",
      alternateLocale: ["sq_AL", "de_DE"],
      url: "https://widecode.example/en/price-calculator",
      images: [expect.objectContaining({ url: "/en/opengraph-image", alt: en.meta.ogImage.alt })],
    });
  });

  it("gives German pages German titles, their own canonical URL and hreflang alternates", () => {
    const metadata = pageMetadata("estimator", ORIGIN, "de");
    expect(metadata.title).toBe(de.pages.estimator.title);
    expect(metadata.description).toBe(de.pages.estimator.description);
    expect(metadata.alternates).toEqual({ canonical: "https://widecode.example/de/preisrechner", languages: estimatorLanguages });
    expect(metadata.openGraph).toMatchObject({
      locale: "de_DE",
      alternateLocale: ["sq_AL", "en_US"],
      url: "https://widecode.example/de/preisrechner",
      images: [expect.objectContaining({ url: "/de/opengraph-image", alt: de.meta.ogImage.alt })],
    });
    expect(metadata.twitter).toMatchObject({ title: `${de.pages.estimator.title} | WideCode` });
  });

  it("lists the same alternates on every language version, and none before the domain is set", () => {
    for (const locale of locales) {
      expect(pageMetadata("estimator", ORIGIN, locale).alternates?.languages).toEqual(estimatorLanguages);
    }
    expect(homeMetadata(ORIGIN, "en").alternates?.canonical).toBe("https://widecode.example/en");
    expect(homeMetadata(ORIGIN, "de").alternates?.canonical).toBe("https://widecode.example/de");
    expect(pageMetadata("estimator", null, "de").alternates).toBeUndefined();
  });

  it("gives every German page a unique title and description", () => {
    const keys = ["services", "projects", "pricing", "estimator", "about", "faq", "contact"] as const;
    const titles = keys.map((key) => de.pages[key].title);
    const descriptions = keys.map((key) => de.pages[key].description);
    expect(new Set([...titles, de.meta.defaultTitle]).size).toBe(keys.length + 1);
    expect(new Set(descriptions).size).toBe(keys.length);
    for (const text of descriptions) expect(text.length, text).toBeLessThanOrEqual(170);
  });

  it("lists every page in every language in the sitemap, each with all its language versions", () => {
    const entries = sitemapEntries(ORIGIN);
    expect(entries).toHaveLength(allPages().length * locales.length);
    expect(locales).toHaveLength(3);
    const contact = entries.find((entry) => entry.url === "https://widecode.example/de/kontakt");
    expect(contact?.alternates?.languages).toEqual({
      sq: "https://widecode.example/kontakt",
      en: "https://widecode.example/en/contact",
      de: "https://widecode.example/de/kontakt",
      "x-default": "https://widecode.example/kontakt",
    });
    for (const entry of entries) {
      expect(Object.values(entry.alternates?.languages ?? {})).toContain(entry.url);
    }
  });

  it("describes the site in the page's language in structured data", () => {
    for (const [locale, home] of [["en", "/en"], ["de", "/de"]] as const) {
      const [organization, website] = siteJsonLd(getDictionary(locale).meta.description, ORIGIN, locale)["@graph"];
      expect(organization).toMatchObject({ url: `https://widecode.example${home}`, areaServed: { name: "Kosovo" } });
      expect(website).toMatchObject({ inLanguage: locale, url: `https://widecode.example${home}` });
      expect(faqJsonLd([], locale).inLanguage).toBe(locale);
    }
    const [service] = servicesJsonLd([{ name: "S", description: "D", path: "/de/leistungen#online-shop", startingPrice: 999 }], ORIGIN, "de")["@graph"];
    expect(service).toMatchObject({ url: "https://widecode.example/de/leistungen#online-shop", areaServed: { name: "Kosovo" } });
    expect(localeMeta.en.htmlLang).toBe("en");
    expect(localeMeta.de).toMatchObject({ htmlLang: "de", ogLocale: "de_DE", name: "Deutsch" });
  });
});

describe("quote requests from the English and German sites", () => {
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

  it("names German as the customer's language for requests from the German site", async () => {
    const { result, body } = await send("de");
    expect(result).toEqual({ status: "sent" });
    expect(body.text).toContain("Gjuha e klientit: Gjermanisht");
    expect(body.subject).toMatch(/^Kërkesë për ofertë:/);
  });

  it("accepts only supported languages; anything else counts as Albanian", async () => {
    for (const locale of [undefined, "fr", "EN", "DE", "de-DE", "<script>", 42, null]) {
      const { body } = await send(locale);
      expect(body.text, String(locale)).toContain("Gjuha e klientit: Shqip");
    }
    expect(defaultLocale).toBe("sq");
  });
});
