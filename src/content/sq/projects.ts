import type { Dictionary } from "@/types/content";

export const projects = {
  eyebrow: "Projektet",
  title: "Projekte demonstruese",
  description:
    "Këto projekte janë krijuar nga WideCode si shembuj për të treguar stilin dhe mundësitë tona. Nuk janë punë për klientë realë.",
  demoBadge: "Projekt demonstrues",
  categories: {
    business: "Website biznesi",
    ecommerce: "Online Shop",
    platform: "Web aplikacion",
  },
  items: {
    "restorant-tradicional": {
      title: "Restorant tradicional",
      summary: "Website me menu, galeri dhe kërkesë për rezervim, i menduar për t'u përdorur lehtë nga celulari.",
      tags: ["Menu online", "Rezervime", "Celular"],
    },
    "dyqan-veshjesh": {
      title: "Online shop për veshje",
      summary: "Katalog produktesh me filtra, shportë dhe një proces të thjeshtë porosie.",
      tags: ["Katalog", "Shportë", "Filtra"],
    },
    "panel-palestre": {
      title: "Panel për palestër",
      summary: "Platformë për menaxhimin e anëtarëve, anëtarësimeve dhe orareve të stërvitjeve.",
      tags: ["Panel", "Orare", "Anëtarë"],
    },
  },
  previewLabel: "Pamje ilustruese e projektit",
  cta: "Shiko të gjitha projektet",
} satisfies Dictionary["projects"];
