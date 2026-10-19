import type { Dictionary } from "@/types/content";

export const projectsPage = {
  intro: {
    eyebrow: "Projekte",
    title: "Website-Konzepte",
    lead: "Konzepte von WideCode für verschiedene Branchen. Jedes zeigt den Stil, die Qualität und die Funktionen, die wir für Sie umsetzen können.",
    primaryCta: "Angebot anfordern",
    secondaryCta: "Preis berechnen",
  },
  filter: {
    label: "Projekte nach Kategorie filtern",
    all: "Alle",
    resultsOne: "{count} Projekt wird angezeigt",
    resultsMany: "{count} Projekte werden angezeigt",
    empty: "In dieser Kategorie gibt es keine Projekte.",
  },
  cardCta: "Projekt ansehen",
  detail: {
    back: "Alle Projekte",
    conceptTitle: "Das Konzept",
    goalsTitle: "Ziele des Konzepts",
    featuresTitle: "Funktionen",
    sectionsTitle: "Seiten und Abschnitte",
    serviceLabel: "Leistung",
    packageLabel: "Passendes Paket",
    ctaTitle: "Sie möchten etwas Ähnliches?",
    ctaText: "Erzählen Sie uns von Ihrem Projekt, und wir erstellen Ihnen ein unverbindliches Angebot.",
    quoteCta: "Angebot für ein ähnliches Projekt anfordern",
    estimateCta: "Preis berechnen",
    relatedTitle: "Weitere Konzepte",
    metaTitle: "{title} – Website-Konzept",
    metaDescription: "{summary} Ein Website-Konzept von WideCode.",
  },
} satisfies Dictionary["projectsPage"];
