import type { Dictionary } from "@/types/content";

export const services = {
  eyebrow: "Shërbimet",
  title: "Çfarë ndërtojmë për biznesin tuaj",
  description:
    "Nga një website i thjeshtë prezantues deri te online shop dhe custom development — çdo projekt ndërtohet sipas nevojave tuaja.",
  items: {
    presentation: {
      title: "Website prezantues",
      summary: "Një website i qartë dhe modern që prezanton biznesin, shërbimet dhe kontaktin tuaj.",
      points: ["Ideale për biznese të reja", "Dizajn responsive për celular", "Formular kontakti"],
    },
    business: {
      title: "Website biznesi",
      summary: "Website me disa faqe për bizneset që duan t'i paraqesin shërbimet në detaje.",
      points: ["Disa faqe të strukturuara", "SEO bazë", "Hartë dhe lidhje me rrjetet sociale"],
    },
    ecommerce: {
      title: "Online Shop",
      summary: "Shitni produktet tuaja online me katalog, shportë dhe menaxhim të porosive.",
      points: ["Katalog produktesh", "Shportë dhe porosi", "Menaxhim i produkteve"],
    },
    platform: {
      title: "Custom Development",
      summary: "Aplikacione web dhe sisteme të ndërtuara sipas nevojave specifike të biznesit tuaj.",
      points: ["Analizë e kërkesave", "Funksionalitete me porosi", "Integrime me sisteme të tjera"],
    },
  },
  cta: "Shiko të gjitha shërbimet",
} satisfies Dictionary["services"];
