"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { isActivePath, type NavItem } from "./nav-types";

type MobileMenuProps = {
  items: NavItem[];
  cta: NavItem;
  labels: {
    open: string;
    close: string;
    title: string;
    nav: string;
    home: string;
  };
  /** Optional content below the links (configured contact details, social links). */
  extra?: ReactNode;
};

/** Matches Tailwind's `lg` breakpoint, where the desktop nav takes over. */
const DESKTOP_QUERY = "(min-width: 64rem)";

/**
 * Full-screen mobile navigation built on the native <dialog> element, which
 * provides a focus trap, Escape-to-close and an inert background.
 */
export function MobileMenu({ items, cta, labels, extra }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const pathname = usePathname();

  function openMenu() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  // Close after navigation (including back/forward).
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // Close if the viewport grows into the desktop layout while open.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-label={labels.open}
        onClick={openMenu}
        className={buttonClasses({ variant: "ghost", size: "sm", className: "size-11 px-0 lg:hidden" })}
      >
        <Menu aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label={labels.title}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-bg/95 p-0 pb-10 text-fg backdrop-blur-xl backdrop:bg-black/60 open:animate-fade-in lg:hidden"
      >
        <Container className="flex h-header items-center justify-between">
          <Link href="/" aria-label={labels.home} onClick={closeMenu} className="shrink-0 rounded-lg">
            <Logo loading="eager" />
          </Link>
          <button
            type="button"
            aria-label={labels.close}
            onClick={closeMenu}
            className={buttonClasses({ variant: "ghost", size: "sm", className: "size-11 px-0" })}
          >
            <X aria-hidden="true" />
          </button>
        </Container>

        <Container className="mt-6 animate-fade-up">
          <nav aria-label={labels.nav}>
            <ul className="flex flex-col border-t border-border">
              {items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-border">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between py-4 font-display text-2xl font-medium tracking-tight transition-colors duration-200",
                        active ? "text-fg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                      {active ? <span aria-hidden="true" className="size-2 rounded-full bg-accent-text" /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link href={cta.href} onClick={closeMenu} className={buttonClasses({ size: "lg", className: "mt-8 w-full" })}>
            {cta.label}
            <ArrowRight aria-hidden="true" />
          </Link>

          {extra ? <div className="mt-10 grid gap-6 border-t border-border pt-8">{extra}</div> : null}
        </Container>
      </dialog>
    </>
  );
}
