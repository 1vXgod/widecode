import type { Dictionary } from "@/types/content";

export const faq = {
  eyebrow: "Fragen",
  title: "Häufig gestellte Fragen",
  description: "Kurze Antworten auf die häufigsten Fragen zu Projekten und zu unserem Ablauf.",
  items: [
    {
      question: "Was kostet eine Website?",
      answer:
        "Unsere Pakete beginnen ab {price}. Der endgültige Preis hängt von der Seitenzahl, den Funktionen, den Inhalten und den benötigten Schnittstellen ab.",
    },
    {
      question: "Warum heißen die Preise Einstiegspreise?",
      answer:
        "Jedes Projekt ist anders. Die veröffentlichten Preise sind unverbindliche Ausgangspunkte; nach unserem Erstgespräch erhalten Sie ein genaues Angebot für Ihr Projekt.",
    },
    {
      question: "Wie lange dauert die Entwicklung einer Website?",
      answer:
        "Das hängt von Umfang und Komplexität des Projekts ab. Den genauen Zeitrahmen legen wir gemeinsam fest und halten ihn im Angebot fest.",
    },
    {
      question: "Funktioniert die Website auch auf dem Smartphone?",
      answer: "Ja. Jede Website, die wir entwickeln, wird für Smartphone, Tablet und Computer gestaltet und getestet.",
    },
    {
      question: "Wie fangen wir an?",
      answer:
        "Schreiben Sie uns über die Kontaktseite mit ein paar Angaben zu Ihrem Projekt. Wir antworten mit Rückfragen oder einem unverbindlichen Angebot.",
    },
  ],
  viewAll: "Alle Fragen ansehen",
} satisfies Dictionary["faq"];
