/**
 * Single source of truth for site routes. Labels live in the content
 * dictionaries (src/content/<locale>) and are keyed by RouteKey.
 */
export const routes = {
  home: "/",
  services: "/sherbimet",
  projects: "/projektet",
  pricing: "/cmimet",
  estimator: "/llogarit-cmimin",
  about: "/rreth-nesh",
  faq: "/pyetje-te-shpeshta",
  contact: "/kontakt",
} as const;

export type RouteKey = keyof typeof routes;

/** Order of links in the main (header) navigation. */
export const mainNav = ["home", "services", "projects", "pricing", "about", "contact"] as const satisfies readonly RouteKey[];

/** Footer navigation groups; headings live in the content dictionaries. */
export const footerNav = {
  pages: ["home", "services", "projects", "pricing", "about", "contact"],
  resources: ["estimator", "faq"],
} as const satisfies Record<string, readonly RouteKey[]>;

export type FooterNavGroup = keyof typeof footerNav;
