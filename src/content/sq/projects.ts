import type { Dictionary } from "@/types/content";

/**
 * Portfolio copy. Every project is a website CONCEPT designed by WideCode
 * (fictional brands), not client work: present it as a concept, describe what
 * it shows and aims to do, and never invent clients, results or testimonials.
 */
export const projects = {
  eyebrow: "Projektet",
  title: "Koncepte website",
  description:
    "Koncepte të dizajnuara nga WideCode për lloje të ndryshme biznesesh, nga një website prezantues deri te një web aplikacion.",
  conceptLabel: "Koncept website",
  categories: {
    presentation: "Website prezantues",
    business: "Website biznesi",
    ecommerce: "Online Shop",
    platform: "Web aplikacion",
  },
  items: {
    "studio-fotografie": {
      title: "Studio fotografie",
      summary: "One-page website për një fotograf, me galeri, shërbime dhe kontakt.",
      tags: ["One-page", "Galeri", "Kontakt"],
      concept:
        "Koncept për një fotograf ose studio që dëshiron ta paraqesë punën e vet në një faqe të vetme, të shpejtë dhe vizuale.",
      goals: [
        "Ta vërë punën vizuale në plan të parë",
        "Ta bëjë kontaktin të lehtë nga celulari",
        "Të ngarkohet shpejt edhe me shumë fotografi",
      ],
      features: ["Galeri e optimizuar për fotografi", "Seksion për shërbimet", "Formular kontakti", "Dizajn responsive"],
      sections: ["Hyrja", "Galeria", "Shërbimet", "Kontakti"],
    },
    "restorant-tradicional": {
      title: "Restorant tradicional",
      summary: "Website me menu, galeri dhe kërkesë për rezervim, i menduar për t'u përdorur lehtë nga celulari.",
      tags: ["Menu online", "Rezervime", "Celular"],
      concept:
        "Koncept për një restorant që dëshiron ta prezantojë menunë dhe ambientin, si dhe të pranojë kërkesa për rezervim online.",
      goals: [
        "Menuja të lexohet lehtë në celular",
        "Kërkesat për rezervim të dërgohen pa telefonatë",
        "Ambienti të paraqitet me fotografi",
      ],
      features: ["Menu online me kategori", "Formular për kërkesë rezervimi", "Galeri e ambientit", "Hartë dhe orari i punës"],
      sections: ["Ballina", "Menuja", "Galeria", "Rezervo", "Kontakti"],
    },
    "klinike-dentare": {
      title: "Klinikë dentare",
      summary: "Website biznesi me shërbime, informacione për pacientët dhe kërkesë për takim.",
      tags: ["Shërbime", "Takime", "SEO bazë"],
      concept:
        "Koncept për një klinikë që dëshiron t'i informojë pacientët për shërbimet dhe t'u mundësojë të kërkojnë takim online.",
      goals: [
        "Shërbimet të shpjegohen qartë",
        "Kërkesa për takim të jetë e thjeshtë",
        "Të krijohet besueshmëri që në vizitën e parë",
      ],
      features: ["Faqe për secilin shërbim", "Formular për kërkesë takimi", "Informacione praktike për pacientët", "SEO bazë"],
      sections: ["Ballina", "Shërbimet", "Rreth klinikës", "Takimet", "Kontakti"],
    },
    "dyqan-veshjesh": {
      title: "Online shop për veshje",
      summary: "Katalog produktesh me filtra, shportë dhe një proces të thjeshtë porosie.",
      tags: ["Katalog", "Shportë", "Filtra"],
      concept:
        "Koncept për një markë veshjesh që dëshiron t'i shesë produktet online, me fokus te blerja e shpejtë nga celulari.",
      goals: [
        "Produktet të gjenden shpejt me filtra",
        "Blerja të përfundojë në pak hapa",
        "Përvoja të funksionojë mirë në celular",
      ],
      features: [
        "Katalog me kategori dhe filtra",
        "Variante produktesh, si madhësia dhe ngjyra",
        "Shportë dhe porosi",
        "Menaxhim i produkteve dhe porosive",
      ],
      sections: ["Ballina", "Katalogu", "Produkti", "Shporta", "Porosia"],
    },
    "produkte-vendore": {
      title: "Online shop për produkte vendore",
      summary: "Online shop për prodhues vendorë, me histori të produkteve dhe porosi të thjeshtë.",
      tags: ["Katalog", "Histori produkti", "Porosi"],
      concept:
        "Koncept për një prodhues vendor, për shembull mjalte ose produktesh bujqësore, që dëshiron t'u shesë direkt klientëve online.",
      goals: [
        "Të tregohet origjina dhe cilësia e produkteve",
        "Porosia të jetë e thjeshtë për çdo moshë",
        "Të ndërtohet besim te blerësit e rinj",
      ],
      features: [
        "Faqe produkti me histori dhe fotografi",
        "Shportë dhe porosi",
        "Pagesa online si shtesë opsionale",
        "Dizajn responsive",
      ],
      sections: ["Ballina", "Produktet", "Rreth nesh", "Porosia"],
    },
    "panel-palestre": {
      title: "Panel për palestër",
      summary: "Web aplikacion për menaxhimin e anëtarëve, anëtarësimeve dhe orareve të stërvitjeve.",
      tags: ["Dashboard", "Orare", "Anëtarë"],
      concept:
        "Koncept për një palestër që dëshiron t'i menaxhojë anëtarët, anëtarësimet dhe oraret e stërvitjeve në një vend.",
      goals: [
        "Të kursehet koha në punët administrative",
        "Anëtarët të kenë pasqyrë të qartë të orareve",
        "Anëtarësimet që skadojnë të ndiqen me lehtësi",
      ],
      features: [
        "Dashboard me pasqyrë të anëtarëve",
        "Menaxhim i anëtarësimeve",
        "Orari i stërvitjeve",
        "Role të ndryshme përdoruesish",
      ],
      sections: ["Dashboard", "Anëtarët", "Anëtarësimet", "Orari"],
    },
  },
  desktopPreviewLabel: "Faqja kryesore e konceptit {title}, në kompjuter",
  mobilePreviewLabel: "Faqja kryesore e konceptit {title}, në celular",
  cta: "Shiko të gjitha projektet",
} satisfies Dictionary["projects"];
