import type { Dictionary } from "@/types/content";
import { faq } from "./faq";

const [cost, startingPrices, duration, mobile, start] = faq.items as [
  (typeof faq.items)[number],
  (typeof faq.items)[number],
  (typeof faq.items)[number],
  (typeof faq.items)[number],
  (typeof faq.items)[number],
];

/**
 * The full FAQ page. As in Albanian, the questions shown on other pages
 * (src/content/de/faq.ts) are reused here word for word. Answers may use
 * {price}, {multilingualPrice} and {ecommercePrice} (see src/lib/faq.ts).
 * Payment terms, domain/hosting and changes after launch are only described
 * as agreed in the quote: no terms are promised here.
 */
export const faqPage = {
  intro: {
    eyebrow: "FAQ",
    title: "Fragen und Antworten",
    lead: "Alles Wichtige zu Preisen, Ablauf und Ihrer Website an einem Ort. Wenn Sie Ihre Antwort nicht finden, schreiben Sie uns.",
  },
  onThisPage: "Themen",
  categories: {
    cmimet: {
      title: "Preise und Angebote",
      items: [
        cost,
        startingPrices,
        {
          question: "Wie berechne ich den Preis für mein Projekt?",
          answer:
            "Nutzen Sie den Preisrechner: Wählen Sie ein Paket, die Seitenzahl und Zusatzfunktionen, und Sie sehen sofort eine unverbindliche Schätzung. Diese Schätzung können Sie gleich mit Ihrer Angebotsanfrage senden.",
        },
        {
          question: "Warum hat die Individualentwicklung keinen Einstiegspreis?",
          answer:
            "Individuelle Plattformen und Webanwendungen unterscheiden sich stark voneinander. Deshalb nennen wir keinen Preis im Voraus, sondern erstellen ein Angebot, sobald wir Ihre Anforderungen analysiert haben.",
        },
        {
          question: "Was ist im Preis nicht enthalten?",
          answer:
            "Kosten Dritter, etwa Transaktionsgebühren von Zahlungsanbietern oder Abonnements externer Dienste, sind im Preis nicht enthalten.",
        },
        {
          question: "Verpflichtet mich eine Angebotsanfrage zu etwas?",
          answer: "Nein. Wir senden Ihnen das Angebot, und Sie entscheiden frei, ob Sie es annehmen.",
        },
        {
          question: "Wie funktioniert die Bezahlung?",
          answer: "Die Zahlungsbedingungen legen wir klar im Angebot fest, bevor die Arbeit beginnt.",
        },
      ],
    },
    procesi: {
      title: "Ablauf und Zeitrahmen",
      items: [
        start,
        {
          question: "Wie sieht der Ablauf aus?",
          answer:
            "Wir arbeiten in fünf Schritten: Erstgespräch, Angebot und Planung, Design, Entwicklung sowie Test und Launch. So wissen Sie jederzeit, wo Ihr Projekt gerade steht.",
        },
        duration,
        {
          question: "Sehe ich das Design, bevor die Entwicklung beginnt?",
          answer: "Ja. Wir entwerfen das Design und stimmen es mit Ihnen ab, bevor die Entwicklung beginnt.",
        },
        {
          question: "Was sollte ich vor dem Start vorbereiten?",
          answer:
            "Eine klare Vorstellung von Ihrem Unternehmen und Ihren Zielen genügt. Hilfreich sind – falls vorhanden – Ihr Logo, Texte, Fotos und Beispiele von Websites, die Ihnen gefallen.",
        },
      ],
    },
    website: {
      title: "Ihre Website und ihre Funktionen",
      items: [
        mobile,
        {
          question: "Ist SEO enthalten?",
          answer:
            "Ja, eine SEO-Grundoptimierung ist in jedem Projekt enthalten: eine saubere Seitenstruktur, Titel und Beschreibungen, die Suchmaschinen helfen, und Seiten, die schnell laden.",
        },
        {
          question: "Kann meine Website zweisprachig sein?",
          answer:
            "Ja. Eine Website in zwei Sprachen, zum Beispiel Deutsch und Englisch, ist eine Zusatzfunktion mit einem Richtpreis von {multilingualPrice}.",
        },
        {
          question: "Kann ich Produkte online verkaufen?",
          answer:
            "Ja. Das Paket E-commerce beginnt ab {ecommercePrice} und umfasst einen Produktkatalog, einen Warenkorb und den Checkout. Kartenzahlungen sind eine Zusatzfunktion; die Gebühren des Zahlungsanbieters sind nicht enthalten.",
        },
        {
          question: "Entwickeln Sie auch individuelle Webanwendungen?",
          answer:
            "Ja. Im Rahmen der Individualentwicklung entwickeln wir Plattformen und Webanwendungen mit besonderen Anforderungen, individuellen Funktionen und Schnittstellen.",
        },
      ],
    },
    "pas-publikimit": {
      title: "Nach dem Launch",
      items: [
        {
          question: "Wer kümmert sich um Domain und Hosting?",
          answer:
            "Domain und Hosting besprechen wir im Erstgespräch und halten im Angebot klar fest, wie beides verwaltet wird.",
        },
        {
          question: "Kann ich nach dem Launch Änderungen vornehmen lassen?",
          answer:
            "Ja. Für Änderungen oder Erweiterungen nach dem Launch schreiben Sie uns, und wir senden Ihnen ein Angebot dafür.",
        },
      ],
    },
  },
} satisfies Dictionary["faqPage"];
