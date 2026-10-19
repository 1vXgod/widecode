"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import { localeFromPublicPath } from "./routing";
import { usePublicPathname } from "./use-public-pathname";

const LocaleContext = createContext<Locale | null>(null);

/**
 * The language of the content inside it, set by the server from the route's
 * [lang] segment (see SiteShell). Client Components read it with useLocale(),
 * so they render the same language during the build's prerender and in the browser.
 */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/**
 * The current content language in Client Components: from LocaleProvider, or
 * (outside one, e.g. in component tests) from the public path.
 */
export function useLocale(): Locale {
  const fromContext = useContext(LocaleContext);
  const pathname = usePublicPathname();
  return fromContext ?? localeFromPublicPath(pathname);
}
