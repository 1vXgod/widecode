import type { Dictionary } from "@/types/content";

/** Package copy. Prices themselves live in src/config/pricing.ts. */
export const pricing = {
  eyebrow: "Çmimet",
  title: "Çmime të qarta që në fillim",
  description:
    "Paketa me çmime fillestare transparente. Zgjidhni pikënisjen dhe ne e përshtatim ofertën sipas projektit tuaj.",
  from: "nga",
  customPrice: "Me ofertë",
  recommended: "E rekomanduar",
  packageCta: "Zgjidh paketën",
  customCta: "Kërko ofertë",
  viewAll: "Shiko detajet e paketave",
  disclaimer:
    "Të gjitha çmimet janë fillestare dhe orientuese, jo oferta përfundimtare. Çmimi përfundimtar varet nga qëllimi i projektit, funksionalitetet, përmbajtja, integrimet dhe kompleksiteti.",
  packages: {
    starter: {
      name: "Starter",
      summary: "Për biznese që duan një prani të thjeshtë dhe profesionale online.",
      features: [
        "Uebfaqe njëfaqëshe",
        "Dizajn i përshtatur për çdo pajisje",
        "Formular kontakti",
        "Optimizim bazë për motorët e kërkimit",
      ],
    },
    business: {
      name: "Biznes",
      summary: "Për bizneset që duan t'i prezantojnë shërbimet në disa faqe.",
      features: [
        "Deri në 5 faqe",
        "Dizajn me porosi",
        "Formular kontakti dhe hartë",
        "Optimizim bazë për motorët e kërkimit",
      ],
    },
    professional: {
      name: "Profesional",
      summary: "Për projekte me më shumë përmbajtje dhe funksionalitete.",
      features: [
        "Deri në 10 faqe",
        "Animacione dhe detaje të avancuara",
        "Blog ose seksion lajmesh",
        "Integrim me analitikë",
      ],
    },
    ecommerce: {
      name: "E-commerce",
      summary: "Për shitjen e produkteve tuaja online.",
      features: [
        "Katalog produktesh",
        "Shportë dhe porosi",
        "Menaxhim i produkteve dhe porosive",
        "Përvojë blerjeje e përshtatur për celular",
      ],
    },
    custom: {
      name: "Platformë me porosi",
      summary: "Për platforma dhe aplikacione ueb me kërkesa specifike.",
      features: ["Analizë e detajuar e kërkesave", "Funksionalitete me porosi", "Integrime me sisteme të jashtme"],
    },
  },
} satisfies Dictionary["pricing"];
