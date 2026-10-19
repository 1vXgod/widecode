import { projectSlugs, type ProjectSlug } from "@/config/projects";
import { routes, type RouteKey } from "@/config/routes";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * Maps public URLs to the app's routes, which all live under app/[lang] with
 * the Albanian slugs as folder names (src/config/routes.ts is the page identity).
 *
 * - Albanian, the default language, has no prefix: /sherbimet is served by
 *   /sq/sherbimet, and /sq/... redirects to the unprefixed URL.
 * - Other languages have a prefix and their own slugs: /en/services is served
 *   by /en/sherbimet, and /en/sherbimet redirects to /en/services.
 * - Every page has exactly one address per language. Query strings and
 *   #anchors are untouched (the proxy keeps the query; anchors never reach
 *   the server); section anchors and parameter names are the same in every
 *   language, so they carry over when switching.
 */

/** Public paths per language. Albanian is the route table itself. */
export const localizedRoutes = {
  sq: routes,
  en: {
    home: "/en",
    services: "/en/services",
    projects: "/en/projects",
    pricing: "/en/pricing",
    estimator: "/en/price-calculator",
    about: "/en/about",
    faq: "/en/faq",
    contact: "/en/contact",
  },
  de: {
    home: "/de",
    services: "/de/leistungen",
    projects: "/de/projekte",
    pricing: "/de/preise",
    estimator: "/de/preisrechner",
    about: "/de/ueber-uns",
    faq: "/de/faq",
    contact: "/de/kontakt",
  },
} as const satisfies Record<Locale, Record<RouteKey, string>>;

/** Route-like metadata files served per language (app/[lang]/opengraph-image.tsx). */
const LOCALE_FILES = new Set(["opengraph-image"]);

/**
 * Internal path for "no such page". No route matches it, so Next.js answers
 * with app/global-not-found.tsx: the site's complete 404 page, status 404.
 * Unknown URLs are sent here instead of into a page that would first stream
 * a 200 (see below).
 */
export const NOT_FOUND_SEGMENT = "_nuk-ekziston";

/**
 * Request header with the language of a URL sent to the 404 page. The proxy
 * sets it (overwriting any value the client sent), so app/global-not-found.tsx,
 * which has no route params, renders the page in the URL's language.
 */
export const NOT_FOUND_LOCALE_HEADER = "x-widecode-locale";

/** Whether an internal path is the 404 path that resolvePublicPath() returns. */
export function isNotFoundPath(path: string): boolean {
  return splitPath(path)[1] === NOT_FOUND_SEGMENT;
}

const routeKeys = Object.keys(routes) as RouteKey[];
const knownProjects = new Set<string>(projectSlugs);

export type RouteResolution =
  /** Serve this internal path; the address bar keeps the public URL. */
  | { type: "rewrite"; path: string }
  /** Permanently move to this public path. */
  | { type: "redirect"; path: string };

/** A page, identified independently of its language. */
type PageRef = { key: RouteKey } | { key: "project"; slug: ProjectSlug };

/** Decodes a path segment, or null when its percent-encoding is malformed (e.g. "%E0%A4%A"). */
function decodeSegment(segment: string): string | null {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

function splitPath(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

/** Path of a page in a language's own URL space (public paths, or internal folder paths for "sq"). */
function pathFor(table: Record<RouteKey, string>, page: PageRef): string {
  return page.key === "project" ? `${table.projects}/${page.slug}` : table[page.key];
}

/** Public URL path of a page in a language. */
export function pagePath(locale: Locale, page: PageRef): string {
  return pathFor(localizedRoutes[locale], page);
}

/** Finds the page a path refers to in a URL space, or null. Project slugs may be percent-encoded. */
function findPage(table: Record<RouteKey, string>, pathname: string): PageRef | null {
  const key = routeKeys.find((k) => table[k] === pathname);
  if (key) return { key };
  // Project details: only the known slugs. With Cache Components an unknown slug would
  // stream the detail page's prerendered shell (status 200) before it could call notFound().
  const segments = splitPath(pathname);
  const base = splitPath(table.projects);
  if (segments.length === base.length + 1 && base.every((segment, i) => segments[i] === segment)) {
    const slug = decodeSegment(segments.at(-1)!);
    if (slug !== null && knownProjects.has(slug)) return { key: "project", slug: slug as ProjectSlug };
  }
  return null;
}

/** The language of a public path (its prefix, or the default language). */
export function localeFromPublicPath(pathname: string): Locale {
  const first = splitPath(pathname)[0];
  return first !== defaultLocale && isLocale(first) ? first : defaultLocale;
}

/** Internal path (under app/[lang]) for a page in a language. */
function internalPath(locale: Locale, page: PageRef | null): string {
  if (page === null) return `/${locale}/${NOT_FOUND_SEGMENT}`;
  const path = pathFor(routes, page);
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Resolves a public pathname (without query string) to an internal route or a redirect. */
export function resolvePublicPath(pathname: string): RouteResolution {
  const segments = splitPath(pathname);
  const locale = localeFromPublicPath(pathname);

  // Per-language metadata files: /opengraph-image (Albanian) and /en/opengraph-image.
  const file = locale === defaultLocale ? segments : segments.slice(1);
  if (file.length === 1 && LOCALE_FILES.has(file[0]!)) return { type: "rewrite", path: `/${locale}/${file[0]}` };

  // /sq and /sq/... duplicate the unprefixed Albanian URLs.
  if (segments[0] === defaultLocale) {
    return { type: "redirect", path: `/${segments.slice(1).join("/")}` };
  }

  const page = findPage(localizedRoutes[locale], pathname);
  if (page) return { type: "rewrite", path: internalPath(locale, page) };

  if (locale !== defaultLocale) {
    // /en/sherbimet (the internal folder name) is the same page as /en/services.
    const internal = findPage(routes, `/${segments.slice(1).join("/")}`);
    if (internal) return { type: "redirect", path: pagePath(locale, internal) };
  }

  return { type: "rewrite", path: internalPath(locale, null) };
}

/**
 * The public URL path for a pathname that may be internal. Pages are prerendered
 * at their internal path (/sq/sherbimet, /en/sherbimet), while the browser shows
 * the public one (/sherbimet, /en/services); anything rendered from the path must
 * use this so both agree.
 */
export function toPublicPath(pathname: string): string {
  const [first, ...rest] = splitPath(pathname);
  if (!isLocale(first)) return pathname;
  const page = findPage(routes, `/${rest.join("/")}`);
  if (page) return pagePath(first, page);
  // A public path that starts with a language prefix (e.g. /en/services) is already public.
  return first === defaultLocale ? `/${rest.join("/")}` : pathname;
}

/**
 * Translates an internal link (written with the Albanian routes, e.g.
 * "/sherbimet#online-shop" or "/kontakt?paketa=business") into a language's
 * URL, keeping the query string and anchor. Other links are returned as they are.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === defaultLocale || !href.startsWith("/")) return href;
  const match = /^([^?#]*)(.*)$/.exec(href)!;
  const page = findPage(routes, match[1]!);
  return page ? pagePath(locale, page) + match[2] : href;
}

/**
 * The same page in another language, for the language switcher. Falls back to
 * that language's home page when the current path is not a known page (e.g. a
 * 404), so a switch never leads to a broken URL.
 */
export function switchLocalePath(publicPath: string, target: Locale): string {
  const page = findPage(localizedRoutes[localeFromPublicPath(publicPath)], publicPath);
  return pagePath(target, page ?? { key: "home" });
}

/** Every public page, in every language, for the sitemap and tests. */
export function allPages(): PageRef[] {
  return [...routeKeys.map((key) => ({ key })), ...projectSlugs.map((slug) => ({ key: "project" as const, slug }))];
}

export type { PageRef };
