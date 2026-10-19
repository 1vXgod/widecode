import { defaultLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/content";
import { en } from "./en/common";
import { sq } from "./sq/common";

const dictionaries: Record<Locale, Dictionary> = { sq, en };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}
