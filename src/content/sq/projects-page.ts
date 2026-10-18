import type { Dictionary } from "@/types/content";

export const projectsPage = {
  intro: {
    eyebrow: "Projektet",
    title: "Koncepte website",
    lead: "Koncepte të dizajnuara nga WideCode për biznese të ndryshme. Secili tregon stilin, cilësinë dhe funksionalitetet që mund t'i ndërtojmë për ju.",
    primaryCta: "Merr një ofertë",
    secondaryCta: "Llogarit çmimin",
  },
  filter: {
    label: "Filtro projektet sipas kategorisë",
    all: "Të gjitha",
    resultsOne: "Po shfaqet {count} projekt",
    resultsMany: "Po shfaqen {count} projekte",
    empty: "Nuk ka projekte në këtë kategori.",
  },
  cardCta: "Shiko projektin",
  detail: {
    back: "Të gjitha projektet",
    conceptTitle: "Koncepti",
    goalsTitle: "Qëllimet e konceptit",
    featuresTitle: "Funksionalitetet",
    sectionsTitle: "Faqet dhe seksionet",
    serviceLabel: "Shërbimi",
    packageLabel: "Paketa përkatëse",
    ctaTitle: "Doni diçka të ngjashme?",
    ctaText: "Na tregoni për projektin tuaj dhe ju përgatisim një ofertë pa obligim.",
    quoteCta: "Merr ofertë për një projekt të ngjashëm",
    estimateCta: "Llogarit çmimin",
    relatedTitle: "Koncepte të tjera",
    metaTitle: "{title} – koncept website",
    metaDescription: "{summary} Koncept website nga WideCode.",
  },
} satisfies Dictionary["projectsPage"];
