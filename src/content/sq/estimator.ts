import type { Dictionary } from "@/types/content";

export const estimator = {
  intro: {
    eyebrow: "Llogaritësi",
    title: "Llogarit çmimin e projektit tuaj",
    lead: "Zgjidhni llojin e projektit dhe funksionalitetet që ju duhen. Vlerësimi orientues përditësohet menjëherë, pa obligim.",
  },
  formLabel: "Llogaritësi i çmimit",
  steps: {
    package: "Lloji i projektit",
    pages: "Numri i faqeve",
    addOns: "Funksionalitete shtesë",
  },
  pagesHelp: "{count} faqe përfshihen në paketë. Çdo faqe shtesë: {price}.",
  pagesFixed: "Starter është one-page website. Për më shumë faqe, zgjidhni Business ose Professional.",
  pagesNotApplicable: "Për këtë lloj projekti, numri i faqeve përcaktohet gjatë analizës së kërkesave.",
  pagesInputLabel: "Numri i faqeve",
  decreasePages: "Zvogëlo numrin e faqeve",
  increasePages: "Rrit numrin e faqeve",
  addOnsNone: "Funksionalitetet për këtë projekt i përcaktojmë bashkë gjatë analizës.",
  addOnState: {
    included: "Përfshirë",
    price: "+{price}",
  },
  addOns: {
    multilingual: {
      label: "Website në dy gjuhë",
      description: "Përmbajtja në shqip dhe në anglisht ose në një gjuhë tjetër.",
    },
    blog: {
      label: "Blog / lajme",
      description: "Seksion për artikuj, lajme ose njoftime.",
    },
    booking: {
      label: "Rezervime ose takime",
      description: "Formular për rezervime ose për caktimin e takimeve.",
    },
    analytics: {
      label: "Analitikë",
      description: "Statistika për vizitorët dhe përdorimin e website-it.",
    },
    payments: {
      label: "Pagesa online",
      description:
        "Pagesë me kartelë në online shop. Tarifat e transaksioneve të ofruesit të pagesave nuk përfshihen.",
    },
  },
  summary: {
    title: "Vlerësimi juaj",
    base: "Paketa {name}",
    extraPages: "{count} faqe shtesë × {price}",
    total: "Vlerësim orientues",
    quoteOnly: "Me ofertë",
    quoteOnlyText: "Për Custom Development nuk japim çmim paraprak. Përgatisim ofertë pasi t'i analizojmë kërkesat tuaja.",
    disclaimer:
      "Ky është vlerësim orientues për implementime standarde, jo ofertë përfundimtare. Kërkesat komplekse mund të kërkojnë ofertë të veçantë. Çmimin e konfirmojmë vetëm pasi t'i shqyrtojmë kërkesat e projektit tuaj.",
    thirdParty:
      "Tarifat e palëve të treta, si tarifat e transaksioneve të ofruesve të pagesave ose abonimet për shërbime të jashtme, nuk përfshihen në çmim.",
    cta: "Kërko ofertë me këtë vlerësim",
    quoteCta: "Kërko ofertë",
    reset: "Rifillo",
    announce: "Vlerësimi orientues u përditësua: {total}",
    announceQuote: "Për këtë projekt përgatisim ofertë pas analizës së kërkesave.",
  },
} satisfies Dictionary["estimator"];
