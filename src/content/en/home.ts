import type { Dictionary } from "@/types/content";

export const home = {
  hero: {
    eyebrow: "Web development from Kosovo",
    title: "A professional website that works for",
    titleHighlight: "your business",
    lead: "We build custom websites and online shops — fast, secure and responsive on every device, with clear pricing from the start.",
    primaryCta: "Get a quote",
    secondaryCta: "View projects",
    priceNote: "Starting prices from {price}",
    noObligation: "No-obligation quote",
  },
  showcase: {
    label: "Interactive example: how a website is built, from design to launch",
    tabs: {
      design: "Design",
      code: "Code",
      live: "Live",
    },
    pause: "Pause automatic switching",
    play: "Resume automatic switching",
    url: "your-business",
    mock: {
      brand: "Your business",
      nav: ["Services", "About us", "Contact"],
      title: "Welcome",
      text: "Quality services for our customers.",
      cta: "Contact us",
      cards: ["Services", "Projects", "Contact"],
      liveBadge: "Ready to launch",
    },
    wireframe: {
      header: "Navigation",
      hero: "Main section",
      cards: "Cards",
    },
  },
} satisfies Dictionary["home"];

export const processCopy = {
  eyebrow: "Process",
  title: "How we work",
  description: "A clear five-step process, so you always know which stage your project is at.",
  steps: [
    {
      title: "Initial conversation",
      text: "Tell us about your business, your goals and what you need from your website.",
    },
    {
      title: "Quote and plan",
      text: "We send you a clear quote with the price, the timeline and everything that is included.",
    },
    {
      title: "Design",
      text: "We create the design and refine it together with you before development starts.",
    },
    {
      title: "Development",
      text: "We build the site with custom code, fast and responsive on every device.",
    },
    {
      title: "Testing and launch",
      text: "We test it on different devices and launch it once you are happy with it.",
    },
  ],
} satisfies Dictionary["process"];

export const why = {
  eyebrow: "Why WideCode",
  title: "A clear partner for your website",
  description: "We don't promise miracles. We promise careful work, open communication and clear pricing.",
  items: {
    transparent: {
      title: "Transparent pricing",
      text: "Our starting prices are public. Before we start, you know exactly what the quote includes.",
    },
    custom: {
      title: "Built to order",
      text: "Every website is designed and built for your business, not from ready-made templates.",
    },
    devices: {
      title: "For every device",
      text: "Every website we build adapts to phones, tablets and computers.",
    },
    communication: {
      title: "Direct communication",
      text: "You talk directly to us throughout the project, with no middlemen.",
    },
  },
} satisfies Dictionary["why"];

export const cta = {
  title: "Ready to start your project?",
  text: "Tell us what you have in mind and we will prepare a clear quote for you, with no obligation.",
  primary: "Get a quote",
  secondary: "Calculate the price",
} satisfies Dictionary["cta"];
