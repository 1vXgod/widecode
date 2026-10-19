import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LocaleViews } from "@/components/layout/locale-views";
import { bodyClassName, SiteShell } from "@/components/layout/site-shell";
import { NotFoundContent } from "@/components/sections/not-found-content";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { defaultLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { siteMetadata } from "@/lib/metadata";
import { isIndexable } from "@/lib/seo";
import { htmlClassName } from "./fonts";
import "./globals.css";

/**
 * The 404 page for every URL without a page (src/proxy.ts sends them here).
 *
 * The root layout lives in app/[lang], so Next.js serves unmatched URLs from
 * this complete document instead of a layout + not-found.tsx; a notFound()
 * thrown inside the prerendered app would only produce a client-rendered error
 * shell. With Cache Components it is prerendered once for all URLs, so it
 * contains the page in every language and shows the one matching the URL
 * (LocaleViews). The HTML (and the version without JavaScript) is Albanian.
 */
const title = (locale: Locale) => `${getDictionary(locale).notFound.title} | ${siteConfig.name}`;

export const metadata: Metadata = {
  ...siteMetadata(defaultLocale, isIndexable()),
  // No title here: LocaleViews renders it, so it follows the shown language.
  title: null,
  robots: { index: false },
};

export { viewport } from "./[lang]/layout";

export default function GlobalNotFound() {
  const views = Object.fromEntries(
    locales.map((locale) => {
      const dict = getDictionary(locale);
      return [
        locale,
        <SiteShell key={locale} dict={dict}>
          <NotFoundContent copy={dict.notFound} />
        </SiteShell>,
      ];
    }),
  ) as Record<Locale, ReactNode>;
  const titles = Object.fromEntries(locales.map((locale) => [locale, title(locale)])) as Record<Locale, string>;

  return (
    <html lang={localeMeta[defaultLocale].htmlLang} className={htmlClassName}>
      <body className={bodyClassName}>
        <LocaleViews views={views} titles={titles} />
      </body>
    </html>
  );
}
