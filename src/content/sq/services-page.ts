import type { Dictionary } from "@/types/content";

export const servicesPage = {
  intro: {
    eyebrow: "Shërbimet",
    title: "Website dhe zgjidhje digjitale, të ndërtuara me porosi",
    lead: "Ndërtojmë website prezantues dhe website biznesi, online shop dhe aplikacione web me porosi për bizneset në Kosovë dhe më gjerë. Çdo projekt nis nga nevojat tuaja dhe ndërtohet nga e para.",
    primaryCta: "Merr një ofertë",
    secondaryCta: "Shiko çmimet",
  },
  onThisPage: "Në këtë faqe",
  idealForLabel: "Ideale për",
  includesLabel: "Çfarë përfshihet",
  packagesLabel: "Paketat përkatëse",
  quoteCta: "Merr ofertë",
  details: {
    presentation: {
      description:
        "Një website prezantues është mënyra më e shpejtë për t'u paraqitur profesionalisht online. Në një faqe të vetme ose në pak seksione, vizitorët mësojnë kush jeni, çfarë ofroni dhe si t'ju kontaktojnë.",
      idealFor: [
        "Biznese të reja dhe profesionistë të pavarur",
        "Lansimin e një produkti ose shërbimi të ri",
        "Bizneset që duan një prani të thjeshtë dhe të shpejtë online",
      ],
      includes: [
        "Dizajn modern dhe responsive për celular, tablet dhe kompjuter",
        "Seksione për prezantimin, shërbimet dhe kontaktin",
        "Formular kontakti",
        "SEO bazë",
      ],
    },
    business: {
      description:
        "Për bizneset që kanë më shumë për të treguar: shërbime të ndryshme, projekte ose informacione të detajuara. Përmbajtja ndahet në disa faqe, që klientët tuaj ta gjejnë shpejt atë që kërkojnë.",
      idealFor: [
        "Biznese me disa shërbime ose produkte",
        "Kompani që duan të ndërtojnë besueshmëri online",
        "Bizneset që duan një prani më të plotë online",
      ],
      includes: [
        "Disa faqe të strukturuara sipas nevojave tuaja",
        "Dizajn me porosi në përputhje me identitetin e biznesit",
        "Formular kontakti dhe hartë",
        "Lidhje me rrjetet sociale",
        "SEO bazë",
      ],
    },
    ecommerce: {
      description:
        "Një online shop ju lejon t'i shitni produktet tuaja në çdo kohë. Ndërtojmë një katalog të qartë, shportë të thjeshtë dhe një proces porosie që funksionon mirë edhe në celular.",
      idealFor: [
        "Dyqane fizike që duan të shesin edhe online",
        "Marka dhe prodhues vendorë",
        "Biznese që shesin produkte me variante, si madhësi ose ngjyra",
      ],
      includes: [
        "Katalog produktesh me kategori",
        "Shportë dhe proces porosie",
        "Menaxhim i produkteve dhe porosive",
        "Përvojë blerjeje e përshtatur për celular",
      ],
    },
    platform: {
      description:
        "Kur nevojat tuaja shkojnë përtej një website-i, ndërtojmë aplikacione web me porosi: sisteme rezervimesh, dashboard-e menaxhimi, portale për klientë dhe zgjidhje të tjera sipas proceseve të biznesit tuaj.",
      idealFor: [
        "Biznese me procese specifike që duan t'i digjitalizojnë",
        "Ide për produkte ose shërbime online",
        "Kompani që kanë nevojë për integrime me sisteme ekzistuese",
      ],
      includes: [
        "Analizë e kërkesave dhe planifikim",
        "Dizajn i ndërfaqes dhe i përvojës së përdoruesit",
        "Zhvillim i funksionaliteteve me porosi",
        "Integrime me shërbime dhe sisteme të jashtme",
      ],
    },
  },
  standards: {
    eyebrow: "Standardi ynë",
    title: "Çfarë përfshin çdo projekt",
    description: "Pavarësisht paketës, çdo website që ndërtojmë ndjek të njëjtat standarde cilësie.",
    items: {
      responsive: {
        title: "Responsive",
        text: "Dizajn që përshtatet për celular, tablet dhe kompjuter.",
      },
      seo: {
        title: "SEO bazë",
        text: "Strukturë e rregullt e faqeve, tituj dhe përshkrime që i ndihmojnë motorët e kërkimit.",
      },
      performance: {
        title: "Performancë",
        text: "Imazhe dhe kod të optimizuar, që faqja të ngarkohet shpejt.",
      },
      accessibility: {
        title: "Qasshmëri",
        text: "Kontrast i mirë, navigim me tastierë dhe strukturë e qartë për të gjithë përdoruesit.",
      },
      security: {
        title: "Siguri",
        text: "Lidhje e sigurt (HTTPS) dhe kontroll i të dhënave që dërgohen përmes formularëve.",
      },
      custom: {
        title: "Kod me porosi",
        text: "Pa template të gatshme: çdo projekt ndërtohet sipas nevojave tuaja.",
      },
    },
  },
  process: {
    title: "Si duket procesi?",
    text: "Nga biseda e parë deri te publikimi, çdo hap është i qartë dhe i dakorduar me ju.",
    cta: "Shiko procesin",
  },
} satisfies Dictionary["servicesPage"];
