import type { Dictionary } from "@/types/content";

export const projectsPage = {
  intro: {
    eyebrow: "Projektet",
    title: "Projekte demonstruese",
    lead: "Shembuj të krijuar nga WideCode për të treguar si mund të duket dhe të funksionojë projekti juaj, nga një website prezantues deri te një web aplikacion.",
    primaryCta: "Merr një ofertë",
    secondaryCta: "Llogarit çmimin",
  },
  notice: {
    title: "Pse projekte demonstruese?",
    text: "Këto projekte janë koncepte të krijuara nga WideCode, jo punë për klientë realë. Ato tregojnë stilin, cilësinë dhe funksionalitetet që mund t'i ndërtojmë për biznesin tuaj.",
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
    banner: "Projekt demonstrues: koncept i krijuar nga WideCode, jo punë për klient real.",
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
    relatedTitle: "Projekte të tjera",
    metaTitle: "{title} (projekt demonstrues)",
    metaDescription: "{summary} Projekt demonstrues i krijuar nga WideCode.",
  },
} satisfies Dictionary["projectsPage"];
