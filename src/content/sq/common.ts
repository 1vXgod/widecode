import type { Dictionary } from "@/types/content";
import { faq } from "./faq";
import { cta as ctaSection, home, processCopy, why } from "./home";
import { pricing } from "./pricing";
import { projects } from "./projects";
import { services } from "./services";

const cta = "Merr një ofertë";

export const sq = {
  meta: {
    defaultTitle: "WideCode — Uebfaqe dhe dyqane online me porosi",
    description:
      "WideCode ndërton uebfaqe profesionale dhe dyqane online me porosi për bizneset në Kosovë, me çmime fillestare transparente dhe dizajn modern për çdo pajisje.",
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
  pages: {
    services: {
      title: "Shërbimet",
      description: "Uebfaqe prezantuese, uebfaqe biznesi, dyqane online dhe platforma me porosi.",
    },
    projects: {
      title: "Projektet",
      description: "Projekte demonstruese që tregojnë qasjen tonë ndaj dizajnit dhe zhvillimit.",
    },
    pricing: {
      title: "Çmimet",
      description: "Paketa me çmime fillestare transparente në euro.",
    },
    estimator: {
      title: "Llogarit çmimin",
      description: "Llogaritni një çmim orientues për projektin tuaj në pak hapa.",
    },
    about: {
      title: "Rreth nesh",
      description: "Kush është WideCode dhe si punojmë.",
    },
    faq: {
      title: "Pyetjet e shpeshta",
      description: "Përgjigje për pyetjet më të shpeshta rreth procesit, afateve dhe çmimeve.",
    },
    contact: {
      title: "Kontakti",
      description: "Na kontaktoni ose kërkoni një ofertë për projektin tuaj.",
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
      "Uebfaqe dhe dyqane online të ndërtuara me porosi — me dizajn modern, performancë të lartë dhe çmime të qarta.",
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
  placeholder: {
    badge: "Në përgatitje",
    text: "Kjo faqe është në përgatitje dhe do të publikohet së shpejti.",
    backHome: "Kthehu në ballinë",
  },
  notFound: {
    eyebrow: "Gabim 404",
    title: "Faqja nuk u gjet",
    text: "Faqja që po kërkoni nuk ekziston ose është zhvendosur.",
    backHome: "Kthehu në ballinë",
  },
} satisfies Dictionary;
