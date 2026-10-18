"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const READY_CLASS = "reveal-ready";
const REVEALED_ATTR = "data-revealed";

/**
 * Fades `.reveal` elements in once, when they first scroll into view.
 *
 * Progressive enhancement: nothing is hidden until this runs, so content stays
 * visible without JavaScript and for visitors who prefer reduced motion.
 * Elements already on screen are marked as revealed before the first paint, so
 * nothing on screen ever flashes or sits half-transparent. Only opacity and
 * transform change (see globals.css), so it cannot cause layout shift.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  // Re-run after client-side navigation to pick up the new page's elements.
  useLayoutEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute(REVEALED_ATTR, "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );

    const viewportHeight = window.innerHeight;
    for (const element of document.querySelectorAll(`.reveal:not([${REVEALED_ATTR}])`)) {
      const rect = element.getBoundingClientRect();
      const onScreen = rect.bottom > 0 && rect.top < viewportHeight && rect.height > 0;
      if (onScreen) element.setAttribute(REVEALED_ATTR, "");
      else observer.observe(element);
    }
    document.documentElement.classList.add(READY_CLASS);

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
