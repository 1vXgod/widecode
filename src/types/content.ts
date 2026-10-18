import type { RouteKey } from "@/config/routes";

export interface PageCopy {
  title: string;
  description: string;
}

/** Shape every locale dictionary must satisfy (src/content/<locale>). */
export interface Dictionary {
  meta: {
    defaultTitle: string;
    description: string;
  };
  a11y: {
    skipToContent: string;
    mainNavLabel: string;
    footerNavLabel: string;
    openMenu: string;
    closeMenu: string;
    menuTitle: string;
    homeLinkLabel: string;
  };
  /** Short labels used in navigation. */
  nav: Record<RouteKey, string>;
  /** Titles and meta descriptions for each page except home. */
  pages: Record<Exclude<RouteKey, "home">, PageCopy>;
  header: {
    cta: string;
  };
  footer: {
    tagline: string;
    navHeading: string;
    contactHeading: string;
    contactText: string;
    contactLink: string;
    rights: string;
  };
  home: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    note: string;
  };
  placeholder: {
    badge: string;
    text: string;
    backHome: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    text: string;
    backHome: string;
  };
}
