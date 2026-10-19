import type { Dictionary } from "@/types/content";

/**
 * Copy for the error pages (app/error.tsx, app/global-error.tsx). A module of
 * its own because error boundaries are Client Components: importing the whole
 * dictionary there would ship all of the site's copy to the browser.
 */
export const errorPage = {
  title: "Diçka shkoi keq",
  text: "Faqja nuk u ngarkua për shkak të një gabimi të papritur. Provoni përsëri pas pak.",
  retry: "Provo përsëri",
  backHome: "Kthehu në ballinë",
  /** Shown with the error's reference code, which matches the server log. */
  reference: "Kodi i gabimit",
} satisfies Dictionary["errorPage"];
