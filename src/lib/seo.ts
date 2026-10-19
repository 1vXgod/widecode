import type { MetadataRoute } from "next";
import { projectHref, projectSlugs } from "@/config/projects";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getContactChannels, getSocialLinks } from "@/lib/contact";
import { resolveCanonicalOrigin } from "@/lib/site-url";
import type { FaqItem } from "@/types/content";

type Env = Record<string, string | undefined>;

/**
 * Whether search engines may index this deployment: only a production build
 * (Vercel production, or self-hosted without VERCEL_ENV) whose public domain is
 * configured in NEXT_PUBLIC_SITE_URL. Vercel previews, local builds and a
 * production deployment still waiting for its domain are kept out of search
 * results, so no temporary address is ever indexed.
 */
export function isIndexable(env: Env = process.env): boolean {
  const production = env.VERCEL_ENV === undefined || env.VERCEL_ENV === "production";
  return production && resolveCanonicalOrigin(env) !== null;
}

/** Every public, indexable page. There are no admin, login or private routes. */
export function indexablePaths(): string[] {
  return [...Object.values(routes), ...projectSlugs.map(projectHref)];
}

/** Sitemap entries on the canonical origin; empty while the domain is not configured. */
export function sitemapEntries(origin: URL | null = siteConfig.canonicalUrl): MetadataRoute.Sitemap {
  if (!origin) return [];
  return indexablePaths().map((path) => ({ url: new URL(path, origin).href }));
}

/** robots.txt rules: crawl everything on the configured production domain, nothing elsewhere. */
export function robotsRules(env: Env = process.env): MetadataRoute.Robots {
  const origin = resolveCanonicalOrigin(env);
  if (!isIndexable(env) || !origin) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", origin).href };
}

const KOSOVO = { "@type": "Country", name: "Kosovë" } as const;

function organizationReference(origin: URL) {
  return { "@type": "Organization", "@id": new URL("/#organization", origin).href, name: siteConfig.name };
}

/**
 * schema.org Organization and WebSite for the home page. Only configured,
 * real contact details and profiles are included; no address, phone number,
 * ratings or other facts are added unless they are configured.
 */
export function siteJsonLd(description: string, origin: URL) {
  const channels = getContactChannels(siteConfig.contact);
  const email = channels.find((c) => c.type === "email")?.value;
  const telephone = channels.find((c) => c.type === "phone")?.value;
  const sameAs = getSocialLinks(siteConfig.social).map((link) => link.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...organizationReference(origin),
        url: new URL("/", origin).href,
        logo: new URL("/apple-icon.png", origin).href,
        description,
        areaServed: KOSOVO,
        ...(email ? { email } : {}),
        ...(telephone ? { telephone } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": new URL("/#website", origin).href,
        name: siteConfig.name,
        url: new URL("/", origin).href,
        inLanguage: siteConfig.locale,
        publisher: { "@id": new URL("/#organization", origin).href },
      },
    ],
  };
}

export type ServiceJsonLdInput = {
  name: string;
  description: string;
  /** Path of the service's section, e.g. /sherbimet#online-shop. */
  path: string;
  /** Lowest indicative starting price in EUR, or null for "custom quote". */
  startingPrice: number | null;
};

/** schema.org Service entries for the services page, with the published starting prices only. */
export function servicesJsonLd(services: readonly ServiceJsonLdInput[], origin: URL) {
  return {
    "@context": "https://schema.org",
    "@graph": services.map((service) => ({
      "@type": "Service",
      "@id": new URL(service.path, origin).href,
      name: service.name,
      serviceType: service.name,
      description: service.description,
      url: new URL(service.path, origin).href,
      areaServed: KOSOVO,
      provider: organizationReference(origin),
      ...(service.startingPrice === null
        ? {}
        : {
            offers: {
              "@type": "Offer",
              priceCurrency: "EUR",
              // Indicative starting price ("from"), never a fixed price.
              priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: service.startingPrice,
                priceCurrency: "EUR",
              },
            },
          }),
    })),
  };
}

/** schema.org FAQPage; answers must already have their placeholders filled. Contains no URLs. */
export function faqJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: siteConfig.locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
