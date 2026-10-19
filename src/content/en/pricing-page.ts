import type { Dictionary } from "@/types/content";

export const pricingPage = {
  intro: {
    eyebrow: "Pricing",
    title: "Packages with transparent pricing",
    lead: "Choose the starting point that fits your project. All prices are indicative starting prices; we confirm the final price once we have reviewed your requirements.",
    primaryCta: "Calculate the price",
    secondaryCta: "Get a quote",
  },
  packages: {
    eyebrow: "Packages",
    title: "Choose your starting point",
    description: "Every package includes responsive design and basic SEO. You can extend it with extra features as needed.",
    estimateCta: "Calculate with this package",
  },
  addOns: {
    eyebrow: "Add-ons",
    title: "Extra features",
    description:
      "Indicative prices for standard implementations of features you can add to your project. The calculator uses the same prices.",
    extraPage: "Extra page",
    extraPageNote: "For pages beyond the number included in the package",
    includedPages: "{name} {count} pages",
    perPage: "{price} / page",
    includedIn: "Included in {packages}",
    availableFor: "For {packages}",
  },
  factors: {
    eyebrow: "How the price is set",
    title: "What affects the final price",
    description: "Package prices are starting points. The final quote is based on these factors.",
    items: {
      scope: {
        title: "Project scope",
        text: "How many pages and sections are needed and how broad the solution is.",
      },
      features: {
        title: "Features",
        text: "Bookings, online payments, several languages or custom functionality.",
      },
      content: {
        title: "Content",
        text: "Whether the texts and photos are ready or still need to be prepared.",
      },
      integrations: {
        title: "Integrations",
        text: "Connections to external systems, such as payments or the software you use.",
      },
      complexity: {
        title: "Complexity",
        text: "Specific requirements for the design and for your business logic.",
      },
    },
  },
  estimatorCta: {
    title: "Not sure which package to choose?",
    text: "Use the calculator for an indicative estimate in a few steps, with no obligation.",
    cta: "Open the calculator",
  },
} satisfies Dictionary["pricingPage"];
