import { lang } from "next/root-params";
import { getDictionary } from "@/content";
import type { Dictionary } from "@/types/content";
import { defaultLocale, isLocale, type Locale } from "./config";

/**
 * The language of the page being rendered, from the [lang] root segment.
 * Server Components only (root params are not available in Client Components,
 * Server Actions or Route Handlers). Outside app/[lang] (e.g. the global 404
 * page) it is the default language.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : defaultLocale;
}

/** The dictionary for the page being rendered. */
export async function getPageDictionary(): Promise<Dictionary> {
  return getDictionary(await getLocale());
}
