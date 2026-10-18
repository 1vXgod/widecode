import type { Metadata, Viewport } from "next";
import { Geist, Sora } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollReveal } from "@/components/layout/scroll-reveal";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/layout/skip-link";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { localeMeta } from "@/i18n/config";
import { baseOpenGraph } from "@/lib/metadata";
import { isIndexable } from "@/lib/seo";
import "./globals.css";

// Both fonts include the Latin-1 range, which covers Albanian ë and ç.
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const dict = getDictionary(siteConfig.locale);
const locale = localeMeta[siteConfig.locale];

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={locale.htmlLang} className={`${geist.variable} ${sora.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink label={dict.a11y.skipToContent} />
        <SiteHeader dict={dict} />
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter dict={dict} />
        <ScrollReveal />
      </body>
    </html>
  );
}
