import type { Dictionary } from "@/types/content";

export const home = {
  hero: {
    eyebrow: "Zhvillim uebi në Kosovë",
    title: "Uebfaqe profesionale që punojnë për",
    titleHighlight: "biznesin tuaj",
    lead: "Ndërtojmë uebfaqe dhe dyqane online me porosi — të shpejta, të sigurta dhe të përshtatura për çdo pajisje, me çmime të qarta që në fillim.",
    primaryCta: "Merr një ofertë",
    secondaryCta: "Shiko projektet",
    priceNote: "Çmime fillestare nga {price}",
    noObligation: "Ofertë pa asnjë obligim",
  },
  showcase: {
    label: "Shembull interaktiv: si ndërtohet një uebfaqe, nga dizajni te publikimi",
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
      text: "Na tregoni për biznesin, qëllimet dhe çfarë ju nevojitet nga uebfaqja.",
    },
    {
      title: "Ofertë dhe plan",
      text: "Ju dërgojmë një ofertë të qartë me çmimin, afatin dhe gjithçka që përfshihet.",
    },
    {
      title: "Dizajni",
      text: "Krijojmë pamjen e uebfaqes dhe e përshtatim bashkë me ju para zhvillimit.",
    },
    {
      title: "Zhvillimi",
      text: "E ndërtojmë uebfaqen me kod me porosi, të shpejtë dhe të përshtatur për çdo pajisje.",
    },
    {
      title: "Testimi dhe publikimi",
      text: "E testojmë në pajisje të ndryshme dhe e publikojmë kur ju jeni të kënaqur.",
    },
  ],
} satisfies Dictionary["process"];

export const why = {
  eyebrow: "Pse WideCode",
  title: "Një partner i qartë për uebfaqen tuaj",
  description: "Nuk premtojmë mrekulli. Premtojmë punë të kujdesshme, komunikim të hapur dhe çmime të qarta.",
  items: {
    transparent: {
      title: "Çmime transparente",
      text: "Çmimet fillestare janë publike. Para se të nisim, e dini saktë çfarë përfshin oferta.",
    },
    custom: {
      title: "Të ndërtuara me porosi",
      text: "Çdo uebfaqe dizajnohet dhe ndërtohet për biznesin tuaj, jo nga shabllone të gatshme.",
    },
    devices: {
      title: "Për çdo pajisje",
      text: "Uebfaqet që ndërtojmë përshtaten për celular, tablet dhe kompjuter.",
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
