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

const cta = "Angebot anfordern";

/**
 * German copy. Same structure and facts as the Albanian original (src/content/sq).
 * Visitors are addressed with "Sie". Terms used consistently: Angebot (quote),
 * Einstiegspreis / ab (starting price), unverbindliche Schätzung (indicative
 * estimate), Preisrechner, Zusatzfunktionen (add-ons), Visitenkarten-Website,
 * Unternehmenswebsite, Onlineshop, Individualentwicklung, Website-Konzept.
 * Package names (Starter, Business, …) stay as they are in every language.
 */
export const de = {
  locale: "de",
  meta: {
    defaultTitle: "Websites und Onlineshops nach Maß aus dem Kosovo | WideCode",
    description:
      "WideCode entwickelt Websites und Onlineshops nach Maß für Unternehmen im Kosovo und darüber hinaus – modern, für jedes Gerät und mit transparenten Einstiegspreisen.",
    country: "Kosovo",
    ogImage: {
      headline: "Websites und Onlineshops nach Maß",
      subline: "Webentwicklung aus dem Kosovo · Transparente Einstiegspreise",
      alt: "WideCode: Websites und Onlineshops nach Maß, Webentwicklung aus dem Kosovo",
    },
  },
  a11y: {
    skipToContent: "Zum Hauptinhalt springen",
    mainNavLabel: "Hauptnavigation",
    footerNavLabel: "Fußzeilennavigation",
    socialNavLabel: "Soziale Medien",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    menuTitle: "Menü",
    homeLinkLabel: "WideCode – Startseite",
    opensInNewTab: "(öffnet in einem neuen Tab)",
    language: "Sprache",
    languageButton: "Sprache wechseln (aktuell: {language})",
    backToTop: "Zurück nach oben",
    themeToLight: "Zum hellen Design wechseln",
    themeToDark: "Zum dunklen Design wechseln",
  },
  nav: {
    home: "Startseite",
    services: "Leistungen",
    projects: "Projekte",
    pricing: "Preise",
    estimator: "Preisrechner",
    about: "Über uns",
    faq: "FAQ",
    contact: "Kontakt",
  },
  /**
   * Search titles (shown with " | WideCode") and meta descriptions. Only used in
   * metadata, not on the pages. Same rules as the Albanian ones: short, unique,
   * one natural search phrase each.
   */
  pages: {
    services: {
      title: "Websites, Onlineshops und Webanwendungen nach Maß",
      description:
        "Visitenkarten-Websites, Unternehmenswebsites, Onlineshops und Individualentwicklung. Sehen Sie, was jede Leistung umfasst und ab welchem Preis.",
    },
    projects: {
      title: "Projekte: Konzepte für Websites und Onlineshops",
      description:
        "Website-Konzepte von WideCode für Restaurants, Praxen, Shops, Fotografen und Fitnessstudios – sie zeigen das Design und die Funktionen, die wir umsetzen.",
    },
    pricing: {
      title: "Preise für Websites und Onlineshops",
      description:
        "Pakete mit transparenten Einstiegspreisen in Euro für Websites und Onlineshops: Starter, Business, Professional, E-commerce und Custom auf Anfrage.",
    },
    estimator: {
      title: "Preisrechner für Websites und Onlineshops",
      description:
        "Wählen Sie Paket, Seitenzahl und Zusatzfunktionen und sehen Sie sofort eine unverbindliche Schätzung für Ihr Projekt.",
    },
    about: {
      title: "Über uns: Webentwicklung nach Maß aus dem Kosovo",
      description:
        "Lernen Sie WideCode kennen: unsere Mission, unsere Werte und wie wir Websites, Onlineshops und Webanwendungen nach Maß für Unternehmen entwickeln.",
    },
    faq: {
      title: "FAQ: Preise, Ablauf und Ihre Website",
      description:
        "Antworten auf die häufigsten Fragen zu Preisen, Ablauf, Zeitrahmen und den Funktionen Ihrer Website oder Ihres Onlineshops.",
    },
    contact: {
      title: "Angebot für Website oder Onlineshop anfordern",
      description:
        "Angebot für Website, Onlineshop oder Individualentwicklung anfordern: Beschreiben Sie Ihr Projekt und erhalten Sie ein klares, unverbindliches Angebot.",
    },
  },
  header: {
    cta,
  },
  contact: {
    labels: {
      email: "E-Mail",
      phone: "Telefon",
      location: "Standort",
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
    tagline: "Websites und Onlineshops nach Maß – mit modernem Design, hoher Performance und klaren Preisen.",
    groups: {
      pages: "Seiten",
      resources: "Mehr",
    },
    contactHeading: "Kontakt",
    contactPending:
      "Unsere Kontaktdaten werden in Kürze veröffentlicht. Bis dahin schreiben Sie uns gerne über die Kontaktseite.",
    contactLink: "Zur Kontaktseite",
    socialHeading: "Folgen Sie uns",
    rights: "Alle Rechte vorbehalten.",
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
    eyebrow: "Fehler 404",
    title: "Seite nicht gefunden",
    text: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    backHome: "Zurück zur Startseite",
  },
  errorPage,
} satisfies Dictionary;
