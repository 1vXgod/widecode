import type { Dictionary } from "@/types/content";

/** Package copy. Prices themselves live in src/config/pricing.ts. */
export const pricing = {
  eyebrow: "Preise",
  title: "Klare Preise von Anfang an",
  description:
    "Pakete mit transparenten Einstiegspreisen. Wählen Sie Ihren Ausgangspunkt – das Angebot passen wir an Ihr Projekt an.",
  from: "ab",
  customPrice: "Auf Anfrage",
  recommended: "Empfohlen",
  packageCta: "Paket wählen",
  customCta: "Angebot anfordern",
  viewAll: "Paketdetails ansehen",
  disclaimer:
    "Alle Preise sind unverbindliche Einstiegspreise, keine Festpreisangebote. Der endgültige Preis hängt von Umfang, Funktionen, Inhalten, Schnittstellen und Komplexität des Projekts ab.",
  packages: {
    starter: {
      name: "Starter",
      summary: "Für Unternehmen, die einen einfachen, professionellen Online-Auftritt möchten.",
      features: ["Onepager-Website", "Responsives Design für jedes Gerät", "Kontaktformular", "SEO-Grundoptimierung"],
    },
    business: {
      name: "Business",
      summary: "Für Unternehmen, die ihre Leistungen auf mehreren Seiten vorstellen möchten.",
      features: ["Bis zu 5 Seiten", "Individuelles Design", "Kontaktformular und Karte", "SEO-Grundoptimierung"],
    },
    professional: {
      name: "Professional",
      summary: "Für Projekte mit mehr Inhalten und Funktionen.",
      features: ["Bis zu 10 Seiten", "Animationen und anspruchsvolle Details", "Blog- oder News-Bereich", "Einbindung von Webanalyse"],
    },
    ecommerce: {
      name: "E-commerce",
      summary: "Für den Onlineverkauf Ihrer Produkte.",
      features: [
        "Produktkatalog",
        "Warenkorb und Checkout",
        "Produkt- und Bestellverwaltung",
        "Einkaufserlebnis, optimiert für Smartphones",
      ],
    },
    custom: {
      name: "Custom",
      summary: "Für Plattformen und Webanwendungen mit besonderen Anforderungen.",
      features: ["Ausführliche Anforderungsanalyse", "Individuelle Funktionen", "Anbindung an externe Systeme"],
    },
  },
} satisfies Dictionary["pricing"];
