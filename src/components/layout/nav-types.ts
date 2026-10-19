import { localizedRoutes } from "@/i18n/routing";

export type NavItem = {
  href: string;
  label: string;
};

/** Home page of every language ("/", "/en"): every other page of that language is beneath it. */
const homePaths = new Set<string>(Object.values(localizedRoutes).map((table) => table.home));

/** A link is "current" on its own page and on any nested page beneath it (home pages: only on themselves). */
export function isActivePath(pathname: string, href: string): boolean {
  if (homePaths.has(href)) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
