/**
 * Single source of truth for site routes. Labels live in the content
 * dictionaries (src/content/<locale>) and are keyed by RouteKey.
 */
export const routes = {
  home: "/",
  services: "/sherbimet",
  portfolio: "/portofoli",
  pricing: "/cmimet",
  estimator: "/llogarit-cmimin",
  about: "/rreth-nesh",
  faq: "/pyetje-te-shpeshta",
  contact: "/kontakt",
} as const;

export type RouteKey = keyof typeof routes;

/** Order of links in the main (header) navigation. */
export const mainNav = ["services", "portfolio", "pricing", "estimator", "about"] as const satisfies readonly RouteKey[];

/** Order of links in the footer navigation. */
export const footerNav = [
  "services",
  "portfolio",
  "pricing",
  "estimator",
  "about",
  "faq",
  "contact",
] as const satisfies readonly RouteKey[];
