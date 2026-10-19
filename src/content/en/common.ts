import type { Dictionary } from "@/types/content";
import { aboutPage } from "./about-page";
import { contactPage } from "./contact-page";
import { errorPage } from "./error-page";
import { estimator } from "./estimator";
import { faq } from "./faq";
import { faqPage } from "./faq-page";
import { cta as ctaSection, home, processCopy, why } from "./home";
import { pricing } from "./pricing";
import { pricingPage } from "./pricing-page";
import { projects } from "./projects";
import { projectsPage } from "./projects-page";
import { services } from "./services";
import { servicesPage } from "./services-page";

const cta = "Get a quote";

/** English copy. Same structure and facts as the Albanian original (src/content/sq). */
export const en = {
  locale: "en",
  meta: {
    defaultTitle: "Custom websites and online shops from Kosovo | WideCode",
    description:
      "WideCode builds custom websites and online shops for businesses in Kosovo and beyond, with modern design for every device and transparent starting prices.",
    country: "Kosovo",
    ogImage: {
      headline: "Custom websites and online shops",
      subline: "Web development from Kosovo · Transparent starting prices",
      alt: "WideCode: custom websites and online shops, web development from Kosovo",
    },
  },
  a11y: {
    skipToContent: "Skip to main content",
    mainNavLabel: "Main navigation",
    footerNavLabel: "Footer navigation",
    socialNavLabel: "Social media",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Menu",
    homeLinkLabel: "WideCode — home",
    opensInNewTab: "(opens in a new tab)",
    language: "Language",
    languageButton: "Change language (current: {language})",
  },
  nav: {
    home: "Home",
    services: "Services",
    projects: "Projects",
    pricing: "Pricing",
    estimator: "Price calculator",
    about: "About us",
    faq: "FAQ",
    contact: "Contact",
  },
  /**
   * Search titles (shown with " | WideCode") and meta descriptions. Only used in
   * metadata, not on the pages. Same rules as the Albanian ones: short, unique,
   * one natural search phrase each.
   */
  pages: {
    services: {
      title: "Custom websites, online shops and web applications",
      description:
        "Presentation websites, business websites, online shops and custom development. See what each service includes and its starting price.",
    },
    projects: {
      title: "Projects: website and online shop concepts",
      description:
        "Website concepts by WideCode for restaurants, clinics, shops, photographers and gyms, showing the design and features we build.",
    },
    pricing: {
      title: "Website and online shop pricing",
      description:
        "Packages with transparent starting prices in euros for websites and online shops: Starter, Business, Professional, E-commerce and Custom on request.",
    },
    estimator: {
      title: "Website and online shop price calculator",
      description:
        "Choose a package, the number of pages and extra features, and instantly see an indicative estimate for your project, with no obligation.",
    },
    about: {
      title: "About us: custom web development from Kosovo",
      description:
        "Get to know WideCode: our mission, our values and how we build custom websites, online shops and web applications for businesses.",
    },
    faq: {
      title: "FAQ: pricing, process and your website",
      description:
        "Answers to the most common questions about pricing, our process, timelines and the features of your website or online shop.",
    },
    contact: {
      title: "Request a quote for a website or online shop",
      description:
        "Request a quote for a website, an online shop or custom development. Tell us about your project and we will send you a clear quote, with no obligation.",
    },
  },
  header: {
    cta,
  },
  contact: {
    labels: {
      email: "Email",
      phone: "Phone",
      location: "Location",
    },
  },
  social: {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    github: "GitHub",
    tiktok: "TikTok",
    x: "X",
  },
  footer: {
    tagline: "Custom websites and online shops — with modern design, high performance and clear pricing.",
    groups: {
      pages: "Pages",
      resources: "More",
    },
    contactHeading: "Contact",
    contactPending: "Our contact details will be published soon. Until then, please write to us through the contact page.",
    contactLink: "Go to the contact page",
    socialHeading: "Follow us",
    rights: "All rights reserved.",
  },
  home,
  services,
  projects,
  pricing,
  process: processCopy,
  why,
  faq,
  cta: ctaSection,
  servicesPage,
  aboutPage,
  pricingPage,
  estimator,
  projectsPage,
  faqPage,
  contactPage,
  notFound: {
    eyebrow: "Error 404",
    title: "Page not found",
    text: "The page you are looking for does not exist or has been moved.",
    backHome: "Back to the home page",
  },
  errorPage,
} satisfies Dictionary;
