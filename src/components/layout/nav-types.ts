export type NavItem = {
  href: string;
  label: string;
};

/** A link is "current" on its own page and on any nested page beneath it. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
