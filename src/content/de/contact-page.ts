import type { Dictionary } from "@/types/content";

export const contactPage = {
  intro: {
    eyebrow: "Angebot anfordern",
    title: "Erzählen Sie uns von Ihrem Projekt",
    lead: "Füllen Sie das Formular mit ein paar Angaben aus, und wir senden Ihnen ein klares, unverbindliches Angebot mit Preis, Zeitplan und allen enthaltenen Leistungen.",
  },
  form: {
    label: "Angebotsanfrage",
    requiredNote: "Alle Felder sind Pflichtfelder, außer den als optional gekennzeichneten.",
    optional: "optional",
    sections: {
      contact: "Ihre Angaben",
      project: "Das Projekt",
    },
    fields: {
      name: { label: "Vor- und Nachname" },
      business: { label: "Name des Unternehmens", hint: "Falls das Projekt für ein Unternehmen oder eine Organisation ist." },
      email: { label: "E-Mail", hint: "Hierhin senden wir unsere Antwort und das Angebot." },
      phone: {
        label: "Telefonnummer",
        hint: "Falls Sie einen Anruf bevorzugen. Bitte mit Ländervorwahl, z. B. +383 4X XXX XXX.",
      },
      projectType: { label: "Projektart" },
      packageId: {
        label: "Paket",
        hint: "Noch unsicher? Wählen Sie „Noch nicht sicher“, und wir helfen Ihnen, das passende Paket zu finden.",
      },
      budget: { label: "Ungefähres Budget" },
      timeline: { label: "Gewünschter Zeitrahmen" },
      description: {
        label: "Projektbeschreibung",
        hint: "Was Ihr Unternehmen macht, was die Website enthalten soll und – falls vorhanden – Beispiele von Websites, die Ihnen gefallen.",
      },
    },
    selectPlaceholder: "Bitte wählen …",
    options: {
      projectType: {
        presentation: "Visitenkarten-Website",
        business: "Unternehmenswebsite",
        ecommerce: "Onlineshop",
        platform: "Individualentwicklung / Webanwendung",
        other: "Etwas anderes",
      },
      packageUnsure: "Noch nicht sicher",
      budget: {
        "under-300": "Bis 300 €",
        "300-600": "300–600 €",
        "600-1000": "600–1.000 €",
        "1000-2000": "1.000–2.000 €",
        "over-2000": "Über 2.000 €",
        unsure: "Noch nicht sicher",
      },
      timeline: {
        asap: "So bald wie möglich",
        "within-month": "Innerhalb eines Monats",
        "one-to-three-months": "Innerhalb von 1–3 Monaten",
        flexible: "Ich bin flexibel",
      },
    },
    characterCount: "{count} / {max} Zeichen",
    prefillNotice: "Einige Felder wurden anhand Ihrer Auswahl ausgefüllt. Sie können sie jederzeit ändern.",
    estimate: {
      title: "Ihre Schätzung aus dem Preisrechner",
      text: "Diese unverbindliche Schätzung wird mit Ihrer Anfrage gesendet. Den endgültigen Preis bestätigen wir im Angebot.",
      edit: "Schätzung ändern",
      remove: "Schätzung entfernen",
      pages: "Anzahl der Seiten",
      pagesValue: "{count} Seiten",
      pagesWithIncluded: "{count} Seiten ({included} im Paket enthalten)",
      includedFeatures: "Im Paket enthalten",
    },
    project: {
      title: "Das Konzept, für das Sie sich interessieren",
      remove: "Konzept entfernen",
    },
    submit: "Anfrage senden",
    submitting: "Wird gesendet …",
    privacy: "Ihre Angaben werden ausschließlich zur Beantwortung dieser Anfrage verwendet.",
    honeypotLabel: "Dieses Feld bitte nicht ausfüllen",
  },
  errors: {
    summaryOne: "Bitte korrigieren Sie 1 Feld:",
    summaryMany: "Bitte korrigieren Sie {count} Felder:",
    fields: {
      name: {
        required: "Geben Sie Ihren Namen ein.",
        tooShort: "Ihr Name muss mindestens 2 Buchstaben haben.",
        tooLong: "Ihr Name darf höchstens 100 Zeichen lang sein.",
      },
      business: {
        tooLong: "Der Name des Unternehmens darf höchstens 120 Zeichen lang sein.",
      },
      email: {
        required: "Geben Sie Ihre E-Mail-Adresse ein.",
        invalid: "Geben Sie eine gültige E-Mail-Adresse ein, z. B. name@domain.de.",
      },
      phone: {
        invalid: "Geben Sie eine gültige Telefonnummer ein, z. B. +383 4X XXX XXX, oder lassen Sie das Feld leer.",
      },
      projectType: { required: "Wählen Sie die Projektart." },
      packageId: { required: "Wählen Sie ein Paket oder „Noch nicht sicher“." },
      budget: { required: "Wählen Sie ein ungefähres Budget oder „Noch nicht sicher“." },
      timeline: { required: "Wählen Sie den gewünschten Zeitrahmen." },
      description: {
        required: "Beschreiben Sie Ihr Projekt kurz.",
        tooShort: "Schreiben Sie bitte mindestens 20 Zeichen, damit wir Ihr Projekt besser verstehen.",
        tooLong: "Die Beschreibung darf höchstens 5.000 Zeichen lang sein.",
      },
    },
  },
  status: {
    unavailableNotice: {
      title: "Das Formular ist vorübergehend nicht verfügbar",
      text: "Derzeit können wir über die Website keine Anfragen entgegennehmen. Bitte versuchen Sie es später erneut. In der Zwischenzeit können Sie sich unsere Pakete und Preise ansehen oder eine unverbindliche Schätzung für Ihr Projekt berechnen.",
    },
    invalid: "Einige Felder sind nicht korrekt ausgefüllt. Bitte prüfen Sie die Hinweise bei den Feldern.",
    rateLimited: "Sie haben in kurzer Zeit mehrere Anfragen gesendet. Bitte versuchen Sie es in {time} erneut.",
    minuteOne: "1 Minute",
    minuteMany: "{count} Minuten",
    tooFast: "Das Formular wurde zu schnell nach dem Öffnen gesendet. Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.",
    rejected: "Die Anfrage konnte nicht angenommen werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.",
    unavailable:
      "Ihre Anfrage wurde nicht gesendet, weil das Formular vorübergehend nicht verfügbar ist. Ihre Angaben sind noch im Formular. Bitte versuchen Sie es später erneut.",
    failed:
      "Ihre Anfrage wurde wegen eines technischen Problems nicht gesendet. Ihre Angaben sind noch im Formular, sodass Sie es gleich noch einmal versuchen können.",
    network:
      "Der Server ist nicht erreichbar. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut. Ihre Angaben sind noch im Formular.",
  },
  success: {
    title: "Vielen Dank, Ihre Anfrage wurde gesendet!",
    text: "Wir haben Ihre Angebotsanfrage erhalten. Wir prüfen sie sorgfältig und antworten Ihnen an {email}.",
    summaryTitle: "Zusammenfassung der Anfrage",
    again: "Weitere Anfrage senden",
    projects: "Projekte ansehen",
  },
  aside: {
    nextTitle: "So geht es nach dem Absenden weiter",
    steps: [
      {
        title: "Wir prüfen Ihre Anfrage",
        text: "Wir lesen Ihre Beschreibung und Ihre Auswahl sorgfältig.",
      },
      {
        title: "Wir melden uns",
        text: "Wenn wir weitere Details brauchen, schreiben wir Ihnen mit ein paar kurzen Fragen.",
      },
      {
        title: "Sie erhalten das Angebot",
        text: "Wir senden Ihnen ein klares, unverbindliches Angebot mit Preis, Zeitplan und allen enthaltenen Leistungen.",
      },
    ],
    priceTitle: "Unsicher beim Preis?",
    priceText: "Berechnen Sie eine unverbindliche Schätzung oder sehen Sie sich die Pakete mit ihren Einstiegspreisen an.",
    estimatorCta: "Preis berechnen",
    pricingCta: "Preise ansehen",
    contactTitle: "Direkt Kontakt aufnehmen",
  },
  /**
   * The notification email goes to WideCode and is always written in Albanian
   * (src/content/sq/contact-page.ts); this German version only completes the type.
   */
  email: {
    subject: "Angebotsanfrage: {name} – {projectType}",
    heading: "Neue Angebotsanfrage",
    intro: "Diese Anfrage wurde über das Kontaktformular auf der Website von WideCode gesendet.",
    notProvided: "Nicht angegeben",
    estimateTitle: "Unverbindliche Schätzung aus dem Preisrechner",
    estimateTotal: "Geschätzter Gesamtbetrag",
    project: "Genanntes Konzept",
    reference: "Referenz",
    replyHint: "Antworten Sie auf diese E-Mail, um dem Absender direkt zu schreiben.",
    customerLanguage: "Sprache des Kunden",
    languageNames: { sq: "Albanisch", en: "Englisch", de: "Deutsch" },
  },
} satisfies Dictionary["contactPage"];
