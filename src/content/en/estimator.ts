import type { Dictionary } from "@/types/content";

export const estimator = {
  intro: {
    eyebrow: "Calculator",
    title: "Calculate the price of your project",
    lead: "Choose the type of project and the features you need. The indicative estimate updates instantly, with no obligation.",
  },
  formLabel: "Price calculator",
  steps: {
    package: "Type of project",
    pages: "Number of pages",
    addOns: "Extra features",
  },
  pagesHelp: "{count} pages are included in the package. Each extra page: {price}.",
  pagesFixed: "Starter is a one-page website. For more pages, choose Business or Professional.",
  pagesNotApplicable: "For this type of project, the number of pages is defined during the requirements analysis.",
  pagesInputLabel: "Number of pages",
  decreasePages: "Decrease the number of pages",
  increasePages: "Increase the number of pages",
  addOnsNone: "We define the features for this project together during the analysis.",
  addOnState: {
    included: "Included",
    price: "+{price}",
  },
  addOns: {
    multilingual: {
      label: "Website in two languages",
      description: "Content in two languages, for example Albanian and English.",
    },
    blog: {
      label: "Blog / news",
      description: "A section for articles, news or announcements.",
    },
    booking: {
      label: "Bookings or appointments",
      description: "A form for bookings or for scheduling appointments.",
    },
    analytics: {
      label: "Analytics",
      description: "Statistics about visitors and how the website is used.",
    },
    payments: {
      label: "Online payments",
      description: "Card payments in the online shop. Transaction fees charged by the payment provider are not included.",
    },
  },
  summary: {
    title: "Your estimate",
    base: "{name} package",
    extraPages: "{count} extra pages × {price}",
    total: "Indicative estimate",
    quoteOnly: "On request",
    quoteOnlyText: "We don't give an upfront price for Custom Development. We prepare a quote once we have analyzed your requirements.",
    disclaimer:
      "This is an indicative estimate for standard implementations, not a final quote. Complex requirements may need a separate quote. We confirm the price only after reviewing the requirements of your project.",
    thirdParty:
      "Third-party fees, such as payment providers' transaction fees or subscriptions to external services, are not included in the price.",
    cta: "Request a quote with this estimate",
    quoteCta: "Request a quote",
    reset: "Start over",
    announce: "Indicative estimate updated: {total}",
    announceQuote: "For this project we prepare a quote after analyzing the requirements.",
  },
} satisfies Dictionary["estimator"];
