import type { Dictionary } from "@/types/content";

/**
 * About page copy. Same rule as the Albanian original: mission, approach and
 * services only; no founding year, team, clients, statistics or achievements
 * unless the owner provides and confirms them. No languages of communication
 * are promised beyond what the owner has confirmed (Albanian).
 */
export const aboutPage = {
  intro: {
    eyebrow: "Über uns",
    title: "Websites mit Sorgfalt, Klarheit und fairen Preisen",
    lead: "WideCode ist ein Unternehmen für Webentwicklung, das Websites, Onlineshops und Webanwendungen nach Maß entwickelt. Unser Schwerpunkt liegt auf Unternehmen im Kosovo, und wir freuen uns auch über Projekte von Kunden aus dem Ausland.",
    primaryCta: "Angebot anfordern",
    secondaryCta: "Leistungen ansehen",
  },
  mission: {
    eyebrow: "Mission",
    title: "Ein professioneller Online-Auftritt für jedes Unternehmen",
    paragraphs: [
      "Wir sind überzeugt: Jedes Unternehmen, ob klein oder groß, verdient eine Website, die professionell aussieht, auf jedem Gerät gut funktioniert und das eigene Angebot treffend darstellt.",
      "Deshalb veröffentlichen wir unsere Einstiegspreise, erklären klar, was jedes Angebot umfasst, und entwickeln jedes Projekt nach den tatsächlichen Anforderungen unserer Kunden – ohne fertige Vorlagen und ohne vage Versprechen.",
    ],
    statement: "Unser Ziel ist einfach: Websites, die für Sie und Ihre Kunden funktionieren.",
  },
  values: {
    eyebrow: "Unsere Werte",
    title: "Wie wir arbeiten",
    description: "Die Grundsätze hinter jedem Projekt, vom ersten Gespräch bis zum Launch.",
    items: {
      transparency: {
        title: "Transparenz",
        text: "Öffentliche Einstiegspreise und klare Angebote – Sie wissen von Anfang an, was enthalten ist.",
      },
      quality: {
        title: "Qualität im Detail",
        text: "Uns sind Design, Geschwindigkeit und Barrierefreiheit wichtig, nicht nur die Optik.",
      },
      custom: {
        title: "Lösungen nach Maß",
        text: "Jedes Projekt wird für Ihr Unternehmen entwickelt – nicht aus fertigen Vorlagen.",
      },
      communication: {
        title: "Klare Kommunikation",
        text: "Wir erklären verständlich und halten Sie in jeder Phase auf dem Laufenden.",
      },
      honesty: {
        title: "Ehrlichkeit",
        text: "Wir sagen Ihnen offen, was wir leisten können, was es kostet und wie lange es dauert – ohne zu viel zu versprechen.",
      },
      partnership: {
        title: "Zusammenarbeit",
        text: "Die wichtigen Entscheidungen zu Ihrem Projekt treffen wir gemeinsam mit Ihnen.",
      },
    },
  },
  services: {
    eyebrow: "Was wir tun",
    title: "Unsere Leistungen",
    description: "Vier Arten von Projekten, alle nach demselben Qualitätsstandard umgesetzt.",
    cta: "Leistungen im Detail",
  },
  market: {
    title: "Unser Markt",
    text: "Unser Schwerpunkt sind Unternehmen im Kosovo. Gleichzeitig sind wir offen für Projekte mit Kunden aus der Region und darüber hinaus.",
  },
} satisfies Dictionary["aboutPage"];
