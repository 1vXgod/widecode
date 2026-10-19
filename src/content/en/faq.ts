import type { Dictionary } from "@/types/content";

export const faq = {
  eyebrow: "Questions",
  title: "Frequently asked questions",
  description: "Short answers to the most common questions about projects and our process.",
  items: [
    {
      question: "How much does a website cost?",
      answer:
        "Our packages start from {price}. The final price depends on the number of pages, the features, the content and the integrations you need.",
    },
    {
      question: "Why are the prices called starting prices?",
      answer:
        "Every project is different. The published prices are indicative starting points; after our initial conversation we send you an exact quote for your project.",
    },
    {
      question: "How long does it take to build a website?",
      answer:
        "It depends on the size and complexity of the project. We agree on the exact timeline together and put it in the quote.",
    },
    {
      question: "Will the website work on phones?",
      answer: "Yes. Every website we build is designed and tested for phones, tablets and computers.",
    },
    {
      question: "How do we get started?",
      answer:
        "Write to us through the contact page with a few details about your project. We will reply with follow-up questions or a quote, with no obligation.",
    },
  ],
  viewAll: "View all questions",
} satisfies Dictionary["faq"];
