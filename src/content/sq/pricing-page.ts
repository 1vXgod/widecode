import type { Dictionary } from "@/types/content";

export const pricingPage = {
  intro: {
    eyebrow: "Çmimet",
    title: "Paketa me çmime transparente",
    lead: "Zgjidhni pikënisjen që i përshtatet projektit tuaj. Të gjitha çmimet janë fillestare dhe orientuese; çmimin përfundimtar e konfirmojmë pasi t'i shqyrtojmë kërkesat tuaja.",
    primaryCta: "Llogarit çmimin",
    secondaryCta: "Merr një ofertë",
  },
  packages: {
    eyebrow: "Paketat",
    title: "Zgjidhni pikënisjen",
    description: "Çdo paketë përfshin dizajn responsive dhe SEO bazë. Mund ta zgjeroni me funksionalitete shtesë sipas nevojës.",
    estimateCta: "Llogarit me këtë paketë",
  },
  addOns: {
    eyebrow: "Shtesat",
    title: "Funksionalitete shtesë",
    description: "Çmimet orientuese të funksionaliteteve që mund t'i shtoni në projekt. Të njëjtat çmime përdoren në llogaritës.",
    extraPage: "Faqe shtesë",
    extraPageNote: "Për faqet mbi numrin e përfshirë në paketë",
    includedPages: "{name} {count} faqe",
    perPage: "{price} / faqe",
    includedIn: "Përfshirë në {packages}",
    availableFor: "Për {packages}",
  },
  factors: {
    eyebrow: "Si formohet çmimi",
    title: "Çfarë ndikon në çmimin përfundimtar",
    description: "Çmimet e paketave janë pikënisje. Oferta përfundimtare mbështetet në këta faktorë.",
    items: {
      scope: {
        title: "Qëllimi i projektit",
        text: "Sa faqe dhe seksione duhen dhe sa e gjerë është zgjidhja.",
      },
      features: {
        title: "Funksionalitetet",
        text: "Rezervime, pagesa online, disa gjuhë ose funksione me porosi.",
      },
      content: {
        title: "Përmbajtja",
        text: "Nëse tekstet dhe fotot janë gati apo duhen përgatitur.",
      },
      integrations: {
        title: "Integrimet",
        text: "Lidhja me sisteme të jashtme, si pagesat ose programet që përdorni.",
      },
      complexity: {
        title: "Kompleksiteti",
        text: "Kërkesat specifike të dizajnit dhe të logjikës së biznesit tuaj.",
      },
    },
  },
  estimatorCta: {
    title: "Nuk jeni të sigurt cilën paketë të zgjidhni?",
    text: "Përdorni llogaritësin për një vlerësim orientues në pak hapa, pa obligim.",
    cta: "Hap llogaritësin",
  },
} satisfies Dictionary["pricingPage"];
