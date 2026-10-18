import type { Dictionary } from "@/types/content";

export const contactPage = {
  intro: {
    eyebrow: "Kërko ofertë",
    title: "Na tregoni për projektin tuaj",
    lead: "Plotësoni formularin me disa detaje dhe ju dërgojmë një ofertë të qartë me çmimin, afatin dhe gjithçka që përfshihet, pa asnjë obligim.",
  },
  form: {
    label: "Kërkesë për ofertë",
    requiredNote: "Të gjitha fushat janë të detyrueshme, përveç atyre të shënuara si opsionale.",
    optional: "opsionale",
    sections: {
      contact: "Të dhënat tuaja",
      project: "Projekti",
    },
    fields: {
      name: { label: "Emri dhe mbiemri" },
      business: { label: "Emri i biznesit", hint: "Nëse projekti është për një biznes ose organizatë." },
      email: { label: "Email", hint: "Këtu ju dërgojmë përgjigjen dhe ofertën." },
      phone: { label: "Numri i telefonit", hint: "Nëse preferoni t'ju telefonojmë. Formati: +383 4X XXX XXX." },
      projectType: { label: "Lloji i projektit" },
      packageId: {
        label: "Paketa",
        hint: "Nuk jeni të sigurt? Zgjidhni «Ende nuk e di» dhe ju ndihmojmë ta zgjidhni paketën e duhur.",
      },
      budget: { label: "Buxheti i përafërt" },
      timeline: { label: "Afati i dëshiruar" },
      description: {
        label: "Përshkrimi i projektit",
        hint: "Me çfarë merret biznesi juaj, çfarë duhet të përmbajë website-i dhe, nëse keni, shembuj website-esh që ju pëlqejnë.",
      },
    },
    selectPlaceholder: "Zgjidhni…",
    options: {
      projectType: {
        presentation: "Website prezantues",
        business: "Website biznesi",
        ecommerce: "Online shop",
        platform: "Custom development / web aplikacion",
        other: "Diçka tjetër",
      },
      packageUnsure: "Ende nuk e di",
      budget: {
        "under-300": "Deri në 300 €",
        "300-600": "300–600 €",
        "600-1000": "600–1000 €",
        "1000-2000": "1000–2000 €",
        "over-2000": "Mbi 2000 €",
        unsure: "Ende nuk e di",
      },
      timeline: {
        asap: "Sa më shpejt",
        "within-month": "Brenda një muaji",
        "one-to-three-months": "Brenda 1–3 muajve",
        flexible: "Jam fleksibël",
      },
    },
    characterCount: "{count} / {max} karaktere",
    prefillNotice: "Disa fusha u plotësuan sipas zgjedhjes suaj. Mund t'i ndryshoni lirisht.",
    estimate: {
      title: "Vlerësimi juaj nga llogaritësi",
      text: "Ky vlerësim orientues dërgohet bashkë me kërkesën. Çmimin përfundimtar e konfirmojmë në ofertë.",
      edit: "Ndrysho vlerësimin",
      remove: "Hiq vlerësimin",
    },
    project: {
      title: "Koncepti që ju interesoi",
      remove: "Hiq konceptin",
    },
    submit: "Dërgo kërkesën",
    submitting: "Duke dërguar…",
    privacy: "Të dhënat tuaja përdoren vetëm për t'iu përgjigjur kësaj kërkese.",
    honeypotLabel: "Mos e plotësoni këtë fushë",
  },
  errors: {
    summaryOne: "Ju lutemi korrigjoni 1 fushë:",
    summaryMany: "Ju lutemi korrigjoni {count} fusha:",
    fields: {
      name: {
        required: "Shkruani emrin tuaj.",
        tooShort: "Emri duhet të ketë të paktën 2 shkronja.",
        tooLong: "Emri mund të ketë deri në 100 karaktere.",
      },
      business: {
        tooLong: "Emri i biznesit mund të ketë deri në 120 karaktere.",
      },
      email: {
        required: "Shkruani adresën tuaj të email-it.",
        invalid: "Shkruani një adresë email të vlefshme, p.sh. emri@domeni.com.",
      },
      phone: {
        invalid: "Shkruani një numër telefoni të vlefshëm, p.sh. +383 4X XXX XXX, ose lëreni bosh.",
      },
      projectType: { required: "Zgjidhni llojin e projektit." },
      packageId: { required: "Zgjidhni një paketë ose «Ende nuk e di»." },
      budget: { required: "Zgjidhni buxhetin e përafërt ose «Ende nuk e di»." },
      timeline: { required: "Zgjidhni afatin e dëshiruar." },
      description: {
        required: "Përshkruani shkurt projektin tuaj.",
        tooShort: "Shkruani të paktën 20 karaktere, që ta kuptojmë më mirë projektin tuaj.",
        tooLong: "Përshkrimi mund të ketë deri në 5000 karaktere.",
      },
    },
  },
  status: {
    unavailableNotice: {
      title: "Formulari është përkohësisht i padisponueshëm",
      text: "Për momentin nuk mund të pranojmë kërkesa përmes website-it. Ju lutemi provoni përsëri më vonë. Ndërkohë, mund t'i shikoni paketat dhe çmimet ose të llogaritni një vlerësim orientues për projektin tuaj.",
    },
    invalid: "Disa fusha nuk janë plotësuar saktë. Ju lutemi kontrolloni mesazhet te fushat.",
    rateLimited: "Keni dërguar disa kërkesa brenda një kohe të shkurtër. Ju lutemi provoni përsëri pas {time}.",
    minuteOne: "1 minute",
    minuteMany: "{count} minutash",
    tooFast: "Formulari u dërgua shumë shpejt pasi u hap. Ju lutemi kontrolloni të dhënat dhe provoni përsëri.",
    rejected: "Kërkesa nuk mund të pranohej. Ju lutemi rifreskoni faqen dhe provoni përsëri.",
    unavailable:
      "Kërkesa nuk u dërgua, sepse formulari është përkohësisht i padisponueshëm. Të dhënat tuaja janë ende në formular. Ju lutemi provoni përsëri më vonë.",
    failed:
      "Kërkesa nuk u dërgua për shkak të një problemi teknik. Të dhënat tuaja janë ende në formular, prandaj mund të provoni përsëri pas pak.",
    network:
      "Nuk u lidhëm dot me serverin. Kontrolloni lidhjen me internetin dhe provoni përsëri. Të dhënat tuaja janë ende në formular.",
  },
  success: {
    title: "Faleminderit, kërkesa juaj u dërgua!",
    text: "E morëm kërkesën tuaj për ofertë. Do ta shqyrtojmë me kujdes dhe do t'ju kthejmë përgjigje në {email}.",
    summaryTitle: "Përmbledhje e kërkesës",
    again: "Dërgo një kërkesë tjetër",
    projects: "Shiko projektet",
  },
  aside: {
    nextTitle: "Çfarë ndodh pasi e dërgoni",
    steps: [
      {
        title: "Shqyrtojmë kërkesën",
        text: "E lexojmë me kujdes përshkrimin dhe zgjedhjet tuaja.",
      },
      {
        title: "Ju kontaktojmë",
        text: "Nëse na duhen më shumë detaje, ju shkruajmë me disa pyetje të shkurtra.",
      },
      {
        title: "Merrni ofertën",
        text: "Ju dërgojmë një ofertë të qartë me çmimin, afatin dhe gjithçka që përfshihet, pa obligim.",
      },
    ],
    priceTitle: "Nuk jeni të sigurt për çmimin?",
    priceText: "Llogaritni një vlerësim orientues ose shikoni paketat me çmimet fillestare.",
    estimatorCta: "Llogarit çmimin",
    pricingCta: "Shiko çmimet",
    contactTitle: "Na kontaktoni drejtpërdrejt",
  },
  email: {
    subject: "Kërkesë për ofertë: {name} – {projectType}",
    heading: "Kërkesë e re për ofertë",
    intro: "Kjo kërkesë u dërgua nga formulari i kontaktit në website-in e WideCode.",
    notProvided: "Nuk është dhënë",
    estimateTitle: "Vlerësimi orientues nga llogaritësi",
    estimateTotal: "Totali orientues",
    project: "Koncepti i referuar",
    submittedAt: "Dërguar më (UTC)",
    reference: "Referenca",
    replyHint: "Përgjigjuni këtij email-i për t'i shkruar drejtpërdrejt dërguesit.",
  },
} satisfies Dictionary["contactPage"];
