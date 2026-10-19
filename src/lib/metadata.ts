import type { Metadata } from "next";
import type { RouteKey } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { defaultLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { pagePath, type PageRef } from "@/i18n/routing";

/** Public URL of a language's social preview image (src/app/[lang]/opengraph-image.tsx). */
export function socialImagePath(locale: Locale = defaultLocale): string {
  return locale === defaultLocale ? "/opengraph-image" : `/${locale}/opengraph-image`;
}

/** The social preview image generated for a language. */
export function socialImage(locale: Locale = defaultLocale) {
  return {
    url: socialImagePath(locale),
    width: 1200,
    height: 630,
    alt: getDictionary(locale).meta.ogImage.alt,
    type: "image/png",
  };
}

/**
 * Open Graph fields every page shares, including the social image. Next.js
 * merges metadata shallowly, so a page that sets `openGraph` replaces the
 * layout's (and loses the root image): always spread this in.
 */
export function baseOpenGraph(locale: Locale = defaultLocale) {
  return {
    type: "website" as const,
    siteName: siteConfig.name,
    locale: localeMeta[locale].ogLocale,
    alternateLocale: locales.filter((other) => other !== locale).map((other) => localeMeta[other].ogLocale),
    images: [socialImage(locale)],
  };
}

/**
 * Canonical URL, hreflang alternates and og:url for a page, as absolute URLs on
 * the production domain. Empty until NEXT_PUBLIC_SITE_URL is configured, so
 * neither localhost nor a temporary address is ever published. Every page
 * exists in every published language, so all of them are listed, plus
 * x-default (Albanian, the default language).
 */
export function canonicalFields(path: string, origin: URL | null = siteConfig.canonicalUrl, page?: PageRef) {
  if (!origin) return { alternates: undefined, url: undefined };
  const url = new URL(path, origin).href;
  const languages = page
    ? Object.fromEntries([
        ...locales.map((locale) => [localeMeta[locale].htmlLang, new URL(pagePath(locale, page), origin).href]),
        ["x-default", new URL(pagePath(defaultLocale, page), origin).href],
      ])
    : undefined;
  return { alternates: { canonical: url, ...(languages ? { languages } : {}) }, url };
}

/**
 * Title, description, canonical URL and social preview metadata for a page.
 * `path` is the canonical path, without query parameters (pre-fill, filter
 * or estimate parameters never create separate indexable URLs). With `page`,
 * the other languages' versions are listed as hreflang alternates.
 */
export function seoMetadata(
  { title, description, path, page, locale = defaultLocale }: {
    title: string;
    description: string;
    path: string;
    page?: PageRef;
    locale?: Locale;
  },
  origin: URL | null = siteConfig.canonicalUrl,
): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;
  const canonical = canonicalFields(path, origin, page);
  return {
    title,
    description,
    ...(canonical.alternates ? { alternates: canonical.alternates } : {}),
    openGraph: {
      ...baseOpenGraph(locale),
      title: socialTitle,
      description,
      ...(canonical.url ? { url: canonical.url } : {}),
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [socialImage(locale)] },
  };
}

/** Metadata for a page with copy in the dictionary's `pages` section. */
export function pageMetadata(
  key: Exclude<RouteKey, "home">,
  origin: URL | null = siteConfig.canonicalUrl,
  locale: Locale = defaultLocale,
): Metadata {
  const { title, description } = getDictionary(locale).pages[key];
  return seoMetadata({ title, description, path: pagePath(locale, { key }), page: { key }, locale }, origin);
}

/** Metadata for the home page: the layout's default title, plus canonical and social fields. */
export function homeMetadata(origin: URL | null = siteConfig.canonicalUrl, locale: Locale = defaultLocale): Metadata {
  const { meta } = getDictionary(locale);
  const canonical = canonicalFields(pagePath(locale, { key: "home" }), origin, { key: "home" });
  return {
    ...(canonical.alternates ? { alternates: canonical.alternates } : {}),
    openGraph: {
      ...baseOpenGraph(locale),
      title: meta.defaultTitle,
      description: meta.description,
      ...(canonical.url ? { url: canonical.url } : {}),
    },
  };
}

/** Site-wide defaults for a language (root layout): title template, description, social fields. */
export function siteMetadata(locale: Locale, indexable: boolean): Metadata {
  const { meta } = getDictionary(locale);
  return {
    metadataBase: siteConfig.url,
    title: {
      default: meta.defaultTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: meta.description,
    applicationName: siteConfig.name,
    openGraph: {
      ...baseOpenGraph(locale),
      title: meta.defaultTitle,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
    },
    // Vercel preview deployments stay out of search results (see also robots.ts).
    ...(indexable ? {} : { robots: { index: false, follow: false } }),
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
  };
}
