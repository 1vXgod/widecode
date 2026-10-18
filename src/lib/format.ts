/**
 * Joins items as an Albanian list: "A", "A dhe B", "A, B dhe C".
 * Deterministic on purpose (Intl.ListFormat locale data differs between
 * runtimes), so server and client output always match.
 */
export function formatList(items: readonly string[], conjunction = "dhe"): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items.at(-1)}`;
}
