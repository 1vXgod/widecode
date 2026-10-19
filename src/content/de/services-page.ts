import type { Dictionary } from "@/types/content";

export const servicesPage = {
  intro: {
    eyebrow: "Leistungen",
    title: "Websites und digitale Lösungen nach Maß",
    lead: "Wir entwickeln Visitenkarten- und Unternehmenswebsites, Onlineshops und individuelle Webanwendungen für Unternehmen im Kosovo und darüber hinaus. Jedes Projekt geht von Ihren Anforderungen aus und wird von Grund auf neu entwickelt.",
    primaryCta: "Angebot anfordern",
    secondaryCta: "Preise ansehen",
  },
  onThisPage: "Auf dieser Seite",
  idealForLabel: "Ideal für",
  includesLabel: "Leistungsumfang",
  packagesLabel: "Passende Pakete",
  quoteCta: "Angebot anfordern",
  details: {
    presentation: {
      description:
        "Eine Visitenkarten-Website ist der schnellste Weg zu einem professionellen Auftritt im Internet. Auf einer Seite oder in wenigen Abschnitten erfahren Besucher, wer Sie sind, was Sie anbieten und wie sie Sie erreichen.",
      idealFor: [
        "Neue Unternehmen und Selbstständige",
        "Die Einführung eines neuen Produkts oder einer neuen Dienstleistung",
        "Unternehmen, die schnell einen einfachen Online-Auftritt möchten",
      ],
      includes: [
        "Modernes, responsives Design für Smartphone, Tablet und Computer",
        "Abschnitte für Ihre Vorstellung, Ihre Leistungen und Ihre Kontaktdaten",
        "Kontaktformular",
        "SEO-Grundoptimierung",
      ],
    },
    business: {
      description:
        "Für Unternehmen, die mehr zu erzählen haben: verschiedene Leistungen, Projekte oder ausführliche Informationen. Die Inhalte sind auf mehrere Seiten verteilt, sodass Ihre Kunden schnell finden, was sie suchen.",
      idealFor: [
        "Unternehmen mit mehreren Leistungen oder Produkten",
        "Firmen, die online Vertrauen aufbauen möchten",
        "Unternehmen, die einen umfassenderen Online-Auftritt wünschen",
      ],
      includes: [
        "Mehrere Seiten, strukturiert nach Ihren Anforderungen",
        "Individuelles Design passend zu Ihrer Markenidentität",
        "Kontaktformular und Karte",
        "Social-Media-Links",
        "SEO-Grundoptimierung",
      ],
    },
    ecommerce: {
      description:
        "Mit einem Onlineshop verkaufen Sie Ihre Produkte rund um die Uhr. Wir entwickeln einen übersichtlichen Katalog, einen einfachen Warenkorb und einen Checkout, der auch auf dem Smartphone reibungslos funktioniert.",
      idealFor: [
        "Ladengeschäfte, die zusätzlich online verkaufen möchten",
        "Lokale Marken und Hersteller",
        "Unternehmen mit Produktvarianten wie Größen oder Farben",
      ],
      includes: [
        "Produktkatalog mit Kategorien",
        "Warenkorb und Checkout",
        "Produkt- und Bestellverwaltung",
        "Einkaufserlebnis, optimiert für Smartphones",
      ],
    },
    platform: {
      description:
        "Wenn Ihre Anforderungen über eine Website hinausgehen, entwickeln wir individuelle Webanwendungen: Buchungssysteme, Verwaltungs-Dashboards, Kundenportale und andere Lösungen, die sich an Ihren Geschäftsprozessen orientieren.",
      idealFor: [
        "Unternehmen mit eigenen Abläufen, die sie digitalisieren möchten",
        "Ideen für Online-Produkte oder -Dienste",
        "Firmen, die eine Anbindung an bestehende Systeme benötigen",
      ],
      includes: [
        "Anforderungsanalyse und Planung",
        "Gestaltung von Benutzeroberfläche und Nutzererlebnis",
        "Entwicklung individueller Funktionen",
        "Anbindung an externe Dienste und Systeme",
      ],
    },
  },
  standards: {
    eyebrow: "Unser Standard",
    title: "Das ist in jedem Projekt enthalten",
    description: "Unabhängig vom Paket folgt jede Website, die wir entwickeln, denselben Qualitätsstandards.",
    items: {
      responsive: {
        title: "Responsiv",
        text: "Ein Design, das sich an Smartphone, Tablet und Computer anpasst.",
      },
      seo: {
        title: "SEO-Grundoptimierung",
        text: "Eine saubere Seitenstruktur sowie Titel und Beschreibungen, die Suchmaschinen helfen.",
      },
      performance: {
        title: "Performance",
        text: "Optimierte Bilder und optimierter Code, damit die Website schnell lädt.",
      },
      accessibility: {
        title: "Barrierefreiheit",
        text: "Gute Kontraste, Tastaturbedienung und eine klare Struktur für alle Nutzer.",
      },
      security: {
        title: "Sicherheit",
        text: "Eine verschlüsselte Verbindung (HTTPS) und die Prüfung aller Daten, die über Formulare gesendet werden.",
      },
      custom: {
        title: "Individueller Code",
        text: "Keine fertigen Vorlagen: Jedes Projekt wird nach Ihren Anforderungen entwickelt.",
      },
    },
  },
  process: {
    title: "Wie läuft ein Projekt ab?",
    text: "Vom ersten Gespräch bis zum Launch ist jeder Schritt klar und mit Ihnen abgestimmt.",
    cta: "Zum Ablauf",
  },
} satisfies Dictionary["servicesPage"];
