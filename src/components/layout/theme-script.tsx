import { THEME_SCRIPT } from "@/lib/theme";

/**
 * Applies the saved or system theme before the first paint (see src/lib/theme.ts).
 * Render it first in <head> of every document the app renders. A Server
 * Component: the browser runs it while parsing; React never runs it again.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
