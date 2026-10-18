import { defaultLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/content";
import { sq } from "./sq/common";

const dictionaries: Record<Locale, Dictionary> = { sq };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}
