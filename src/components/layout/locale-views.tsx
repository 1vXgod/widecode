"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { defaultLocale, localeMeta, type Locale } from "@/i18n/config";
import { localeFromPublicPath } from "@/i18n/routing";

const subscribeNothing = () => () => undefined;

/**
 * Shows the version of a static page that matches the language in the URL.
 *
 * For documents that are prerendered once for every URL (the global 404 page):
 * the server HTML is the default language, and React hydrates that same version
 * (getServerSnapshot), then switches to the URL's language right after, so
 * hydration always matches. Without JavaScript, the default language is shown.
 */
export function LocaleViews({ views, titles }: { views: Record<Locale, ReactNode>; titles: Record<Locale, string> }) {
  const locale = useSyncExternalStore(
    subscribeNothing,
    () => localeFromPublicPath(window.location.pathname),
    () => defaultLocale,
  );

  // <html> belongs to the static document around this view, so its language is set here.
  useEffect(() => {
    document.documentElement.lang = localeMeta[locale].htmlLang;
  }, [locale]);

  // React 19 places <title> in <head> and keeps it in sync with the shown version.
  return (
    <>
      <title>{titles[locale]}</title>
      {views[locale]}
    </>
  );
}
