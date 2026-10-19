"use client";

import { errorPage } from "@/content/sq/error-page";
import "./globals.css";

/**
 * Last-resort error page, used only when the root layout itself fails. It
 * replaces the whole document, so it renders its own <html> and <body>.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="sq">
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
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="inline-flex h-11 items-center rounded-full border border-border-strong px-5 font-medium text-fg">
              {errorPage.backHome}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
