"use client";

import { Link } from "@/i18n/link";
import { usePublicPathname } from "@/i18n/use-public-pathname";
import { cn } from "@/lib/cn";
import { isActivePath, type NavItem } from "./nav-types";

type MainNavProps = {
  items: NavItem[];
  label: string;
  className?: string;
};

/** Desktop navigation with current-page indication. */
export function MainNav({ items, label, className }: MainNavProps) {
  const pathname = usePublicPathname();

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-0.5">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  // Tighter between lg and xl, where the full navigation shares the row with the language menu, theme toggle and CTA.
                  "block rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap xl:px-3.5 transition-[color,background-color,box-shadow] duration-200",
                  active
                    ? "bg-fg/[0.07] text-fg shadow-[inset_0_0_0_1px_var(--color-border)]"
                    : "text-fg-muted hover:bg-fg/[0.04] hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
