import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know about our custom theme keys (see src/styles/theme.css),
 * otherwise e.g. `text-display` would be mistaken for a color and dropped when
 * merged with `text-fg`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "title", "heading", "lead"],
      container: ["narrow", "content", "wide"],
      spacing: ["gutter", "section", "header"],
      radius: ["card"],
      shadow: ["glow"],
      breakpoint: ["xs"],
    },
  },
});

/** Compose class names conditionally and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
