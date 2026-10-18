import type { Dictionary } from "@/types/content";

export const faq = {
  eyebrow: "Pyetje",
  title: "Pyetjet e shpeshta",
  description: "Përgjigje të shkurtra për pyetjet më të zakonshme rreth projekteve dhe procesit.",
  items: [
    {
      question: "Sa kushton një website?",
      answer:
        "Paketat tona nisin nga {price}. Çmimi përfundimtar varet nga numri i faqeve, funksionalitetet, përmbajtja dhe integrimet që ju nevojiten.",
    },
    {
      question: "Pse çmimet quhen fillestare?",
      answer:
        "Çdo projekt është i ndryshëm. Çmimet e publikuara janë pikënisje orientuese; pas bisedës fillestare ju dërgojmë një ofertë të saktë për projektin tuaj.",
    },
    {
      question: "Sa kohë duhet për ta ndërtuar një website?",
      answer:
        "Varet nga madhësia dhe kompleksiteti i projektit. Afatin e saktë e përcaktojmë bashkë dhe e shënojmë në ofertë.",
    },
    {
      question: "A do të funksionojë website-i në celular?",
      answer: "Po. Çdo website që ndërtojmë dizajnohet dhe testohet për celular, tablet dhe kompjuter.",
    },
    {
      question: "Si mund të nisim?",
      answer:
        "Na shkruani përmes faqes së kontaktit me disa detaje për projektin. Ju kthejmë përgjigje me pyetje shtesë ose me një ofertë, pa asnjë obligim.",
    },
  ],
  viewAll: "Shiko të gjitha pyetjet",
} satisfies Dictionary["faq"];
