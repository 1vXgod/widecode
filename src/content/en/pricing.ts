import type { Dictionary } from "@/types/content";

/** Package copy. Prices themselves live in src/config/pricing.ts. */
export const pricing = {
  eyebrow: "Pricing",
  title: "Clear pricing from the start",
  description:
    "Packages with transparent starting prices. Choose your starting point and we tailor the quote to your project.",
  from: "from",
  customPrice: "On request",
  recommended: "Recommended",
  packageCta: "Choose package",
  customCta: "Request a quote",
  viewAll: "See package details",
  disclaimer:
    "All prices are indicative starting prices, not final quotes. The final price depends on the project's scope, features, content, integrations and complexity.",
  packages: {
    starter: {
      name: "Starter",
      summary: "For businesses that want a simple, professional online presence.",
      features: ["One-page website", "Responsive design for every device", "Contact form", "Basic SEO"],
    },
    business: {
      name: "Business",
      summary: "For businesses that want to present their services across several pages.",
      features: ["Up to 5 pages", "Custom design", "Contact form and map", "Basic SEO"],
    },
    professional: {
      name: "Professional",
      summary: "For projects with more content and features.",
      features: ["Up to 10 pages", "Animations and advanced details", "Blog or news section", "Analytics integration"],
    },
    ecommerce: {
      name: "E-commerce",
      summary: "For selling your products online.",
      features: [
        "Product catalog",
        "Cart and checkout",
        "Product and order management",
        "Shopping experience designed for phones",
      ],
    },
    custom: {
      name: "Custom",
      summary: "For platforms and web applications with specific requirements.",
      features: ["Detailed requirements analysis", "Custom features", "Integrations with external systems"],
    },
  },
} satisfies Dictionary["pricing"];
