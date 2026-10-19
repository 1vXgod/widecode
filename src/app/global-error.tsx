"use client";

import { errorPages } from "@/content/error-pages";
import { localeMeta } from "@/i18n/config";
import { localizedRoutes } from "@/i18n/routing";
import { useLocale } from "@/i18n/locale-context";
import "./globals.css";

/**
 * Last-resort error page, used only when the root layout itself fails. It
 * replaces the whole document, so it renders its own <html> and <body>.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  const locale = useLocale();
  const errorPage = errorPages[locale];
  return (
    <html lang={localeMeta[locale].htmlLang} data-scroll-behavior="smooth">
      <body className="grid min-h-dvh place-items-center px-6">
        <title>{errorPage.title}</title>
        <main className="max-w-narrow">
          <h1 className="text-title font-semibold text-fg">{errorPage.title}</h1>
          <p className="mt-5 leading-relaxed text-fg-muted">{errorPage.text}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-11 items-center rounded-full bg-accent px-5 font-medium text-accent-fg hover:bg-accent-hover"
            >
              {errorPage.retry}
            </button>
            {/* A full page load, since the app itself may be what failed. */}
            <a href={localizedRoutes[locale].home} className="inline-flex h-11 items-center rounded-full border border-border-strong px-5 font-medium text-fg">
              {errorPage.backHome}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
