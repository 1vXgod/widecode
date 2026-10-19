import type { Dictionary } from "@/types/content";

/** English copy for the error pages; see src/content/sq/error-page.ts. */
export const errorPage = {
  title: "Something went wrong",
  text: "The page could not be loaded because of an unexpected error. Please try again in a moment.",
  retry: "Try again",
  backHome: "Back to the home page",
  /** Shown with the error's reference code, which matches the server log. */
  reference: "Error code",
} satisfies Dictionary["errorPage"];
