import type { Metadata } from "next";
import { bodyClassName, SiteShell } from "@/components/layout/site-shell";
import { NotFoundContent } from "@/components/sections/not-found-content";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { defaultLocale, localeMeta } from "@/i18n/config";
import { metadata as rootMetadata, viewport as rootViewport } from "./[lang]/layout";
import { htmlClassName } from "./fonts";
import "./globals.css";

/**
 * The 404 page for every URL without a page (src/proxy.ts sends them here).
 *
 * The root layout lives in app/[lang], so Next.js serves unmatched URLs from
 * this complete document instead of a layout + not-found.tsx; a notFound()
 * thrown inside the prerendered app would only produce a client-rendered error
 * shell. It renders the same frame and content as the rest of the site.
 */
const dict = getDictionary(defaultLocale);

export const metadata: Metadata = {
  ...rootMetadata,
  title: `${dict.notFound.title} | ${siteConfig.name}`,
  robots: { index: false },
};

export const viewport = rootViewport;

export default function GlobalNotFound() {
  return (
    <html lang={localeMeta[defaultLocale].htmlLang} className={htmlClassName}>
      <body className={bodyClassName}>
        <SiteShell dict={dict}>
          <NotFoundContent copy={dict.notFound} />
        </SiteShell>
      </body>
    </html>
  );
}
