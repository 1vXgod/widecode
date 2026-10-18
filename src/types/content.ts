import type { AddOnId } from "@/config/estimator";
import type { PackageId } from "@/config/pricing";
import type { ProjectCategory, ProjectSlug } from "@/config/projects";
import type { BudgetId, ProjectTypeId, TimelineId } from "@/config/quote";
import type { ServiceId } from "@/config/services";
import type { FooterNavGroup, RouteKey } from "@/config/routes";
import type { ContactChannel, SocialPlatform } from "@/lib/contact";
import type { QuoteField, QuoteFieldError } from "@/lib/quote-request";

export interface PageCopy {
  title: string;
  description: string;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description: string;
}

/** Intro block at the top of inner pages. */
export interface PageIntroCopy {
  eyebrow: string;
  title: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
}

export const standardIds = ["responsive", "seo", "performance", "accessibility", "security", "custom"] as const;
export type StandardId = (typeof standardIds)[number];

export const valueIds = ["transparency", "quality", "custom", "communication", "honesty", "partnership"] as const;
export type ValueId = (typeof valueIds)[number];

export const priceFactorIds = ["scope", "features", "content", "integrations", "complexity"] as const;
export type PriceFactorId = (typeof priceFactorIds)[number];

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
    /** Small label on cards and detail pages, e.g. "Koncept website". */
    conceptLabel: string;
    categories: Record<ProjectCategory, string>;
    items: Record<
      ProjectSlug,
      {
        title: string;
        summary: string;
        tags: string[];
        /** What the demo concept explores (never presented as client work). */
        concept: string;
        /** What the concept is designed to achieve; aims, not results. */
        goals: string[];
        features: string[];
        /** Pages or sections of the concept. */
        sections: string[];
      }
    >;
    /** Accessible descriptions of the previews; use {title}. */
    desktopPreviewLabel: string;
    mobilePreviewLabel: string;
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
  servicesPage: {
    intro: PageIntroCopy;
    onThisPage: string;
    idealForLabel: string;
    includesLabel: string;
    packagesLabel: string;
    /** Visible label of each package's quote link; its accessible name adds the package name. */
    quoteCta: string;
    details: Record<ServiceId, { description: string; idealFor: string[]; includes: string[] }>;
    standards: SectionIntro & {
      items: Record<StandardId, { title: string; text: string }>;
    };
    process: {
      title: string;
      text: string;
      cta: string;
    };
  };
  aboutPage: {
    intro: PageIntroCopy;
    mission: {
      eyebrow: string;
      title: string;
      paragraphs: string[];
      statement: string;
    };
    values: SectionIntro & {
      items: Record<ValueId, { title: string; text: string }>;
    };
    services: SectionIntro & {
      cta: string;
    };
    market: {
      title: string;
      text: string;
    };
  };
  pricingPage: {
    intro: PageIntroCopy;
    packages: SectionIntro & {
      /** Secondary link on each package card, opening the estimator with it preselected. */
      estimateCta: string;
    };
    addOns: SectionIntro & {
      extraPage: string;
      extraPageNote: string;
      /** Uses {name} and {count}. */
      includedPages: string;
      /** Uses {price}. */
      perPage: string;
      /** Uses {packages}. */
      includedIn: string;
      /** Uses {packages}. */
      availableFor: string;
    };
    factors: SectionIntro & {
      items: Record<PriceFactorId, { title: string; text: string }>;
    };
    estimatorCta: {
      title: string;
      text: string;
      cta: string;
    };
  };
  estimator: {
    intro: {
      eyebrow: string;
      title: string;
      lead: string;
    };
    formLabel: string;
    steps: {
      package: string;
      pages: string;
      addOns: string;
    };
    /** Uses {count} and {price}. */
    pagesHelp: string;
    pagesFixed: string;
    pagesNotApplicable: string;
    pagesInputLabel: string;
    decreasePages: string;
    increasePages: string;
    addOnsNone: string;
    addOnState: {
      included: string;
      /** Uses {price}. */
      price: string;
    };
    addOns: Record<AddOnId, { label: string; description: string }>;
    summary: {
      title: string;
      /** Uses {name}. */
      base: string;
      /** Uses {count} and {price}. */
      extraPages: string;
      total: string;
      quoteOnly: string;
      quoteOnlyText: string;
      disclaimer: string;
      /** Third-party costs (payment fees, subscriptions) are never included. */
      thirdParty: string;
      cta: string;
      quoteCta: string;
      reset: string;
      /** Screen-reader announcement; uses {total}. */
      announce: string;
      announceQuote: string;
    };
  };
  projectsPage: {
    intro: PageIntroCopy;
    filter: {
      label: string;
      all: string;
      /** Uses {count}. */
      resultsOne: string;
      /** Uses {count}. */
      resultsMany: string;
      empty: string;
    };
    cardCta: string;
    detail: {
      back: string;
      conceptTitle: string;
      goalsTitle: string;
      featuresTitle: string;
      sectionsTitle: string;
      serviceLabel: string;
      packageLabel: string;
      ctaTitle: string;
      ctaText: string;
      quoteCta: string;
      estimateCta: string;
      relatedTitle: string;
      /** Uses {title}. */
      metaTitle: string;
      /** Uses {summary}. */
      metaDescription: string;
    };
  };
  contactPage: {
    intro: {
      eyebrow: string;
      title: string;
      lead: string;
    };
    form: {
      label: string;
      requiredNote: string;
      optional: string;
      sections: {
        contact: string;
        project: string;
      };
      fields: Record<QuoteField, { label: string; hint?: string }>;
      selectPlaceholder: string;
      options: {
        projectType: Record<ProjectTypeId, string>;
        /** Package names come from `pricing.packages`; this is the extra "not sure" option. */
        packageUnsure: string;
        budget: Record<BudgetId, string>;
        timeline: Record<TimelineId, string>;
      };
      /** Uses {count} and {max}. */
      characterCount: string;
      prefillNotice: string;
      estimate: {
        title: string;
        text: string;
        edit: string;
        remove: string;
      };
      project: {
        title: string;
        remove: string;
      };
      submit: string;
      submitting: string;
      privacy: string;
      honeypotLabel: string;
    };
    errors: {
      summaryOne: string;
      /** Uses {count}. */
      summaryMany: string;
      /** A message for every error the validator can return for a field (checked by a unit test). */
      fields: Record<QuoteField, Partial<Record<QuoteFieldError, string>>>;
    };
    status: {
      unavailableNotice: { title: string; text: string };
      testNotice: { title: string; text: string };
      invalid: string;
      /** Uses {time}. */
      rateLimited: string;
      minuteOne: string;
      /** Uses {count}. */
      minuteMany: string;
      tooFast: string;
      rejected: string;
      unavailable: string;
      failed: string;
      network: string;
    };
    success: {
      title: string;
      /** Uses {email}. */
      text: string;
      summaryTitle: string;
      again: string;
      projects: string;
    };
    testSuccess: {
      title: string;
      text: string;
    };
    aside: {
      nextTitle: string;
      steps: Array<{ title: string; text: string }>;
      priceTitle: string;
      priceText: string;
      estimatorCta: string;
      pricingCta: string;
      contactTitle: string;
    };
    /** Email sent to WideCode for each request. */
    email: {
      /** Uses {name} and {projectType}. */
      subject: string;
      heading: string;
      intro: string;
      notProvided: string;
      estimateTitle: string;
      estimateTotal: string;
      project: string;
      submittedAt: string;
      reference: string;
      replyHint: string;
    };
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
