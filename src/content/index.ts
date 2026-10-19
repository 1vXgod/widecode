import { defaultLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/content";
import { de } from "./de/common";
import { en } from "./en/common";
import { sq } from "./sq/common";

const dictionaries: Record<Locale, Dictionary> = { sq, en, de };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}
