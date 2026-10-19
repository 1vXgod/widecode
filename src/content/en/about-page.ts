import type { Dictionary } from "@/types/content";

/**
 * About page copy. Same rule as the Albanian original: mission, approach and
 * services only; no founding year, team, clients, statistics or achievements
 * unless the owner provides and confirms them. No languages of communication
 * are promised beyond what the owner has confirmed (Albanian).
 */
export const aboutPage = {
  intro: {
    eyebrow: "About us",
    title: "We build websites with care, clarity and fair pricing",
    lead: "WideCode is a web development company that builds custom websites, online shops and web applications. Our focus is on businesses in Kosovo, and we also welcome projects from clients abroad.",
    primaryCta: "Get a quote",
    secondaryCta: "View services",
  },
  mission: {
    eyebrow: "Mission",
    title: "A professional online presence for every business",
    paragraphs: [
      "We believe every business, small or large, deserves a website that looks professional, works well on every device and presents what it offers accurately.",
      "That's why we publish our starting prices, explain clearly what every quote includes and build each project around the client's real needs, without ready-made templates and without vague promises.",
    ],
    statement: "Our goal is simple: websites that work for you and your customers.",
  },
  values: {
    eyebrow: "Our values",
    title: "How we approach our work",
    description: "The principles behind every project, from the first conversation to launch.",
    items: {
      transparency: {
        title: "Transparency",
        text: "Public starting prices and clear quotes, so you know from the start what is included.",
      },
      quality: {
        title: "Quality in the details",
        text: "We care about design, speed and accessibility, not just about looks.",
      },
      custom: {
        title: "Custom solutions",
        text: "Every project is built for your business, not from ready-made templates.",
      },
      communication: {
        title: "Clear communication",
        text: "We explain things simply and keep you informed at every stage.",
      },
      honesty: {
        title: "Honesty",
        text: "We tell you clearly what we can do, what it costs and how long it takes, without overpromising.",
      },
      partnership: {
        title: "Collaboration",
        text: "We make the key decisions about your project together with you.",
      },
    },
  },
  services: {
    eyebrow: "What we do",
    title: "Our services",
    description: "Four kinds of projects, all built to the same quality standard.",
    cta: "See service details",
  },
  market: {
    title: "Our market",
    text: "Our main focus is businesses in Kosovo. At the same time, we are open to projects with clients from the region and beyond.",
  },
} satisfies Dictionary["aboutPage"];
