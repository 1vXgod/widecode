/**
 * Locale configuration. Every route lives under app/[lang]; see
 * src/i18n/routing.ts for how public URLs map to it. Add a locale here (with
 * its URLs in routing.ts and a dictionary in src/content) to publish the site
 * in another language.
 */
export const locales = ["sq", "en", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sq";

/** Whether a value (e.g. the [lang] route segment) is a supported locale. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export type LocaleMeta = {
  /** BCP 47 tag for <html lang>, hreflang and JSON-LD. */
  htmlLang: string;
  /** Open Graph locale. */
  ogLocale: string;
  /** The language's own name, as shown in the language switcher. */
  name: string;
  /** Short code shown on the switcher button. */
  short: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  sq: { htmlLang: "sq", ogLocale: "sq_AL", name: "Shqip", short: "SQ" },
  en: { htmlLang: "en", ogLocale: "en_US", name: "English", short: "EN" },
  de: { htmlLang: "de", ogLocale: "de_DE", name: "Deutsch", short: "DE" },
};
