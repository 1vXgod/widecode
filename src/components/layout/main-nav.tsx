"use client";

import Link from "next/link";
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
                  "block rounded-full px-3.5 py-2 text-sm font-medium transition-[color,background-color,box-shadow] duration-200",
                  active
                    ? "bg-white/[0.07] text-fg shadow-[inset_0_0_0_1px_var(--color-border)]"
                    : "text-fg-muted hover:bg-white/[0.04] hover:text-fg",
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
