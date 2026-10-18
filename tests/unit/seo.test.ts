import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { serializeJsonLd } from "@/components/seo/json-ld";
import { faqCategoryIds } from "@/config/faq";
import { projectSlugs } from "@/config/projects";
import { routes } from "@/config/routes";
import { getDictionary } from "@/content";
import { faqValues, fillFaqItem } from "@/lib/faq";
import { pageMetadata, seoMetadata } from "@/lib/metadata";
import { faqJsonLd, isIndexable, siteJsonLd } from "@/lib/seo";

const dict = getDictionary();

describe("isIndexable", () => {
  it("indexes production and self-hosted builds, never Vercel previews", () => {
    expect(isIndexable({})).toBe(true);
    expect(isIndexable({ VERCEL_ENV: "production" })).toBe(true);
    expect(isIndexable({ VERCEL_ENV: "preview" })).toBe(false);
    expect(isIndexable({ VERCEL_ENV: "development" })).toBe(false);
  });
});

describe("page metadata", () => {
  it("gives every page a canonical URL without query parameters and full social metadata", () => {
    for (const page of ["services", "projects", "pricing", "estimator", "about", "faq", "contact"] as const) {
      const metadata = pageMetadata(page);
      expect(metadata.alternates?.canonical, page).toBe(routes[page]);
      expect(metadata.title).toBe(dict.pages[page].title);
      expect(metadata.openGraph).toMatchObject({
        type: "website",
        siteName: "WideCode",
        locale: "sq_AL",
        url: routes[page],
        title: `${dict.pages[page].title} | WideCode`,
        description: dict.pages[page].description,
      });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    }
  });

  it("keeps descriptions within a length search engines show in full", () => {
    for (const [page, copy] of Object.entries(dict.pages)) {
      expect(copy.description.length, page).toBeGreaterThan(50);
      expect(copy.description.length, page).toBeLessThanOrEqual(170);
    }
    expect(dict.meta.description.length).toBeLessThanOrEqual(170);
  });

  it("builds metadata for any path", () => {
    expect(seoMetadata({ title: "T", description: "D", path: "/projektet/x" }).alternates?.canonical).toBe("/projektet/x");
  });
});

describe("sitemap and robots", () => {
  it("lists every page and project with absolute URLs, without invented dates", () => {
    const entries = sitemap();
    const urls = entries.map((e) => new URL(e.url).pathname);
    expect(urls).toEqual([...Object.values(routes), ...projectSlugs.map((slug) => `/projektet/${slug}`)]);
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https?:\/\//);
      expect(entry.lastModified).toBeUndefined();
    }
  });

  it("allows crawling and points to the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
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
    const data = siteJsonLd(dict.meta.description);
    const [organization, website] = data["@graph"];
    expect(organization).toMatchObject({ "@type": "Organization", name: "WideCode" });
    // Nothing is configured in src/config/site.ts yet, so nothing may appear.
    expect(organization).not.toHaveProperty("email");
    expect(organization).not.toHaveProperty("telephone");
    expect(organization).not.toHaveProperty("sameAs");
    expect(organization).not.toHaveProperty("address");
    expect(website).toMatchObject({ "@type": "WebSite", inLanguage: "sq" });
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
