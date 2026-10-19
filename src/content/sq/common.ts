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

const cta = "Merr një ofertë";

export const sq = {
  locale: "sq",
  meta: {
    defaultTitle: "Website dhe online shop me porosi në Kosovë | WideCode",
    description:
      "WideCode ndërton website dhe online shop me porosi për bizneset në Kosovë, me dizajn modern për çdo pajisje dhe çmime fillestare transparente.",
    country: "Kosovë",
    ogImage: {
      headline: "Website dhe online shop me porosi",
      subline: "Për bizneset në Kosovë · Çmime fillestare transparente",
      alt: "WideCode: website dhe online shop me porosi për bizneset në Kosovë",
    },
  },
  a11y: {
    skipToContent: "Kalo te përmbajtja kryesore",
    mainNavLabel: "Navigimi kryesor",
    footerNavLabel: "Navigimi në fund të faqes",
    socialNavLabel: "Rrjetet sociale",
    openMenu: "Hap menynë",
    closeMenu: "Mbyll menynë",
    menuTitle: "Menyja",
    homeLinkLabel: "WideCode — ballina",
    opensInNewTab: "(hapet në skedë të re)",
    language: "Gjuha",
    languageButton: "Ndrysho gjuhën (tani: {language})",
    backToTop: "Kthehu në krye",
    themeToLight: "Kalo në temën e çelët",
    themeToDark: "Kalo në temën e errët",
  },
  nav: {
    home: "Ballina",
    services: "Shërbimet",
    projects: "Projektet",
    pricing: "Çmimet",
    estimator: "Llogarit çmimin",
    about: "Rreth nesh",
    faq: "Pyetjet e shpeshta",
    contact: "Kontakti",
  },
  /**
   * Search titles (shown with " | WideCode") and meta descriptions. Only used in
   * metadata, not on the pages. Keep titles short (the full title ≈ 60
   * characters), descriptions ≈ 120–160 characters, every one unique, with one
   * natural search phrase each: no keyword lists.
   */
  pages: {
    services: {
      title: "Website, online shop dhe aplikacione web me porosi",
      description:
        "Website prezantues, website biznesi, online shop dhe Custom Development për bizneset në Kosovë. Shihni çfarë përfshin çdo shërbim dhe çmimet fillestare.",
    },
    projects: {
      title: "Projektet: koncepte website dhe online shop",
      description:
        "Koncepte website nga WideCode për restorante, klinika, dyqane, fotografë dhe palestra, që tregojnë dizajnin dhe funksionalitetet që ndërtojmë.",
    },
    pricing: {
      title: "Çmimet për website dhe online shop në Kosovë",
      description:
        "Paketa me çmime fillestare transparente në euro për website dhe online shop: Starter, Business, Professional, E-commerce dhe Custom me ofertë.",
    },
    estimator: {
      title: "Llogaritësi i çmimit për website dhe online shop",
      description:
        "Zgjidhni paketën, numrin e faqeve dhe funksionalitetet shtesë, dhe shihni menjëherë një vlerësim orientues për projektin tuaj, pa obligim.",
    },
    about: {
      title: "Rreth nesh: website me porosi për bizneset në Kosovë",
      description:
        "Njihuni me WideCode: misioni, vlerat dhe mënyra si ndërtojmë website, online shop dhe aplikacione web me porosi për bizneset në Kosovë.",
    },
    faq: {
      title: "Pyetjet e shpeshta: çmimet, procesi dhe website-i",
      description:
        "Përgjigje për pyetjet më të shpeshta rreth çmimeve, procesit, afateve dhe funksionaliteteve të website-it ose online shop-it tuaj.",
    },
    contact: {
      title: "Kërko ofertë për website ose online shop",
      description:
        "Kërkoni ofertë për website, online shop ose Custom Development. Na tregoni për projektin dhe ju dërgojmë një ofertë të qartë, pa obligim.",
    },
  },
  header: {
    cta,
  },
  contact: {
    labels: {
      email: "Email",
      phone: "Telefoni",
      location: "Vendndodhja",
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
    tagline:
      "Website dhe online shop me porosi — me dizajn modern, performancë të lartë dhe çmime të qarta.",
    groups: {
      pages: "Faqet",
      resources: "Më shumë",
    },
    contactHeading: "Kontakti",
    contactPending: "Të dhënat e kontaktit do të publikohen së shpejti. Deri atëherë, na shkruani përmes faqes së kontaktit.",
    contactLink: "Shko te kontakti",
    socialHeading: "Na ndiqni",
    rights: "Të gjitha të drejtat e rezervuara.",
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
    eyebrow: "Gabim 404",
    title: "Faqja nuk u gjet",
    text: "Faqja që po kërkoni nuk ekziston ose është zhvendosur.",
    backHome: "Kthehu në ballinë",
  },
  errorPage,
} satisfies Dictionary;
