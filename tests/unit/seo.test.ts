import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { serializeJsonLd } from "@/components/seo/json-ld";
import { faqCategoryIds } from "@/config/faq";
import { projectSlugs } from "@/config/projects";
import { routes } from "@/config/routes";
import { getDictionary } from "@/content";
import { faqValues, fillFaqItem } from "@/lib/faq";
import { homeMetadata, pageMetadata, seoMetadata } from "@/lib/metadata";
import { faqJsonLd, indexablePaths, isIndexable, robotsRules, servicesJsonLd, siteJsonLd, sitemapEntries } from "@/lib/seo";
import { isPublicOrigin, resolveCanonicalOrigin } from "@/lib/site-url";

const dict = getDictionary();

/** A production domain for tests (`.example` is reserved, RFC 2606). */
const ORIGIN = new URL("https://widecode.example");
const CONFIGURED = { NEXT_PUBLIC_SITE_URL: ORIGIN.href };

describe("production domain", () => {
  it("is only an explicit, public HTTPS NEXT_PUBLIC_SITE_URL", () => {
    expect(resolveCanonicalOrigin(CONFIGURED)?.href).toBe("https://widecode.example/");
    expect(resolveCanonicalOrigin({})).toBeNull();
    // The Vercel address is used for assets, but never published as canonical.
    expect(resolveCanonicalOrigin({ VERCEL_PROJECT_PRODUCTION_URL: "widecode.vercel.app" })).toBeNull();
    for (const local of ["http://localhost:3000", "https://localhost", "https://127.0.0.1", "https://app.localhost", "http://example.com"]) {
      expect(resolveCanonicalOrigin({ NEXT_PUBLIC_SITE_URL: local }), local).toBeNull();
    }
    expect(isPublicOrigin(new URL("https://example.com"))).toBe(true);
  });
});

describe("isIndexable", () => {
  it("indexes only production builds on the configured domain", () => {
    expect(isIndexable(CONFIGURED)).toBe(true);
    expect(isIndexable({ ...CONFIGURED, VERCEL_ENV: "production" })).toBe(true);
    expect(isIndexable({ ...CONFIGURED, VERCEL_ENV: "preview" })).toBe(false);
    expect(isIndexable({ ...CONFIGURED, VERCEL_ENV: "development" })).toBe(false);
  });

  it("keeps a deployment without a domain out of search results", () => {
    expect(isIndexable({})).toBe(false);
    expect(isIndexable({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "widecode.vercel.app" })).toBe(false);
    expect(isIndexable({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" })).toBe(false);
  });
});

describe("page metadata", () => {
  it("gives every page an absolute canonical URL on the production domain and full social metadata", () => {
    for (const page of ["services", "projects", "pricing", "estimator", "about", "faq", "contact"] as const) {
      const metadata = pageMetadata(page, ORIGIN);
      const url = new URL(routes[page], ORIGIN).href;
      expect(metadata.alternates?.canonical, page).toBe(url);
      expect(metadata.title).toBe(dict.pages[page].title);
      expect(metadata.openGraph).toMatchObject({
        type: "website",
        siteName: "WideCode",
        locale: "sq_AL",
        url,
        title: `${dict.pages[page].title} | WideCode`,
        description: dict.pages[page].description,
        images: [expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 })],
      });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    }
    expect(homeMetadata(ORIGIN).alternates?.canonical).toBe("https://widecode.example/");
  });

  it("publishes no canonical URL or og:url until the domain is configured", () => {
    for (const metadata of [pageMetadata("contact", null), homeMetadata(null), seoMetadata({ title: "T", description: "D", path: "/x" }, null)]) {
      expect(metadata.alternates).toBeUndefined();
      expect(metadata.openGraph).not.toHaveProperty("url");
    }
    // The current build has no NEXT_PUBLIC_SITE_URL, so the defaults behave the same.
    expect(pageMetadata("contact").alternates).toBeUndefined();
  });

  it("has unique, natural search titles and descriptions of a sensible length", () => {
    const entries = [
      ["home", { title: dict.meta.defaultTitle, description: dict.meta.description }] as const,
      ...Object.entries(dict.pages).map(([page, copy]) => [page, { ...copy, title: `${copy.title} | WideCode` }] as const),
    ];
    for (const [page, copy] of entries) {
      expect(copy.title.length, `${page} title`).toBeLessThanOrEqual(66);
      expect(copy.description.length, `${page} description`).toBeGreaterThanOrEqual(100);
      expect(copy.description.length, `${page} description`).toBeLessThanOrEqual(165);
      // No keyword stuffing: the same search word at most twice per title.
      const words = copy.title.toLowerCase().match(/[a-zëç]{4,}/g) ?? [];
      for (const word of new Set(words)) expect(words.filter((w) => w === word).length, `${page}: "${word}"`).toBeLessThanOrEqual(2);
    }
    expect(new Set(entries.map(([, c]) => c.title)).size).toBe(entries.length);
    expect(new Set(entries.map(([, c]) => c.description)).size).toBe(entries.length);
  });
});

describe("sitemap and robots", () => {
  it("lists every page and project on the production domain, without invented dates", () => {
    const entries = sitemapEntries(ORIGIN);
    // Every published language: Albanian, then English (Phase B) and German (Phase C).
    expect(entries.map((e) => e.url)).toEqual(
      [...indexablePaths("sq"), ...indexablePaths("en"), ...indexablePaths("de")].map((path) => new URL(path, ORIGIN).href),
    );
    expect(indexablePaths()).toEqual([...Object.values(routes), ...projectSlugs.map((slug) => `/projektet/${slug}`)]);
    for (const entry of entries) expect(entry.lastModified).toBeUndefined();
  });

  it("allows crawling and points to the sitemap on the production domain", () => {
    expect(robotsRules(CONFIGURED)).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://widecode.example/sitemap.xml",
    });
  });

  it("lists nothing and blocks crawling while the domain is not configured (never localhost)", () => {
    expect(sitemapEntries(null)).toEqual([]);
    expect(robotsRules({})).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(robotsRules({ ...CONFIGURED, VERCEL_ENV: "preview" })).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    // The route handlers of this (unconfigured) build:
    expect(sitemap()).toEqual([]);
    expect(JSON.stringify(robots())).not.toContain("localhost");
  });
});

describe("structured data", () => {
  it("escapes characters that could close the script element", () => {
    const lineSeparator = String.fromCharCode(0x2028);
    const json = serializeJsonLd({ text: `</script><script>alert(1)</script> & ${lineSeparator}` });
    expect(json).not.toContain("<");
    expect(json).not.toContain(">");
    expect(json).not.toContain("&");
    expect(JSON.parse(json)).toEqual({ text: `</script><script>alert(1)</script> & ${lineSeparator}` });
  });

  it("describes the organization and website without invented contact details", () => {
    const data = siteJsonLd(dict.meta.description, ORIGIN);
    const [organization, website] = data["@graph"];
    expect(organization).toMatchObject({ "@type": "Organization", name: "WideCode" });
    // Nothing is configured in src/config/site.ts yet, so nothing may appear.
    expect(organization).not.toHaveProperty("email");
    expect(organization).not.toHaveProperty("telephone");
    expect(organization).not.toHaveProperty("sameAs");
    expect(organization).not.toHaveProperty("address");
    expect(website).toMatchObject({ "@type": "WebSite", inLanguage: "sq" });
    expect(JSON.stringify(data)).not.toContain("localhost");
  });

  it("describes services with published starting prices only, no ratings or reviews", () => {
    // Soft hyphens (line-break hints in German titles) never reach structured data.
    const SHY = String.fromCharCode(0xad);
    const [german] = servicesJsonLd(
      [{ name: `Unter${SHY}nehmens${SHY}website`, description: `Text${SHY}teil`, path: "/de/leistungen#website-biznesi", startingPrice: 399 }],
      ORIGIN,
      "de",
    )["@graph"];
    expect(german).toMatchObject({ name: "Unternehmenswebsite", serviceType: "Unternehmenswebsite", description: "Textteil" });

    const data = servicesJsonLd(
      [
        { name: "Online Shop", description: "D", path: "/sherbimet#online-shop", startingPrice: 999 },
        { name: "Custom Development", description: "D", path: "/sherbimet#custom-development", startingPrice: null },
      ],
      ORIGIN,
    );
    const [shop, custom] = data["@graph"];
    expect(shop).toMatchObject({
      "@type": "Service",
      url: "https://widecode.example/sherbimet#online-shop",
      provider: { "@type": "Organization", name: "WideCode" },
      offers: { priceCurrency: "EUR", priceSpecification: { minPrice: 999, priceCurrency: "EUR" } },
    });
    expect(custom).not.toHaveProperty("offers");
    expect(JSON.stringify(data)).not.toMatch(/aggregateRating|review|award/i);
  });

  it("lists every FAQ question with its filled-in answer", () => {
    const items = Object.values(dict.faqPage.categories).flatMap((c) => c.items.map((item) => fillFaqItem(item)));
    const data = faqJsonLd(items);
    expect(data.mainEntity).toHaveLength(items.length);
    for (const entry of data.mainEntity) {
      expect(entry.acceptedAnswer.text).not.toMatch(/\{\w+\}/);
    }
  });
});

describe("FAQ content", () => {
  const values = faqValues();
  const all = Object.values(dict.faqPage.categories).flatMap((c) => c.items);

  it("fills every placeholder from the pricing config", () => {
    const nbsp = String.fromCharCode(0xa0);
    expect(values).toEqual({ price: `199${nbsp}€`, multilingualPrice: `150${nbsp}€`, ecommercePrice: `999${nbsp}€` });
    for (const item of all) expect(() => fillFaqItem(item, values), item.question).not.toThrow();
  });

  it("includes every question shown on the other pages, word for word", () => {
    for (const item of dict.faq.items) expect(all).toContainEqual(item);
  });

  it("has unique questions and one topic per configured anchor", () => {
    expect(new Set(all.map((i) => i.question)).size).toBe(all.length);
    expect(Object.keys(dict.faqPage.categories)).toEqual([...faqCategoryIds]);
    for (const id of faqCategoryIds) expect(id).toMatch(/^[a-z-]+$/);
  });

  it("describes the same five process steps as the process section", () => {
    const process = all.find((i) => i.question === "Si duket procesi i punës?");
    for (const step of dict.process.steps) expect(process?.answer.toLowerCase()).toContain(step.title.toLowerCase());
  });

  it("never promises terms, durations, hosting or support that the owner has not confirmed", () => {
    const text = all.map((i) => `${i.question} ${i.answer}`).join(" ");
    expect(text).not.toMatch(/\d+\s*(ditë|javë|muaj|orë)/i);
    expect(text).not.toMatch(/\d+\s*%/);
    expect(text).not.toMatch(/falas|garanci|hosting(-u)? (është )?i përfshirë|mirëmbajtje falas/i);
  });
});
