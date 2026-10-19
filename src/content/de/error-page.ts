import type { Dictionary } from "@/types/content";

/** German copy for the error pages; see src/content/sq/error-page.ts. */
export const errorPage = {
  title: "Etwas ist schiefgelaufen",
  text: "Die Seite konnte wegen eines unerwarteten Fehlers nicht geladen werden. Bitte versuchen Sie es gleich noch einmal.",
  retry: "Erneut versuchen",
  backHome: "Zurück zur Startseite",
  /** Shown with the error's reference code, which matches the server log. */
  reference: "Fehlercode",
} satisfies Dictionary["errorPage"];
