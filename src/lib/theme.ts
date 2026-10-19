/**
 * Dark and light theme (see src/styles/theme.css).
 *
 * The visitor's explicit choice is saved in localStorage; without one, the
 * system setting (prefers-color-scheme) decides. The active theme is a single
 * tag in <head>, <meta name="widecode-theme" content="dark|light">, which the
 * CSS reads. It is written before the first paint by THEME_SCRIPT (inline in
 * <head>), so there is no flash, and pages stay static (no cookie, no server
 * rendering per visitor). React never renders that tag and the script never
 * touches <html> or other markup React owns, so hydration is unaffected
 * (React 19 leaves unknown tags in <head> alone).
 */

export const themes = ["dark", "light"] as const;
export type Theme = (typeof themes)[number];

export const THEME_STORAGE_KEY = "widecode-theme";
export const THEME_META_NAME = "widecode-theme";
/** Fired on window when the theme changes in this tab. */
export const THEME_CHANGE_EVENT = "widecode-theme-change";
const LIGHT_QUERY = "(prefers-color-scheme: light)";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/** Runs in <head> before the page is painted. Plain ES5, no dependencies; any failure leaves the dark default. */
export const THEME_SCRIPT = `(function(){try{var t;try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia(${JSON.stringify(LIGHT_QUERY)}).matches?"light":"dark";var m=document.createElement("meta");m.name=${JSON.stringify(THEME_META_NAME)};m.content=t;document.head.appendChild(m)}catch(e){}})()`;

function themeMeta(): HTMLMetaElement | null {
  return document.head.querySelector<HTMLMetaElement>(`meta[name="${THEME_META_NAME}"]`);
}

/** The visitor's saved choice, or null to follow the system setting. */
export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function systemTheme(): Theme {
  return window.matchMedia?.(LIGHT_QUERY).matches ? "light" : "dark";
}

/** The theme on screen now (browser only). */
export function currentTheme(): Theme {
  const value = themeMeta()?.content;
  return isTheme(value) ? value : "dark";
}

/** Shows a theme by writing the <head> tag (creating it if something removed it). */
export function showTheme(theme: Theme): void {
  let meta = themeMeta();
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = THEME_META_NAME;
    document.head.appendChild(meta);
  }
  if (meta.content !== theme) meta.content = theme;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/** Saves and shows the visitor's choice. */
export function chooseTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice still applies to this page.
  }
  showTheme(theme);
}

/**
 * Keeps the shown theme in sync: with the system setting while there is no
 * saved choice, and with choices made in other tabs. Returns a cleanup function.
 */
export function watchTheme(onChange: () => void): () => void {
  const media = window.matchMedia?.(LIGHT_QUERY);
  const onSystem = () => {
    if (storedTheme() === null) showTheme(systemTheme());
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) showTheme(storedTheme() ?? systemTheme());
  };
  media?.addEventListener("change", onSystem);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media?.removeEventListener("change", onSystem);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}
