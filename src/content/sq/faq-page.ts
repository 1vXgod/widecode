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
 * The full FAQ page. The questions shown on the home, services and pricing
 * pages (src/content/sq/faq.ts) are reused here as-is, so they never drift.
 * Answers may use {price}, {multilingualPrice} and {ecommercePrice}, filled
 * from the pricing config (see src/lib/faq.ts).
 *
 * Answers about payment terms, domain/hosting and changes after launch only
 * say that these are agreed in the offer: no terms are promised here.
 */
export const faqPage = {
  intro: {
    eyebrow: "Pyetjet e shpeshta",
    title: "Pyetje dhe përgjigje",
    lead: "Gjithçka që duhet të dini për çmimet, procesin dhe website-in tuaj, në një vend. Nëse nuk e gjeni përgjigjen, na shkruani.",
  },
  onThisPage: "Temat",
  categories: {
    cmimet: {
      title: "Çmimet dhe oferta",
      items: [
        cost,
        startingPrices,
        {
          question: "Si mund ta llogaris çmimin për projektin tim?",
          answer:
            "Përdorni llogaritësin e çmimit: zgjidhni paketën, numrin e faqeve dhe funksionalitetet shtesë, dhe shihni menjëherë një vlerësim orientues. Vlerësimin mund ta dërgoni bashkë me kërkesën për ofertë.",
        },
        {
          question: "Pse Custom Development nuk ka çmim fillestar?",
          answer:
            "Platformat dhe aplikacionet web me porosi ndryshojnë shumë nga njëra-tjetra. Prandaj nuk japim çmim paraprak: përgatisim ofertë pasi t'i analizojmë kërkesat tuaja.",
        },
        {
          question: "Çfarë nuk përfshihet në çmim?",
          answer:
            "Tarifat e palëve të treta, si tarifat e transaksioneve të ofruesve të pagesave ose abonimet për shërbime të jashtme, nuk përfshihen në çmim.",
        },
        {
          question: "A më obligon kërkesa për ofertë?",
          answer: "Jo. Ju dërgojmë ofertën dhe ju vendosni lirisht nëse doni të vazhdoni.",
        },
        {
          question: "Si bëhet pagesa?",
          answer: "Kushtet e pagesës i përcaktojmë qartë në ofertë, para se të nisë puna.",
        },
      ],
    },
    procesi: {
      title: "Procesi dhe afatet",
      items: [
        start,
        {
          question: "Si duket procesi i punës?",
          answer:
            "Punojmë në pesë hapa: bisedë fillestare, ofertë dhe plan, dizajni, zhvillimi, testimi dhe publikimi. Kështu e dini gjithmonë në cilën fazë ndodhet projekti juaj.",
        },
        duration,
        {
          question: "A mund ta shoh dizajnin para zhvillimit?",
          answer: "Po. Dizajnin e krijojmë dhe e përshtatim bashkë me ju, para se të nisë zhvillimi.",
        },
        {
          question: "Çfarë duhet të përgatis para se të nisim?",
          answer:
            "Mjafton një ide e qartë për biznesin dhe qëllimet tuaja. Nëse i keni, na ndihmojnë logoja, tekstet, fotografitë dhe shembuj website-esh që ju pëlqejnë.",
        },
      ],
    },
    website: {
      title: "Website-i dhe funksionalitetet",
      items: [
        mobile,
        {
          question: "A përfshihet SEO?",
          answer:
            "Po, SEO bazë përfshihet në çdo projekt: strukturë e rregullt e faqeve, tituj dhe përshkrime që i ndihmojnë motorët e kërkimit, si dhe faqe që ngarkohen shpejt.",
        },
        {
          question: "A mund ta kem website-in në dy gjuhë?",
          answer:
            "Po. Website në dy gjuhë, për shembull shqip dhe anglisht, është funksionalitet shtesë me çmim orientues {multilingualPrice}.",
        },
        {
          question: "A mund të shes produkte online?",
          answer:
            "Po. Paketa E-commerce nis nga {ecommercePrice} dhe përfshin katalog produktesh, shportë dhe porosi. Pagesa me kartelë është funksionalitet shtesë; tarifat e ofruesit të pagesave nuk përfshihen.",
        },
        {
          question: "A ndërtoni edhe web aplikacione me porosi?",
          answer:
            "Po. Përmes Custom Development ndërtojmë platforma dhe aplikacione web me kërkesa specifike, me funksionalitete dhe integrime me porosi.",
        },
      ],
    },
    "pas-publikimit": {
      title: "Pas publikimit",
      items: [
        {
          question: "Kush kujdeset për domain-in dhe hosting-un?",
          answer:
            "Domain-in dhe hosting-un i diskutojmë gjatë bisedës fillestare dhe në ofertë e përcaktojmë qartë si do të menaxhohen.",
        },
        {
          question: "A mund të bëj ndryshime pas publikimit?",
          answer:
            "Po. Për ndryshime ose përmirësime pas publikimit, na shkruani dhe ju dërgojmë ofertë për to.",
        },
      ],
    },
  },
} satisfies Dictionary["faqPage"];
