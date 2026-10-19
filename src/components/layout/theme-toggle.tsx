"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/button";
import { chooseTheme, currentTheme, showTheme, storedTheme, systemTheme, watchTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

export type ThemeToggleLabels = {
  /** Accessible name while the dark theme is shown. */
  toLight: string;
  /** Accessible name while the light theme is shown. */
  toDark: string;
};

/**
 * Switches between the dark and light theme and remembers the choice (see
 * src/lib/theme.ts). Both states are in the markup and CSS shows the one that
 * matches the theme on screen (`light:` variant), so the server HTML is right
 * before hydration and React never renders theme-dependent markup.
 */
export function ThemeToggle({ labels, className }: { labels: ThemeToggleLabels; className?: string }) {
  // Follow the system setting (while there is no saved choice) and other tabs; restore the
  // <head> tag if something removed it.
  useEffect(() => {
    showTheme(storedTheme() ?? systemTheme());
    return watchTheme(() => undefined);
  }, []);

  return (
    <button
      type="button"
      onClick={() => chooseTheme(currentTheme() === "light" ? "dark" : "light")}
      className={buttonClasses({ variant: "ghost", size: "sm", className: cn("size-11 px-0 sm:size-9", className) })}
    >
      <span className="contents light:hidden">
        <Sun aria-hidden="true" />
        <span className="sr-only">{labels.toLight}</span>
      </span>
      <span className="hidden light:contents">
        <Moon aria-hidden="true" />
        <span className="sr-only">{labels.toDark}</span>
      </span>
    </button>
  );
}
