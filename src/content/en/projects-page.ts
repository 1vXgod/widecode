import type { Dictionary } from "@/types/content";

export const projectsPage = {
  intro: {
    eyebrow: "Projects",
    title: "Website concepts",
    lead: "Concepts designed by WideCode for different kinds of businesses. Each one shows the style, quality and features we can build for you.",
    primaryCta: "Get a quote",
    secondaryCta: "Calculate the price",
  },
  filter: {
    label: "Filter projects by category",
    all: "All",
    resultsOne: "Showing {count} project",
    resultsMany: "Showing {count} projects",
    empty: "There are no projects in this category.",
  },
  cardCta: "View project",
  detail: {
    back: "All projects",
    conceptTitle: "The concept",
    goalsTitle: "Goals of the concept",
    featuresTitle: "Features",
    sectionsTitle: "Pages and sections",
    serviceLabel: "Service",
    packageLabel: "Matching package",
    ctaTitle: "Want something similar?",
    ctaText: "Tell us about your project and we will prepare a quote for you, with no obligation.",
    quoteCta: "Get a quote for a similar project",
    estimateCta: "Calculate the price",
    relatedTitle: "Other concepts",
    metaTitle: "{title} – website concept",
    metaDescription: "{summary} A website concept by WideCode.",
  },
} satisfies Dictionary["projectsPage"];
