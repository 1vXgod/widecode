import type { ReactNode } from "react";
import { LocaleProvider } from "@/i18n/locale-context";
import type { Dictionary } from "@/types/content";
import { ScrollReveal } from "./scroll-reveal";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { MAIN_CONTENT_ID, SkipLink } from "./skip-link";

/** Classes for <body> in every document the app renders. */
export const bodyClassName = "flex min-h-dvh flex-col";

/**
 * Everything around a page's content: skip link, header, main landmark, footer
 * and the scroll reveal. Shared by the root layout and the global 404 page, so
 * both render exactly the same frame. Provides the content's language to Client
 * Components (links, prices), so they render it identically on server and client.
 */
export function SiteShell({ dict, children }: { dict: Dictionary; children: ReactNode }) {
  return (
    <LocaleProvider locale={dict.locale}>
      <SkipLink label={dict.a11y.skipToContent} />
      <SiteHeader dict={dict} />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter dict={dict} />
      <ScrollReveal />
    </LocaleProvider>
  );
}
