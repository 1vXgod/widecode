/**
 * Locale configuration. Every route lives under app/[lang]; see
 * src/i18n/routing.ts for how public URLs map to it. Add a locale here (and a
 * matching folder in src/content) to publish the site in another language.
 */
export const locales = ["sq"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sq";

/** Whether a value (e.g. the [lang] route segment) is a supported locale. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** BCP 47 tags used for <html lang> and Open Graph. */
export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string }> = {
  sq: { htmlLang: "sq", ogLocale: "sq_AL" },
};
