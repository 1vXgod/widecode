import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { bodyClassName, SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { isLocale, localeMeta, locales } from "@/i18n/config";
import { baseOpenGraph } from "@/lib/metadata";
import { isIndexable } from "@/lib/seo";
import { htmlClassName } from "../fonts";
import "../globals.css";

// Site-wide defaults (title template, description, social fields). Albanian
// until localized metadata arrives with the other languages.
const dict = getDictionary(siteConfig.locale);

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: dict.meta.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: dict.meta.description,
  applicationName: siteConfig.name,
  openGraph: {
    ...baseOpenGraph(),
    title: dict.meta.defaultTitle,
    description: dict.meta.description,
  },
  twitter: {
    card: "summary_large_image",
  },
  // Vercel preview deployments stay out of search results (see also robots.ts).
  ...(isIndexable() ? {} : { robots: { index: false, follow: false } }),
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "dark",
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
      <body className={bodyClassName}>
        <SiteShell dict={getDictionary(lang)}>{children}</SiteShell>
      </body>
    </html>
  );
}
