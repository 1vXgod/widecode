"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/routing";
import { useLocale } from "@/i18n/locale-context";
import { usePublicPathname } from "@/i18n/use-public-pathname";
import { cn } from "@/lib/cn";
import { fill } from "@/lib/template";

export type LanguageSwitcherLabels = {
  /** Name of the switcher (navigation landmark). */
  language: string;
  /** Accessible name of the compact button; uses {language}. */
  languageButton: string;
};

type LanguageSwitcherProps = {
  labels: LanguageSwitcherLabels;
  /** "compact": a button with a small list (header). "inline": all languages side by side (mobile menu). */
  variant: "compact" | "inline";
  /** Called after a language was chosen (e.g. to close the mobile menu). */
  onSelect?: () => void;
  className?: string;
};

/**
 * Switches to the same page in another language. Links point to the equivalent
 * page (or that language's home page); on click, the current query string and
 * anchor are added, so estimator choices, filters and pre-filled form fields
 * carry over. The quote form's draft lives in sessionStorage and follows along.
 * Links are rendered from the public path only (no query), so the server HTML
 * and the browser always agree.
 */
export function LanguageSwitcher({ labels, variant, onSelect, className }: LanguageSwitcherProps) {
  const current = useLocale();
  const pathname = usePublicPathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const options = locales.map((locale) => ({ locale, href: switchLocalePath(pathname, locale) }));

  function choose(event: MouseEvent<HTMLAnchorElement>, locale: Locale, href: string) {
    // Let the browser handle new tabs and windows (they open the plain link).
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    onSelect?.();
    if (locale !== current) router.push(`${href}${window.location.search}${window.location.hash}`);
  }

  // The compact list closes on Escape (focus back to the button), outside clicks and focus leaving it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const links = options.map(({ locale, href }) => {
    const active = locale === current;
    return (
      <li key={locale}>
        <a
          href={href}
          hrefLang={localeMeta[locale].htmlLang}
          lang={localeMeta[locale].htmlLang}
          aria-current={active ? "true" : undefined}
          onClick={(event) => choose(event, locale, href)}
          className={cn(
            variant === "compact"
              ? "flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200"
              : "flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200",
            variant === "compact" && (active ? "bg-fg/[0.07] text-fg" : "text-fg-muted hover:bg-fg/5 hover:text-fg"),
            variant === "inline" &&
              (active ? "border-accent/70 bg-accent/15 text-fg" : "border-border-strong text-fg-muted hover:text-fg"),
          )}
        >
          {localeMeta[locale].name}
          {active ? <Check aria-hidden="true" className="size-4 text-accent-text" /> : null}
        </a>
      </li>
    );
  });

  if (variant === "inline") {
    return (
      <nav aria-label={labels.language} className={className}>
        <ul className="flex flex-wrap gap-2">{links}</ul>
      </nav>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-fg/5 hover:text-fg aria-expanded:bg-fg/[0.07] aria-expanded:text-fg"
      >
        {/* Decorative; left out between lg and xl, where the header row is tightest (see site-header.tsx). */}
        <Globe aria-hidden="true" className="size-4 lg:max-xl:hidden" />
        {/* The visible code starts the accessible name (WCAG 2.5.3), e.g. "SQ Ndrysho gjuhën (tani: Shqip)". */}
        <span>{localeMeta[current].short}</span>
        <span className="sr-only"> {fill(labels.languageButton, { language: localeMeta[current].name })}</span>
        <ChevronDown aria-hidden="true" className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div
        id={listId}
        hidden={!open}
        className="absolute top-full right-0 z-50 mt-2 min-w-44 rounded-xl border border-border-strong bg-surface-raised p-1.5 shadow-2xl shadow-shadow/50"
      >
        <nav aria-label={labels.language}>
          <ul className="grid gap-0.5">{links}</ul>
        </nav>
      </div>
    </div>
  );
}
