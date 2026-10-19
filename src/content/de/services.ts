import type { Dictionary } from "@/types/content";

export const services = {
  eyebrow: "Leistungen",
  title: "Was wir für Ihr Unternehmen entwickeln",
  description:
    "Von der einfachen Visitenkarten-Website über den Onlineshop bis zur Individualentwicklung – jedes Projekt richtet sich nach Ihren Anforderungen.",
  items: {
    presentation: {
      title: "Visitenkarten-Website",
      summary: "Eine klare, moderne Website, die Ihr Unternehmen, Ihre Leistungen und Ihre Kontaktdaten präsentiert.",
      points: ["Ideal für neue Unternehmen", "Responsives Design für Smartphones", "Kontaktformular"],
    },
    business: {
      title: "Unternehmenswebsite",
      summary: "Eine Website mit mehreren Seiten für Unternehmen, die ihre Leistungen ausführlich vorstellen möchten.",
      points: ["Mehrere strukturierte Seiten", "SEO-Grundoptimierung", "Karte und Social-Media-Links"],
    },
    ecommerce: {
      title: "Onlineshop",
      summary: "Verkaufen Sie Ihre Produkte online – mit Katalog, Warenkorb und Bestellverwaltung.",
      points: ["Produktkatalog", "Warenkorb und Checkout", "Produktverwaltung"],
    },
    platform: {
      title: "Individualentwicklung",
      summary: "Webanwendungen und Systeme, zugeschnitten auf die konkreten Anforderungen Ihres Unternehmens.",
      points: ["Anforderungsanalyse", "Individuelle Funktionen", "Anbindung an andere Systeme"],
    },
  },
  cta: "Alle Leistungen ansehen",
} satisfies Dictionary["services"];
