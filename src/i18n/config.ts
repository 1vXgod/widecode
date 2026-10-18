/**
 * Locale configuration. Albanian only at launch; add "en" here (and a matching
 * folder in src/content) when English is introduced.
 */
export const locales = ["sq"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sq";

/** BCP 47 tags used for <html lang> and Open Graph. */
export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string }> = {
  sq: { htmlLang: "sq", ogLocale: "sq_AL" },
};
