import type { Dictionary } from "@/types/content";
import { faq } from "./faq";

const [cost, startingPrices, duration, mobile, start] = faq.items as [
  (typeof faq.items)[number],
  (typeof faq.items)[number],
  (typeof faq.items)[number],
  (typeof faq.items)[number],
  (typeof faq.items)[number],
];

/**
 * The full FAQ page. As in Albanian, the questions shown on other pages
 * (src/content/en/faq.ts) are reused here word for word. Answers may use
 * {price}, {multilingualPrice} and {ecommercePrice} (see src/lib/faq.ts).
 * Payment terms, domain/hosting and changes after launch are only described
 * as agreed in the quote: no terms are promised here.
 */
export const faqPage = {
  intro: {
    eyebrow: "FAQ",
    title: "Questions and answers",
    lead: "Everything you need to know about pricing, our process and your website, in one place. If you can't find your answer, write to us.",
  },
  onThisPage: "Topics",
  categories: {
    cmimet: {
      title: "Pricing and quotes",
      items: [
        cost,
        startingPrices,
        {
          question: "How can I calculate the price of my project?",
          answer:
            "Use the price calculator: choose a package, the number of pages and extra features, and you instantly see an indicative estimate. You can send the estimate along with your quote request.",
        },
        {
          question: "Why doesn't Custom Development have a starting price?",
          answer:
            "Custom platforms and web applications vary a lot from one to another. That's why we don't give an upfront price: we prepare a quote once we have analyzed your requirements.",
        },
        {
          question: "What is not included in the price?",
          answer:
            "Third-party fees, such as payment providers' transaction fees or subscriptions to external services, are not included in the price.",
        },
        {
          question: "Does requesting a quote commit me to anything?",
          answer: "No. We send you the quote and you are free to decide whether to go ahead.",
        },
        {
          question: "How does payment work?",
          answer: "We set out the payment terms clearly in the quote, before any work begins.",
        },
      ],
    },
    procesi: {
      title: "Process and timelines",
      items: [
        start,
        {
          question: "What does the process look like?",
          answer:
            "We work in five steps: initial conversation, quote and plan, design, development, then testing and launch. That way you always know which stage your project is at.",
        },
        duration,
        {
          question: "Can I see the design before development starts?",
          answer: "Yes. We create the design and refine it together with you before development begins.",
        },
        {
          question: "What should I prepare before we start?",
          answer:
            "A clear idea of your business and your goals is enough. If you have them, your logo, texts, photos and examples of websites you like are helpful.",
        },
      ],
    },
    website: {
      title: "Your website and its features",
      items: [
        mobile,
        {
          question: "Is SEO included?",
          answer:
            "Yes, basic SEO is included in every project: a clean page structure, titles and descriptions that help search engines, and pages that load quickly.",
        },
        {
          question: "Can my website be in two languages?",
          answer:
            "Yes. A website in two languages, for example Albanian and English, is an extra feature with an indicative price of {multilingualPrice}.",
        },
        {
          question: "Can I sell products online?",
          answer:
            "Yes. The E-commerce package starts from {ecommercePrice} and includes a product catalog, a cart and checkout. Card payments are an extra feature; the payment provider's fees are not included.",
        },
        {
          question: "Do you also build custom web applications?",
          answer:
            "Yes. Through Custom Development we build platforms and web applications with specific requirements, custom features and integrations.",
        },
      ],
    },
    "pas-publikimit": {
      title: "After launch",
      items: [
        {
          question: "Who takes care of the domain and hosting?",
          answer:
            "We discuss the domain and hosting in our initial conversation and set out clearly in the quote how they will be managed.",
        },
        {
          question: "Can I make changes after launch?",
          answer: "Yes. For changes or improvements after launch, write to us and we will send you a quote for them.",
        },
      ],
    },
  },
} satisfies Dictionary["faqPage"];
