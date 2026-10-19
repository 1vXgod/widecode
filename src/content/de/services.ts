import type { Dictionary } from "@/types/content";

/**
 * Soft hyphen (invisible unless the word breaks there). Long compounds get them
 * at their natural boundaries, so narrow cards break them as "Unternehmens-website"
 * or "Unter-nehmens-website" instead of overflowing, or of the browser's own
 * syllable guess ("Unterneh-menswebsite").
 * Structured data removes it (src/lib/seo.ts).
 */
const SHY = String.fromCharCode(0xad);

export const services = {
  eyebrow: "Leistungen",
  title: "Was wir für Ihr Unternehmen entwickeln",
  description:
    "Von der einfachen Visitenkarten-Website über den Onlineshop bis zur Individualentwicklung – jedes Projekt richtet sich nach Ihren Anforderungen.",
  items: {
    presentation: {
      title: `Visiten${SHY}karten-Website`,
      summary: "Eine klare, moderne Website, die Ihr Unternehmen, Ihre Leistungen und Ihre Kontaktdaten präsentiert.",
      points: ["Ideal für neue Unternehmen", "Responsives Design für Smartphones", "Kontaktformular"],
    },
    business: {
      title: `Unter${SHY}nehmens${SHY}website`,
      summary: "Eine Website mit mehreren Seiten für Unternehmen, die ihre Leistungen ausführlich vorstellen möchten.",
      points: ["Mehrere strukturierte Seiten", "SEO-Grundoptimierung", "Karte und Social-Media-Links"],
    },
    ecommerce: {
      title: "Onlineshop",
      summary: "Verkaufen Sie Ihre Produkte online – mit Katalog, Warenkorb und Bestellverwaltung.",
      points: ["Produktkatalog", "Warenkorb und Checkout", "Produktverwaltung"],
    },
    platform: {
      title: `Individual${SHY}entwicklung`,
      summary: "Webanwendungen und Systeme, zugeschnitten auf die konkreten Anforderungen Ihres Unternehmens.",
      points: [`Anforderungs${SHY}analyse`, "Individuelle Funktionen", "Anbindung an andere Systeme"],
    },
  },
  cta: "Alle Leistungen ansehen",
} satisfies Dictionary["services"];
