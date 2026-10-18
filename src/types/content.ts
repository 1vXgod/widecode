import type { FooterNavGroup, RouteKey } from "@/config/routes";
import type { ContactChannel, SocialPlatform } from "@/lib/contact";

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
    socialNavLabel: string;
    openMenu: string;
    closeMenu: string;
    menuTitle: string;
    homeLinkLabel: string;
    opensInNewTab: string;
  };
  /** Short labels used in navigation. */
  nav: Record<RouteKey, string>;
  /** Titles and meta descriptions for each page except home. */
  pages: Record<Exclude<RouteKey, "home">, PageCopy>;
  header: {
    cta: string;
  };
  contact: {
    /** Screen-reader labels for each contact channel. */
    labels: Record<ContactChannel["type"], string>;
  };
  social: Record<SocialPlatform, string>;
  footer: {
    ctaTitle: string;
    ctaText: string;
    tagline: string;
    groups: Record<FooterNavGroup, string>;
    contactHeading: string;
    contactPending: string;
    contactLink: string;
    socialHeading: string;
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
