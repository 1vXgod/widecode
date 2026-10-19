import type { Locale } from "@/i18n/config";

const conjunctions: Record<Locale, string> = { sq: "dhe", en: "and" };

/**
 * Joins items as a list in a language: "A", "A dhe B", "A, B dhe C" (Albanian),
 * "A, B and C" (English). Deterministic on purpose (Intl.ListFormat locale data
 * differs between runtimes), so server and client output always match.
 */
export function formatList(items: readonly string[], locale: Locale = "sq"): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${conjunctions[locale]} ${items.at(-1)}`;
}
