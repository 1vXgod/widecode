import type { Dictionary } from "@/types/content";

/**
 * About page copy. Keep it to WideCode's mission, approach and services:
 * no founding year, team, clients, statistics or achievements unless the
 * owner provides and confirms them.
 */
export const aboutPage = {
  intro: {
    eyebrow: "Rreth nesh",
    title: "Ndërtojmë uebfaqe me kujdes, qartësi dhe çmime të ndershme",
    lead: "WideCode është kompani për zhvillim uebi që ndërton uebfaqe, dyqane online dhe platforma me porosi, kryesisht për bizneset në Kosovë, por edhe për klientë jashtë saj.",
    primaryCta: "Merr një ofertë",
    secondaryCta: "Shiko shërbimet",
  },
  mission: {
    eyebrow: "Misioni",
    title: "Prani profesionale online për çdo biznes",
    paragraphs: [
      "Besojmë se çdo biznes, i vogël apo i madh, meriton një uebfaqe që duket profesionale, funksionon mirë në çdo pajisje dhe e paraqet saktë atë që ofron.",
      "Prandaj i publikojmë çmimet fillestare, shpjegojmë qartë çfarë përfshin çdo ofertë dhe e ndërtojmë çdo projekt sipas nevojave reale të klientit, pa shabllone të gatshme dhe pa premtime të paqarta.",
    ],
    statement: "Qëllimi ynë është i thjeshtë: uebfaqe që u shërbejnë juve dhe klientëve tuaj.",
  },
  values: {
    eyebrow: "Vlerat tona",
    title: "Si i qasemi punës",
    description: "Parimet që udhëheqin çdo projekt, nga biseda e parë deri te publikimi.",
    items: {
      transparency: {
        title: "Transparencë",
        text: "Çmime fillestare publike dhe oferta të qarta, që ta dini që në fillim çfarë përfshihet.",
      },
      quality: {
        title: "Cilësi në detaje",
        text: "Kujdesemi për dizajnin, shpejtësinë dhe qasshmërinë, jo vetëm për pamjen.",
      },
      custom: {
        title: "Zgjidhje me porosi",
        text: "Çdo projekt ndërtohet për biznesin tuaj, jo nga shabllone të gatshme.",
      },
      communication: {
        title: "Komunikim i qartë",
        text: "Flasim shqip, shpjegojmë thjesht dhe ju mbajmë të informuar në çdo fazë.",
      },
      honesty: {
        title: "Ndershmëri",
        text: "Ju themi qartë çfarë mund të bëjmë, sa kushton dhe sa kohë duhet, pa premtime të tepruara.",
      },
      partnership: {
        title: "Bashkëpunim",
        text: "Vendimet kryesore për projektin i marrim bashkë me ju.",
      },
    },
  },
  services: {
    eyebrow: "Çfarë bëjmë",
    title: "Shërbimet tona",
    description: "Katër lloje projektesh, të gjitha të ndërtuara me të njëjtin standard cilësie.",
    cta: "Shiko detajet e shërbimeve",
  },
  market: {
    title: "Tregu ynë",
    text: "Fokusi ynë kryesor janë bizneset në Kosovë. Njëkohësisht, jemi të hapur edhe për projekte me klientë nga rajoni dhe më gjerë.",
  },
} satisfies Dictionary["aboutPage"];
