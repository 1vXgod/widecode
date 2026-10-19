import type { Dictionary } from "@/types/content";

export const estimator = {
  intro: {
    eyebrow: "Preisrechner",
    title: "Berechnen Sie den Preis Ihres Projekts",
    lead: "Wählen Sie die Projektart und die Funktionen, die Sie benötigen. Die unverbindliche Schätzung wird sofort aktualisiert.",
  },
  formLabel: "Preisrechner",
  steps: {
    package: "Projektart",
    pages: "Anzahl der Seiten",
    addOns: "Zusatzfunktionen",
  },
  pagesHelp: "Im Paket sind {count} Seiten enthalten. Jede weitere Seite: {price}.",
  pagesFixed: "Starter ist eine Onepager-Website. Für mehr Seiten wählen Sie Business oder Professional.",
  pagesNotApplicable: "Bei dieser Projektart wird die Seitenzahl im Rahmen der Anforderungsanalyse festgelegt.",
  pagesInputLabel: "Anzahl der Seiten",
  decreasePages: "Seitenzahl verringern",
  increasePages: "Seitenzahl erhöhen",
  addOnsNone: "Die Funktionen für dieses Projekt legen wir gemeinsam in der Analyse fest.",
  addOnState: {
    included: "Inklusive",
    price: "+{price}",
  },
  addOns: {
    multilingual: {
      label: "Zweisprachige Website",
      description: "Inhalte in zwei Sprachen, zum Beispiel Deutsch und Englisch.",
    },
    blog: {
      label: "Blog / News",
      description: "Ein Bereich für Artikel, Neuigkeiten oder Ankündigungen.",
    },
    booking: {
      label: "Buchungen oder Termine",
      description: "Ein Formular für Reservierungen oder Terminanfragen.",
    },
    analytics: {
      label: "Webanalyse",
      description: "Statistiken über Besucher und die Nutzung der Website.",
    },
    payments: {
      label: "Onlinezahlungen",
      description:
        "Kartenzahlungen im Onlineshop. Transaktionsgebühren des Zahlungsanbieters sind nicht enthalten.",
    },
  },
  summary: {
    title: "Ihre Schätzung",
    base: "Paket {name}",
    extraPages: "{count} zusätzliche Seiten × {price}",
    total: "Unverbindliche Schätzung",
    quoteOnly: "Auf Anfrage",
    quoteOnlyText:
      "Für Individualentwicklungen nennen wir keinen Preis im Voraus. Wir erstellen ein Angebot, sobald wir Ihre Anforderungen analysiert haben.",
    disclaimer:
      "Dies ist eine unverbindliche Schätzung für Standardumsetzungen, kein Festpreisangebot. Komplexe Anforderungen können ein separates Angebot erfordern. Den Preis bestätigen wir erst, nachdem wir die Anforderungen Ihres Projekts geprüft haben.",
    thirdParty:
      "Kosten Dritter, etwa Transaktionsgebühren von Zahlungsanbietern oder Abonnements externer Dienste, sind im Preis nicht enthalten.",
    cta: "Angebot mit dieser Schätzung anfordern",
    quoteCta: "Angebot anfordern",
    reset: "Neu beginnen",
    announce: "Unverbindliche Schätzung aktualisiert: {total}",
    announceQuote: "Für dieses Projekt erstellen wir ein Angebot, nachdem wir die Anforderungen analysiert haben.",
  },
} satisfies Dictionary["estimator"];
