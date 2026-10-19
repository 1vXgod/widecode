import type { Dictionary } from "@/types/content";

export const contactPage = {
  intro: {
    eyebrow: "Request a quote",
    title: "Tell us about your project",
    lead: "Fill in the form with a few details and we will send you a clear quote with the price, the timeline and everything that is included, with no obligation.",
  },
  form: {
    label: "Quote request",
    requiredNote: "All fields are required, except those marked as optional.",
    optional: "optional",
    sections: {
      contact: "Your details",
      project: "The project",
    },
    fields: {
      name: { label: "Full name" },
      business: { label: "Business name", hint: "If the project is for a business or an organization." },
      email: { label: "Email", hint: "We will send our reply and the quote here." },
      phone: { label: "Phone number", hint: "If you would prefer a call. Include the country code, e.g. +383 4X XXX XXX." },
      projectType: { label: "Type of project" },
      packageId: {
        label: "Package",
        hint: "Not sure? Choose “Not sure yet” and we will help you pick the right package.",
      },
      budget: { label: "Approximate budget" },
      timeline: { label: "Desired timeline" },
      description: {
        label: "Project description",
        hint: "What your business does, what the website should include and, if you have any, examples of websites you like.",
      },
    },
    selectPlaceholder: "Choose…",
    options: {
      projectType: {
        presentation: "Presentation website",
        business: "Business website",
        ecommerce: "Online shop",
        platform: "Custom development / web application",
        other: "Something else",
      },
      packageUnsure: "Not sure yet",
      budget: {
        "under-300": "Up to €300",
        "300-600": "€300–600",
        "600-1000": "€600–1,000",
        "1000-2000": "€1,000–2,000",
        "over-2000": "Over €2,000",
        unsure: "Not sure yet",
      },
      timeline: {
        asap: "As soon as possible",
        "within-month": "Within a month",
        "one-to-three-months": "Within 1–3 months",
        flexible: "I'm flexible",
      },
    },
    characterCount: "{count} / {max} characters",
    prefillNotice: "Some fields were filled in based on your choices. Feel free to change them.",
    estimate: {
      title: "Your estimate from the calculator",
      text: "This indicative estimate is sent along with your request. We confirm the final price in the quote.",
      edit: "Change the estimate",
      remove: "Remove the estimate",
      pages: "Number of pages",
      pagesValue: "{count} pages",
      pagesWithIncluded: "{count} pages ({included} included in the package)",
      includedFeatures: "Included in the package",
    },
    project: {
      title: "The concept you were interested in",
      remove: "Remove the concept",
    },
    submit: "Send request",
    submitting: "Sending…",
    privacy: "Your details are only used to respond to this request.",
    honeypotLabel: "Do not fill in this field",
  },
  errors: {
    summaryOne: "Please correct 1 field:",
    summaryMany: "Please correct {count} fields:",
    fields: {
      name: {
        required: "Enter your name.",
        tooShort: "Your name must have at least 2 letters.",
        tooLong: "Your name can be up to 100 characters long.",
      },
      business: {
        tooLong: "The business name can be up to 120 characters long.",
      },
      email: {
        required: "Enter your email address.",
        invalid: "Enter a valid email address, e.g. name@domain.com.",
      },
      phone: {
        invalid: "Enter a valid phone number, e.g. +383 4X XXX XXX, or leave it empty.",
      },
      projectType: { required: "Choose the type of project." },
      packageId: { required: "Choose a package or “Not sure yet”." },
      budget: { required: "Choose an approximate budget or “Not sure yet”." },
      timeline: { required: "Choose your desired timeline." },
      description: {
        required: "Briefly describe your project.",
        tooShort: "Write at least 20 characters, so we can understand your project better.",
        tooLong: "The description can be up to 5,000 characters long.",
      },
    },
  },
  status: {
    unavailableNotice: {
      title: "The form is temporarily unavailable",
      text: "We can't accept requests through the website at the moment. Please try again later. In the meantime, you can look at our packages and pricing or calculate an indicative estimate for your project.",
    },
    invalid: "Some fields are not filled in correctly. Please check the messages next to the fields.",
    rateLimited: "You have sent several requests within a short time. Please try again in {time}.",
    minuteOne: "1 minute",
    minuteMany: "{count} minutes",
    tooFast: "The form was sent too quickly after it was opened. Please check your details and try again.",
    rejected: "The request could not be accepted. Please refresh the page and try again.",
    unavailable:
      "Your request was not sent because the form is temporarily unavailable. Your details are still in the form. Please try again later.",
    failed:
      "Your request was not sent because of a technical problem. Your details are still in the form, so you can try again in a moment.",
    network:
      "We couldn't reach the server. Please check your internet connection and try again. Your details are still in the form.",
  },
  success: {
    title: "Thank you, your request has been sent!",
    text: "We have received your quote request. We will review it carefully and reply to you at {email}.",
    summaryTitle: "Request summary",
    again: "Send another request",
    projects: "View projects",
  },
  aside: {
    nextTitle: "What happens after you send it",
    steps: [
      {
        title: "We review your request",
        text: "We read your description and your choices carefully.",
      },
      {
        title: "We get in touch",
        text: "If we need more details, we write to you with a few short questions.",
      },
      {
        title: "You receive the quote",
        text: "We send you a clear quote with the price, the timeline and everything that is included, with no obligation.",
      },
    ],
    priceTitle: "Not sure about the price?",
    priceText: "Calculate an indicative estimate or look at the packages and their starting prices.",
    estimatorCta: "Calculate the price",
    pricingCta: "View pricing",
    contactTitle: "Contact us directly",
  },
  /**
   * The notification email goes to WideCode and is always written in Albanian
   * (src/content/sq/contact-page.ts); this English version only completes the type.
   */
  email: {
    subject: "Quote request: {name} – {projectType}",
    heading: "New quote request",
    intro: "This request was sent through the contact form on the WideCode website.",
    notProvided: "Not provided",
    estimateTitle: "Indicative estimate from the calculator",
    estimateTotal: "Indicative total",
    project: "Referenced concept",
    reference: "Reference",
    replyHint: "Reply to this email to write directly to the sender.",
    customerLanguage: "Customer's language",
    languageNames: { sq: "Albanian", en: "English", de: "German" },
  },
} satisfies Dictionary["contactPage"];
