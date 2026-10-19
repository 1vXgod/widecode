import type { Dictionary } from "@/types/content";

/**
 * Portfolio copy. Every project is a website CONCEPT designed by WideCode
 * (fictional brands), not client work: present it as a concept, describe what
 * it shows and aims to do, and never invent clients, results or testimonials.
 * The previews themselves stay in Albanian (src/content/sq/concepts.ts): they
 * show websites for fictional businesses in Kosovo.
 */
export const projects = {
  eyebrow: "Projects",
  title: "Website concepts",
  description:
    "Concepts designed by WideCode for different kinds of businesses, from a presentation website to a web application.",
  conceptLabel: "Website concept",
  categories: {
    presentation: "Presentation website",
    business: "Business website",
    ecommerce: "Online Shop",
    platform: "Web application",
  },
  items: {
    "studio-fotografie": {
      title: "Photography studio",
      summary: "A one-page website for a photographer, with a gallery, services and contact details.",
      tags: ["One-page", "Gallery", "Contact"],
      concept:
        "A concept for a photographer or studio that wants to present its work on a single, fast and visual page.",
      goals: [
        "Put the visual work front and center",
        "Make it easy to get in touch from a phone",
        "Load quickly, even with many photos",
      ],
      features: ["Gallery optimized for photography", "Services section", "Contact form", "Responsive design"],
      sections: ["Introduction", "Gallery", "Services", "Contact"],
    },
    "restorant-tradicional": {
      title: "Traditional restaurant",
      summary: "A website with a menu, a gallery and booking requests, designed to be easy to use on a phone.",
      tags: ["Online menu", "Bookings", "Mobile"],
      concept:
        "A concept for a restaurant that wants to present its menu and atmosphere and accept booking requests online.",
      goals: [
        "Make the menu easy to read on a phone",
        "Let guests send booking requests without calling",
        "Show the atmosphere with photos",
      ],
      features: ["Online menu with categories", "Booking request form", "Gallery of the venue", "Map and opening hours"],
      sections: ["Home", "Menu", "Gallery", "Book a table", "Contact"],
    },
    "klinike-dentare": {
      title: "Dental clinic",
      summary: "A business website with services, information for patients and appointment requests.",
      tags: ["Services", "Appointments", "Basic SEO"],
      concept:
        "A concept for a clinic that wants to inform patients about its services and let them request an appointment online.",
      goals: [
        "Explain the services clearly",
        "Make requesting an appointment simple",
        "Build trust from the very first visit",
      ],
      features: ["A page for each service", "Appointment request form", "Practical information for patients", "Basic SEO"],
      sections: ["Home", "Services", "About the clinic", "Appointments", "Contact"],
    },
    "dyqan-veshjesh": {
      title: "Clothing online shop",
      summary: "A product catalog with filters, a cart and a simple checkout.",
      tags: ["Catalog", "Cart", "Filters"],
      concept:
        "A concept for a clothing brand that wants to sell its products online, with a focus on quick shopping from a phone.",
      goals: [
        "Help shoppers find products quickly with filters",
        "Complete a purchase in just a few steps",
        "Work well on phones",
      ],
      features: [
        "Catalog with categories and filters",
        "Product variants, such as size and color",
        "Cart and checkout",
        "Product and order management",
      ],
      sections: ["Home", "Catalog", "Product", "Cart", "Checkout"],
    },
    "produkte-vendore": {
      title: "Local products online shop",
      summary: "An online shop for local producers, with the story behind each product and a simple checkout.",
      tags: ["Catalog", "Product story", "Ordering"],
      concept:
        "A concept for a local producer, for example of honey or farm products, that wants to sell directly to customers online.",
      goals: [
        "Show where the products come from and their quality",
        "Make ordering simple for customers of any age",
        "Build trust with new customers",
      ],
      features: [
        "Product pages with the product's story and photos",
        "Cart and checkout",
        "Online payments as an optional add-on",
        "Responsive design",
      ],
      sections: ["Home", "Products", "About us", "Checkout"],
    },
    "panel-palestre": {
      title: "Gym dashboard",
      summary: "A web application for managing members, memberships and class schedules.",
      tags: ["Dashboard", "Schedules", "Members"],
      concept:
        "A concept for a gym that wants to manage its members, memberships and class schedules in one place.",
      goals: [
        "Save time on administrative work",
        "Give members a clear overview of the schedule",
        "Make it easy to keep track of expiring memberships",
      ],
      features: ["Dashboard with a member overview", "Membership management", "Class schedule", "Different user roles"],
      sections: ["Dashboard", "Members", "Memberships", "Schedule"],
    },
  },
  desktopPreviewLabel: "Home page of the {title} concept, on a computer",
  mobilePreviewLabel: "Home page of the {title} concept, on a phone",
  cta: "View all projects",
} satisfies Dictionary["projects"];
