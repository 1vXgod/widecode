import type { Dictionary } from "@/types/content";

export const home = {
  hero: {
    eyebrow: "Web Development në Kosovë",
    title: "Website profesional që punon për",
    titleHighlight: "biznesin tuaj",
    lead: "Ndërtojmë website dhe online shop me porosi — të shpejtë, të sigurt dhe responsive në çdo pajisje, me çmime të qarta që në fillim.",
    primaryCta: "Merr një ofertë",
    secondaryCta: "Shiko projektet",
    priceNote: "Çmime fillestare nga {price}",
    noObligation: "Ofertë pa asnjë obligim",
  },
  showcase: {
    label: "Shembull interaktiv: si ndërtohet një website, nga dizajni te publikimi",
    tabs: {
      design: "Dizajni",
      code: "Kodi",
      live: "Gati",
    },
    pause: "Ndalo ndërrimin automatik",
    play: "Vazhdo ndërrimin automatik",
    url: "biznesi-juaj",
    mock: {
      brand: "Biznesi juaj",
      nav: ["Shërbimet", "Rreth nesh", "Kontakti"],
      title: "Mirë se vini",
      text: "Shërbime cilësore për klientët tanë.",
      cta: "Na kontaktoni",
      cards: ["Shërbimet", "Projektet", "Kontakti"],
      liveBadge: "Gati për publikim",
    },
    wireframe: {
      header: "Navigimi",
      hero: "Seksioni kryesor",
      cards: "Kartat",
    },
  },
} satisfies Dictionary["home"];

export const processCopy = {
  eyebrow: "Procesi",
  title: "Si punojmë",
  description: "Një proces i qartë në pesë hapa, që të dini gjithmonë në cilën fazë ndodhet projekti juaj.",
  steps: [
    {
      title: "Bisedë fillestare",
      text: "Na tregoni për biznesin, qëllimet dhe çfarë ju nevojitet nga website-i.",
    },
    {
      title: "Ofertë dhe plan",
      text: "Ju dërgojmë një ofertë të qartë me çmimin, afatin dhe gjithçka që përfshihet.",
    },
    {
      title: "Dizajni",
      text: "Krijojmë dizajnin dhe e përshtatim bashkë me ju para zhvillimit.",
    },
    {
      title: "Zhvillimi",
      text: "E ndërtojmë faqen me kod me porosi, të shpejtë dhe responsive në çdo pajisje.",
    },
    {
      title: "Testimi dhe publikimi",
      text: "E testojmë në pajisje të ndryshme dhe e publikojmë kur ju jeni të kënaqur.",
    },
  ],
} satisfies Dictionary["process"];

export const why = {
  eyebrow: "Pse WideCode",
  title: "Një partner i qartë për website-in tuaj",
  description: "Nuk premtojmë mrekulli. Premtojmë punë të kujdesshme, komunikim të hapur dhe çmime të qarta.",
  items: {
    transparent: {
      title: "Çmime transparente",
      text: "Çmimet fillestare janë publike. Para se të nisim, e dini saktë çfarë përfshin oferta.",
    },
    custom: {
      title: "Ndërtuar me porosi",
      text: "Çdo website dizajnohet dhe ndërtohet për biznesin tuaj, jo nga template të gatshme.",
    },
    devices: {
      title: "Për çdo pajisje",
      text: "Çdo website që ndërtojmë përshtatet për celular, tablet dhe kompjuter.",
    },
    communication: {
      title: "Komunikim në shqip",
      text: "Flasim gjuhën tuaj dhe komunikojmë drejtpërdrejt me ju gjatë gjithë projektit.",
    },
  },
} satisfies Dictionary["why"];

export const cta = {
  title: "Gati ta nisim projektin tuaj?",
  text: "Na tregoni çfarë keni në mendje dhe ju përgatisim një ofertë të qartë, pa asnjë obligim.",
  primary: "Merr një ofertë",
  secondary: "Llogarit çmimin",
} satisfies Dictionary["cta"];
