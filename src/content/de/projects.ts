import type { Dictionary } from "@/types/content";

/**
 * Portfolio copy. Every project is a website CONCEPT designed by WideCode
 * (fictional brands), not client work: present it as a concept, describe what
 * it shows and aims to do, and never invent clients, results or testimonials.
 * The previews themselves stay in Albanian (src/content/sq/concepts.ts): they
 * show websites for fictional businesses in Kosovo.
 */
export const projects = {
  eyebrow: "Projekte",
  title: "Website-Konzepte",
  description:
    "Konzepte von WideCode für verschiedene Branchen – von der Visitenkarten-Website bis zur Webanwendung.",
  conceptLabel: "Website-Konzept",
  categories: {
    presentation: "Visitenkarten-Website",
    business: "Unternehmenswebsite",
    ecommerce: "Onlineshop",
    platform: "Webanwendung",
  },
  items: {
    "studio-fotografie": {
      title: "Fotostudio",
      summary: "Eine Onepager-Website für Fotografen, mit Galerie, Leistungen und Kontaktdaten.",
      tags: ["Onepager", "Galerie", "Kontakt"],
      concept:
        "Ein Konzept für Fotografen oder Studios, die ihre Arbeiten auf einer einzigen schnellen und visuellen Seite präsentieren möchten.",
      goals: [
        "Die Bildarbeiten in den Mittelpunkt stellen",
        "Die Kontaktaufnahme per Smartphone erleichtern",
        "Auch mit vielen Fotos schnell laden",
      ],
      features: ["Für Fotografie optimierte Galerie", "Bereich für Leistungen", "Kontaktformular", "Responsives Design"],
      sections: ["Einleitung", "Galerie", "Leistungen", "Kontakt"],
    },
    "restorant-tradicional": {
      title: "Traditionelles Restaurant",
      summary: "Eine Website mit Speisekarte, Galerie und Reservierungsanfragen, gestaltet für die einfache Nutzung am Smartphone.",
      tags: ["Online-Speisekarte", "Reservierungen", "Mobil"],
      concept:
        "Ein Konzept für ein Restaurant, das seine Speisekarte und Atmosphäre präsentieren und Reservierungsanfragen online entgegennehmen möchte.",
      goals: [
        "Die Speisekarte auf dem Smartphone gut lesbar machen",
        "Reservierungsanfragen ohne Anruf ermöglichen",
        "Die Atmosphäre mit Fotos vermitteln",
      ],
      features: ["Online-Speisekarte mit Kategorien", "Formular für Reservierungsanfragen", "Galerie der Räumlichkeiten", "Karte und Öffnungszeiten"],
      sections: ["Startseite", "Speisekarte", "Galerie", "Tisch reservieren", "Kontakt"],
    },
    "klinike-dentare": {
      title: "Zahnarztpraxis",
      summary: "Eine Unternehmenswebsite mit Leistungen, Patienteninformationen und Terminanfragen.",
      tags: ["Leistungen", "Termine", "SEO-Grundoptimierung"],
      concept:
        "Ein Konzept für eine Praxis, die Patienten über ihre Leistungen informieren und Terminanfragen online ermöglichen möchte.",
      goals: [
        "Die Leistungen verständlich erklären",
        "Terminanfragen einfach machen",
        "Vom ersten Besuch an Vertrauen schaffen",
      ],
      features: ["Eine eigene Seite für jede Leistung", "Formular für Terminanfragen", "Praktische Informationen für Patienten", "SEO-Grundoptimierung"],
      sections: ["Startseite", "Leistungen", "Über die Praxis", "Termine", "Kontakt"],
    },
    "dyqan-veshjesh": {
      title: "Onlineshop für Mode",
      summary: "Ein Produktkatalog mit Filtern, Warenkorb und einfachem Checkout.",
      tags: ["Katalog", "Warenkorb", "Filter"],
      concept:
        "Ein Konzept für eine Modemarke, die ihre Produkte online verkaufen möchte, mit Fokus auf schnelles Einkaufen per Smartphone.",
      goals: [
        "Produkte mit Filtern schnell auffindbar machen",
        "Den Kauf in wenigen Schritten abschließen",
        "Auf dem Smartphone reibungslos funktionieren",
      ],
      features: [
        "Katalog mit Kategorien und Filtern",
        "Produktvarianten wie Größe und Farbe",
        "Warenkorb und Checkout",
        "Produkt- und Bestellverwaltung",
      ],
      sections: ["Startseite", "Katalog", "Produkt", "Warenkorb", "Checkout"],
    },
    "produkte-vendore": {
      title: "Onlineshop für regionale Produkte",
      summary: "Ein Onlineshop für regionale Hersteller, mit der Geschichte hinter jedem Produkt und einem einfachen Checkout.",
      tags: ["Katalog", "Produktgeschichte", "Bestellung"],
      concept:
        "Ein Konzept für einen regionalen Hersteller, etwa von Honig oder Hofprodukten, der direkt online an seine Kunden verkaufen möchte.",
      goals: [
        "Herkunft und Qualität der Produkte zeigen",
        "Das Bestellen für Kunden jeden Alters einfach machen",
        "Vertrauen bei neuen Kunden aufbauen",
      ],
      features: [
        "Produktseiten mit Geschichte und Fotos",
        "Warenkorb und Checkout",
        "Onlinezahlungen als optionale Zusatzfunktion",
        "Responsives Design",
      ],
      sections: ["Startseite", "Produkte", "Über uns", "Checkout"],
    },
    "panel-palestre": {
      title: "Dashboard für ein Fitnessstudio",
      summary: "Eine Webanwendung zur Verwaltung von Mitgliedern, Mitgliedschaften und Kursplänen.",
      tags: ["Dashboard", "Kurspläne", "Mitglieder"],
      concept:
        "Ein Konzept für ein Fitnessstudio, das Mitglieder, Mitgliedschaften und Kurspläne an einem Ort verwalten möchte.",
      goals: [
        "Zeit bei der Verwaltung sparen",
        "Mitgliedern einen klaren Überblick über den Kursplan geben",
        "Auslaufende Mitgliedschaften leicht im Blick behalten",
      ],
      features: ["Dashboard mit Mitgliederübersicht", "Verwaltung der Mitgliedschaften", "Kursplan", "Verschiedene Benutzerrollen"],
      sections: ["Dashboard", "Mitglieder", "Mitgliedschaften", "Kursplan"],
    },
  },
  desktopPreviewLabel: "Startseite des Konzepts „{title}“ auf einem Computer",
  mobilePreviewLabel: "Startseite des Konzepts „{title}“ auf einem Smartphone",
  cta: "Alle Projekte ansehen",
} satisfies Dictionary["projects"];
