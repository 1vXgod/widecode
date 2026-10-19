import type { Dictionary } from "@/types/content";

export const home = {
  hero: {
    eyebrow: "Webentwicklung aus dem Kosovo",
    title: "Eine professionelle Website, die",
    titleHighlight: "für Ihr Unternehmen arbeitet",
    lead: "Wir entwickeln Websites und Onlineshops nach Maß – schnell, sicher und auf jedem Gerät optimal dargestellt, mit klaren Preisen von Anfang an.",
    primaryCta: "Angebot anfordern",
    secondaryCta: "Projekte ansehen",
    priceNote: "Einstiegspreise ab {price}",
    noObligation: "Unverbindliches Angebot",
  },
  showcase: {
    label: "Interaktives Beispiel: wie eine Website entsteht, vom Design bis zum Launch",
    tabs: {
      design: "Design",
      code: "Code",
      live: "Live",
    },
    pause: "Automatischen Wechsel anhalten",
    play: "Automatischen Wechsel fortsetzen",
    url: "ihr-unternehmen",
    mock: {
      brand: "Ihr Unternehmen",
      nav: ["Leistungen", "Über uns", "Kontakt"],
      title: "Willkommen",
      text: "Qualität und Service für unsere Kunden.",
      cta: "Kontakt aufnehmen",
      cards: ["Leistungen", "Projekte", "Kontakt"],
      liveBadge: "Bereit für den Launch",
    },
    wireframe: {
      header: "Navigation",
      hero: "Hauptbereich",
      cards: "Karten",
    },
  },
} satisfies Dictionary["home"];

export const processCopy = {
  eyebrow: "Ablauf",
  title: "So arbeiten wir",
  description: "Ein klarer Ablauf in fünf Schritten – Sie wissen jederzeit, wo Ihr Projekt gerade steht.",
  steps: [
    {
      title: "Erstgespräch",
      text: "Sie erzählen uns von Ihrem Unternehmen, Ihren Zielen und davon, was Ihre Website leisten soll.",
    },
    {
      title: "Angebot und Planung",
      text: "Sie erhalten ein klares Angebot mit Preis, Zeitplan und allen enthaltenen Leistungen.",
    },
    {
      title: "Design",
      text: "Wir entwerfen das Design und stimmen es mit Ihnen ab, bevor die Entwicklung beginnt.",
    },
    {
      title: "Entwicklung",
      text: "Wir setzen die Website mit individuellem Code um – schnell und auf jedem Gerät optimal dargestellt.",
    },
    {
      title: "Test und Launch",
      text: "Wir testen auf verschiedenen Geräten und gehen online, sobald Sie zufrieden sind.",
    },
  ],
} satisfies Dictionary["process"];

export const why = {
  eyebrow: "Warum WideCode",
  title: "Ein verlässlicher Partner für Ihre Website",
  description: "Wir versprechen keine Wunder. Wir versprechen sorgfältige Arbeit, offene Kommunikation und klare Preise.",
  items: {
    transparent: {
      title: "Transparente Preise",
      text: "Unsere Einstiegspreise sind öffentlich. Bevor wir starten, wissen Sie genau, was das Angebot umfasst.",
    },
    custom: {
      title: "Nach Maß entwickelt",
      text: "Jede Website wird für Ihr Unternehmen gestaltet und entwickelt – nicht aus fertigen Vorlagen.",
    },
    devices: {
      title: "Für jedes Gerät",
      text: "Jede Website, die wir entwickeln, passt sich an Smartphone, Tablet und Computer an.",
    },
    communication: {
      title: "Direkte Kommunikation",
      text: "Während des gesamten Projekts sprechen Sie direkt mit uns – ohne Umwege.",
    },
  },
} satisfies Dictionary["why"];

export const cta = {
  title: "Bereit, Ihr Projekt zu starten?",
  text: "Erzählen Sie uns, was Sie vorhaben, und wir erstellen Ihnen ein klares, unverbindliches Angebot.",
  primary: "Angebot anfordern",
  secondary: "Preis berechnen",
} satisfies Dictionary["cta"];
