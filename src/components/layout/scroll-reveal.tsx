"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/** Start of the fade-up; it ends at the element's own styles (implicit keyframe). */
const HIDDEN: Keyframe[] = [{ offset: 0, opacity: 0, transform: "translateY(24px)" }];
const TIMING: KeyframeAnimationOptions = { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }; // --ease-out-expo

// Per element, across client-side navigations: revealed (or on screen at load) elements are done;
// the others hold a paused animation until they scroll into view.
const done = new WeakSet<Element>();
const pending = new WeakMap<Element, Animation>();

/**
 * Fades `.reveal` elements in once, when they first scroll into view.
 *
 * Uses the Web Animations API instead of classes or attributes: this runs in
 * the root layout, which can hydrate before the page's own segments, so any
 * attribute it set on a not yet hydrated element would not match the server
 * HTML (a hydration mismatch). Animations never touch the markup React owns.
 *
 * Progressive enhancement: nothing is hidden without JavaScript or for visitors
 * who prefer reduced motion. Elements already on screen are left alone, so
 * nothing on screen ever flashes or sits half-transparent; only elements below
 * the fold are hidden, before the first paint. Only opacity and transform
 * change, so it cannot cause layout shift.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  // Re-run after client-side navigation to pick up the new page's elements.
  useLayoutEffect(() => {
    if (!("IntersectionObserver" in window) || typeof Element.prototype.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          done.add(entry.target);
          pending.get(entry.target)?.play();
          pending.delete(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );

    const viewportHeight = window.innerHeight;
    for (const element of document.querySelectorAll(".reveal")) {
      if (done.has(element)) continue;
      const rect = element.getBoundingClientRect();
      // Inside a page Next.js keeps hidden after navigating away: handled when that page shows again.
      if (rect.width === 0 && rect.height === 0) continue;
      if (!pending.has(element)) {
        if (rect.bottom > 0 && rect.top < viewportHeight) {
          done.add(element);
          continue;
        }
        const animation = element.animate(HIDDEN, TIMING);
        animation.pause();
        pending.set(element, animation);
      }
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
