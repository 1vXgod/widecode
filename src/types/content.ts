import type { PackageId } from "@/config/pricing";
import type { ProjectCategory, ProjectSlug } from "@/config/projects";
import type { FooterNavGroup, RouteKey } from "@/config/routes";
import type { ContactChannel, SocialPlatform } from "@/lib/contact";

export interface PageCopy {
  title: string;
  description: string;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description: string;
}

export const serviceIds = ["presentation", "business", "ecommerce", "platform"] as const;
export type ServiceId = (typeof serviceIds)[number];

export const reasonIds = ["transparent", "custom", "devices", "communication"] as const;
export type ReasonId = (typeof reasonIds)[number];

export const showcaseStages = ["design", "code", "live"] as const;
export type ShowcaseStage = (typeof showcaseStages)[number];

export interface ShowcaseCopy {
  label: string;
  tabs: Record<ShowcaseStage, string>;
  pause: string;
  play: string;
  url: string;
  mock: {
    brand: string;
    nav: [string, string, string];
    title: string;
    text: string;
    cta: string;
    cards: [string, string, string];
    liveBadge: string;
  };
  wireframe: {
    header: string;
    hero: string;
    cards: string;
  };
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
    tagline: string;
    groups: Record<FooterNavGroup, string>;
    contactHeading: string;
    contactPending: string;
    contactLink: string;
    socialHeading: string;
    rights: string;
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      titleHighlight: string;
      lead: string;
      primaryCta: string;
      secondaryCta: string;
      /** Uses {price}. */
      priceNote: string;
      noObligation: string;
    };
    showcase: ShowcaseCopy;
  };
  services: SectionIntro & {
    items: Record<ServiceId, { title: string; summary: string; points: string[] }>;
    cta: string;
  };
  projects: SectionIntro & {
    demoBadge: string;
    categories: Record<ProjectCategory, string>;
    items: Record<ProjectSlug, { title: string; summary: string; tags: string[] }>;
    previewLabel: string;
    cta: string;
  };
  pricing: SectionIntro & {
    from: string;
    customPrice: string;
    recommended: string;
    packageCta: string;
    customCta: string;
    viewAll: string;
    disclaimer: string;
    packages: Record<PackageId, { name: string; summary: string; features: string[] }>;
  };
  process: SectionIntro & {
    steps: Array<{ title: string; text: string }>;
  };
  why: SectionIntro & {
    items: Record<ReasonId, { title: string; text: string }>;
  };
  faq: SectionIntro & {
    /** Answers may use {price}. */
    items: Array<{ question: string; answer: string }>;
    viewAll: string;
  };
  cta: {
    title: string;
    text: string;
    primary: string;
    secondary: string;
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
