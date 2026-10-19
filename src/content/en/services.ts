import type { Dictionary } from "@/types/content";

export const services = {
  eyebrow: "Services",
  title: "What we build for your business",
  description:
    "From a simple presentation website to an online shop and custom development — every project is built around your needs.",
  items: {
    presentation: {
      title: "Presentation website",
      summary: "A clear, modern website that presents your business, your services and how to reach you.",
      points: ["Ideal for new businesses", "Responsive design for phones", "Contact form"],
    },
    business: {
      title: "Business website",
      summary: "A multi-page website for businesses that want to present their services in detail.",
      points: ["Several structured pages", "Basic SEO", "Map and social media links"],
    },
    ecommerce: {
      title: "Online Shop",
      summary: "Sell your products online with a catalog, a shopping cart and order management.",
      points: ["Product catalog", "Cart and checkout", "Product management"],
    },
    platform: {
      title: "Custom Development",
      summary: "Web applications and systems built around the specific needs of your business.",
      points: ["Requirements analysis", "Custom features", "Integrations with other systems"],
    },
  },
  cta: "View all services",
} satisfies Dictionary["services"];
