import type { Dictionary } from "@/types/content";

export const services = {
  eyebrow: "Shërbimet",
  title: "Çfarë ndërtojmë për biznesin tuaj",
  description:
    "Nga një faqe e thjeshtë prezantuese deri te dyqanet online dhe platformat me porosi — çdo projekt ndërtohet sipas nevojave tuaja.",
  items: {
    presentation: {
      title: "Uebfaqe prezantuese",
      summary: "Një faqe e qartë dhe moderne që prezanton biznesin, shërbimet dhe kontaktin tuaj.",
      points: ["Ideale për biznese të reja", "Dizajn i përshtatur për celular", "Formular kontakti"],
    },
    business: {
      title: "Uebfaqe biznesi",
      summary: "Uebfaqe me disa faqe për bizneset që duan t'i paraqesin shërbimet në detaje.",
      points: ["Disa faqe të strukturuara", "Optimizim bazë për motorët e kërkimit", "Hartë dhe lidhje me rrjetet sociale"],
    },
    ecommerce: {
      title: "Dyqane online",
      summary: "Shitni produktet tuaja online me katalog, shportë dhe menaxhim të porosive.",
      points: ["Katalog produktesh", "Shportë dhe porosi", "Menaxhim i produkteve"],
    },
    platform: {
      title: "Platforma me porosi",
      summary: "Aplikacione ueb dhe sisteme të ndërtuara sipas nevojave specifike të biznesit tuaj.",
      points: ["Analizë e kërkesave", "Funksionalitete me porosi", "Integrime me sisteme të tjera"],
    },
  },
  cta: "Shiko të gjitha shërbimet",
} satisfies Dictionary["services"];
