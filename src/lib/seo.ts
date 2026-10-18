import { siteConfig } from "@/config/site";
import { getContactChannels, getSocialLinks } from "@/lib/contact";
import type { FaqItem } from "@/types/content";

type Env = Record<string, string | undefined>;

/**
 * Whether search engines may index this deployment. Vercel preview and
 * development deployments are kept out of search results; production and
 * self-hosted builds (no VERCEL_ENV) are indexable.
 */
export function isIndexable(env: Env = process.env): boolean {
  return env.VERCEL_ENV === undefined || env.VERCEL_ENV === "production";
}

/** Absolute URL on the configured site origin. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).href;
}

const organizationId = () => absoluteUrl("/#organization");

/**
 * schema.org Organization and WebSite for the home page. Only configured,
 * real contact details and profiles are included; nothing is invented.
 */
export function siteJsonLd(description: string) {
  const channels = getContactChannels(siteConfig.contact);
  const email = channels.find((c) => c.type === "email")?.value;
  const telephone = channels.find((c) => c.type === "phone")?.value;
  const sameAs = getSocialLinks(siteConfig.social).map((link) => link.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId(),
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/apple-icon.png"),
        description,
        areaServed: { "@type": "Country", name: "Kosovë" },
        ...(email ? { email } : {}),
        ...(telephone ? { telephone } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: siteConfig.name,
        url: absoluteUrl("/"),
        inLanguage: siteConfig.locale,
        publisher: { "@id": organizationId() },
      },
    ],
  };
}

/** schema.org FAQPage; answers must already have their placeholders filled. */
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
