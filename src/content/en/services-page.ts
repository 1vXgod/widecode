import type { Dictionary } from "@/types/content";

export const servicesPage = {
  intro: {
    eyebrow: "Services",
    title: "Websites and digital solutions, built to order",
    lead: "We build presentation and business websites, online shops and custom web applications for businesses in Kosovo and beyond. Every project starts from your needs and is built from scratch.",
    primaryCta: "Get a quote",
    secondaryCta: "View pricing",
  },
  onThisPage: "On this page",
  idealForLabel: "Ideal for",
  includesLabel: "What's included",
  packagesLabel: "Matching packages",
  quoteCta: "Get a quote",
  details: {
    presentation: {
      description:
        "A presentation website is the quickest way to present yourself professionally online. On a single page or in a few sections, visitors learn who you are, what you offer and how to contact you.",
      idealFor: [
        "New businesses and freelancers",
        "Launching a new product or service",
        "Businesses that want a simple online presence, quickly",
      ],
      includes: [
        "Modern, responsive design for phones, tablets and computers",
        "Sections for your introduction, services and contact details",
        "Contact form",
        "Basic SEO",
      ],
    },
    business: {
      description:
        "For businesses with more to tell: different services, projects or detailed information. The content is split across several pages, so your customers quickly find what they are looking for.",
      idealFor: [
        "Businesses with several services or products",
        "Companies that want to build credibility online",
        "Businesses that want a more complete online presence",
      ],
      includes: [
        "Several pages, structured around your needs",
        "Custom design that matches your brand identity",
        "Contact form and map",
        "Social media links",
        "Basic SEO",
      ],
    },
    ecommerce: {
      description:
        "An online shop lets you sell your products at any time. We build a clear catalog, a simple cart and a checkout that works well on phones too.",
      idealFor: [
        "Physical stores that also want to sell online",
        "Local brands and producers",
        "Businesses selling products with variants, such as sizes or colors",
      ],
      includes: [
        "Product catalog with categories",
        "Cart and checkout",
        "Product and order management",
        "Shopping experience designed for phones",
      ],
    },
    platform: {
      description:
        "When your needs go beyond a website, we build custom web applications: booking systems, management dashboards, customer portals and other solutions built around your business processes.",
      idealFor: [
        "Businesses with specific processes they want to digitize",
        "Ideas for online products or services",
        "Companies that need integrations with existing systems",
      ],
      includes: [
        "Requirements analysis and planning",
        "Interface and user experience design",
        "Development of custom features",
        "Integrations with external services and systems",
      ],
    },
  },
  standards: {
    eyebrow: "Our standard",
    title: "What every project includes",
    description: "Whatever the package, every website we build follows the same quality standards.",
    items: {
      responsive: {
        title: "Responsive",
        text: "A design that adapts to phones, tablets and computers.",
      },
      seo: {
        title: "Basic SEO",
        text: "A clean page structure, titles and descriptions that help search engines.",
      },
      performance: {
        title: "Performance",
        text: "Optimized images and code, so the site loads quickly.",
      },
      accessibility: {
        title: "Accessibility",
        text: "Good contrast, keyboard navigation and a clear structure for all users.",
      },
      security: {
        title: "Security",
        text: "A secure connection (HTTPS) and validation of the data sent through forms.",
      },
      custom: {
        title: "Custom code",
        text: "No ready-made templates: every project is built around your needs.",
      },
    },
  },
  process: {
    title: "What does the process look like?",
    text: "From the first conversation to launch, every step is clear and agreed with you.",
    cta: "See the process",
  },
} satisfies Dictionary["servicesPage"];
