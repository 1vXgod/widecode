import type { Dictionary } from "@/types/content";

export const pricingPage = {
  intro: {
    eyebrow: "Preise",
    title: "Pakete mit transparenten Preisen",
    lead: "Wählen Sie den Ausgangspunkt, der zu Ihrem Projekt passt. Alle Preise sind unverbindliche Einstiegspreise; den endgültigen Preis bestätigen wir, sobald wir Ihre Anforderungen geprüft haben.",
    primaryCta: "Preis berechnen",
    secondaryCta: "Angebot anfordern",
  },
  packages: {
    eyebrow: "Pakete",
    title: "Wählen Sie Ihren Ausgangspunkt",
    description:
      "Jedes Paket enthält responsives Design und eine SEO-Grundoptimierung. Bei Bedarf erweitern Sie es um Zusatzfunktionen.",
    estimateCta: "Mit diesem Paket berechnen",
  },
  addOns: {
    eyebrow: "Zusatzfunktionen",
    title: "Zusätzliche Funktionen",
    description:
      "Richtpreise für Standardumsetzungen von Funktionen, die Sie Ihrem Projekt hinzufügen können. Der Preisrechner verwendet dieselben Preise.",
    extraPage: "Zusätzliche Seite",
    extraPageNote: "Für Seiten über die im Paket enthaltene Anzahl hinaus",
    includedPages: "{name}: {count} Seiten",
    perPage: "{price} / Seite",
    includedIn: "Enthalten in {packages}",
    availableFor: "Für {packages}",
  },
  factors: {
    eyebrow: "So entsteht der Preis",
    title: "Was den endgültigen Preis beeinflusst",
    description: "Die Paketpreise sind Ausgangspunkte. Das endgültige Angebot richtet sich nach diesen Faktoren.",
    items: {
      scope: {
        title: "Projektumfang",
        text: "Wie viele Seiten und Abschnitte benötigt werden und wie umfassend die Lösung ist.",
      },
      features: {
        title: "Funktionen",
        text: "Buchungen, Onlinezahlungen, mehrere Sprachen oder individuelle Funktionen.",
      },
      content: {
        title: "Inhalte",
        text: "Ob Texte und Fotos bereits vorliegen oder noch erstellt werden müssen.",
      },
      integrations: {
        title: "Schnittstellen",
        text: "Anbindungen an externe Systeme, etwa an Zahlungsanbieter oder an die Software, die Sie nutzen.",
      },
      complexity: {
        title: "Komplexität",
        text: "Besondere Anforderungen an das Design und an Ihre Geschäftslogik.",
      },
    },
  },
  estimatorCta: {
    title: "Nicht sicher, welches Paket passt?",
    text: "Nutzen Sie den Preisrechner für eine unverbindliche Schätzung in wenigen Schritten.",
    cta: "Preisrechner öffnen",
  },
} satisfies Dictionary["pricingPage"];
