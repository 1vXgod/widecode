import type { Metadata } from "next";
import { headers } from "next/headers";
import { bodyClassName, SiteShell } from "@/components/layout/site-shell";
import { NotFoundContent } from "@/components/sections/not-found-content";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { defaultLocale, isLocale, localeMeta, type Locale } from "@/i18n/config";
import { NOT_FOUND_LOCALE_HEADER } from "@/i18n/routing";
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
 * shell. It has no route params, so the proxy passes the URL's language in a
 * request header, and the page is rendered on the server for each request
 * (`instant = false`: a blocking route, not prerendered): complete HTML in the
 * URL's language with its own <html lang>, also without JavaScript.
 */
export const instant = false;

async function requestLocale(): Promise<Locale> {
  const value = (await headers()).get(NOT_FOUND_LOCALE_HEADER);
  return isLocale(value) ? value : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return {
    ...siteMetadata(locale, isIndexable()),
    // There is no layout here to apply the title template.
    title: { absolute: `${getDictionary(locale).notFound.title} | ${siteConfig.name}` },
    robots: { index: false },
  };
}

export { viewport } from "./[lang]/layout";

export default async function GlobalNotFound() {
  const locale = await requestLocale();
  const dict = getDictionary(locale);
  return (
    <html lang={localeMeta[locale].htmlLang} className={htmlClassName}>
      <body className={bodyClassName}>
        <SiteShell dict={dict}>
          <NotFoundContent copy={dict.notFound} />
        </SiteShell>
      </body>
    </html>
  );
}
