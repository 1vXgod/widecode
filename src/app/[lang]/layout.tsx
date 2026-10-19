import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { bodyClassName, SiteShell } from "@/components/layout/site-shell";
import { ThemeScript } from "@/components/layout/theme-script";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { isLocale, localeMeta, locales } from "@/i18n/config";
import { siteMetadata } from "@/lib/metadata";
import { isIndexable } from "@/lib/seo";
import { htmlClassName } from "../fonts";
import "../globals.css";

/** Site-wide defaults in the page's language (title template, description, social fields). */
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? siteMetadata(lang, isIndexable()) : {};
}

export const viewport: Viewport = {
  // Browser UI color per system setting (an explicit choice on the site itself is applied by CSS).
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor.dark },
  ],
  colorScheme: "dark light",
};

/**
 * One prerendered copy of the site per language. Public URLs never show the
 * segment for Albanian: src/proxy.ts rewrites /sherbimet to /sq/sherbimet.
 */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  // The proxy only ever routes to supported languages; anything else is not a page.
  if (!isLocale(lang)) notFound();

  return (
    <html lang={localeMeta[lang].htmlLang} className={htmlClassName}>
      <head>
        <ThemeScript />
      </head>
      <body className={bodyClassName}>
        <SiteShell dict={getDictionary(lang)}>{children}</SiteShell>
      </body>
    </html>
  );
}
