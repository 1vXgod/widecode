import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/content";
import { errorPage as en } from "./en/error-page";
import { errorPage as sq } from "./sq/error-page";

/**
 * Error page copy per language, for the error boundaries (Client Components).
 * Kept apart from the dictionaries so the browser only receives these few lines.
 */
export const errorPages: Record<Locale, Dictionary["errorPage"]> = { sq, en };
