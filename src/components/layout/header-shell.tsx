"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const SCROLL_THRESHOLD = 8;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getSnapshot = () => window.scrollY > SCROLL_THRESHOLD;
const getServerSnapshot = () => false;

/**
 * Sticky header wrapper: transparent at the top of the page, then a blurred
 * surface with a hairline border once the page scrolls.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className="sticky top-0 z-40 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 ease-out-expo data-scrolled:border-border data-scrolled:bg-bg/75 data-scrolled:backdrop-blur-xl"
    >
      {children}
    </header>
  );
}
