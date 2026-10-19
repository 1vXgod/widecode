"use client";

import { ArrowUp } from "lucide-react";
import { useSyncExternalStore, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { MAIN_CONTENT_ID } from "./skip-link";

/** Scroll distance (px) after which the button appears. */
export const BACK_TO_TOP_THRESHOLD = 400;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getSnapshot = () => window.scrollY > BACK_TO_TOP_THRESHOLD;
const getServerSnapshot = () => false;

/**
 * Floating button in the bottom-right corner that scrolls back to the top of
 * the page, shown once the visitor has scrolled down a little.
 *
 * Hydration-safe like HeaderShell: the server HTML and the first browser render
 * both use the hidden state; only React changes the markup afterwards. While
 * hidden it is `inert` (out of the tab order and the accessibility tree), not
 * just transparent. Rendered in the footer (contentinfo landmark) of every
 * page, so it works in every language and after client-side navigation.
 * It rises above fixed bars at the bottom of the screen (`data-bottom-bar`,
 * see globals.css), such as the price calculator's compact total.
 */
export function BackToTop({ label }: { label: string }) {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function scrollToTop(event: MouseEvent<HTMLButtonElement>) {
    // Keyboard activation (no pointer, so detail is 0): continue from the top of the page, where
    // the next Tab reaches the skip link, instead of losing focus when the button hides.
    if (event.detail === 0) {
      document.querySelector<HTMLElement>(`a[href="#${MAIN_CONTENT_ID}"]`)?.focus({ preventScroll: true });
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      inert={!visible}
      onClick={scrollToTop}
      className={cn(
        "back-to-top group fixed z-30 grid size-11 place-items-center rounded-full border border-border-strong bg-surface-raised/90 text-fg shadow-lg shadow-shadow/40 backdrop-blur-xl",
        "transition-[opacity,translate,bottom,background-color,border-color,box-shadow] duration-300 ease-out-expo",
        "hover:border-accent/60 hover:bg-surface-raised hover:shadow-glow active:translate-y-px",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp aria-hidden="true" className="size-5 transition-transform duration-200 ease-out-expo group-hover:-translate-y-0.5" />
    </button>
  );
}
