import { projectHref, projectSlugs } from "@/config/projects";
import { routes } from "@/config/routes";
import { defaultLocale } from "@/i18n/config";

/**
 * Maps public URLs to the app's routes, which all live under app/[lang].
 *
 * Albanian, the default language, keeps its URLs without a prefix: /sherbimet
 * is served by /sq/sherbimet, and /sq/... itself redirects to the unprefixed
 * URL so every page has exactly one address. Query strings and #anchors are
 * untouched (the proxy keeps the query; anchors never reach the server).
 */

/**
 * Internal path for "no such page". No route matches it, so Next.js answers
 * with app/global-not-found.tsx: the site's complete 404 page, status 404.
 * Unknown URLs are sent here instead of into a page that would first stream
 * a 200 (see below).
 */
export const NOT_FOUND_SEGMENT = "_nuk-ekziston";

const publicPages = new Set<string>(Object.values(routes));
const knownProjects = new Set<string>(projectSlugs);

export type RouteResolution =
  /** Serve this internal path; the address bar keeps the public URL. */
  | { type: "rewrite"; path: string }
  /** Permanently move to this public path. */
  | { type: "redirect"; path: string };

/** Decodes a path segment, or null when its percent-encoding is malformed (e.g. "%E0%A4%A"). */
function decodeSegment(segment: string): string | null {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

/** The public page a pathname refers to (as its canonical path), or null if there is none. */
function findPage(pathname: string, segments: readonly string[]): string | null {
  if (publicPages.has(pathname)) return pathname;
  // Project details: only the known slugs. With Cache Components an unknown slug would
  // stream the detail page's prerendered shell (status 200) before it could call notFound().
  if (segments.length === 2 && `/${segments[0]}` === routes.projects) {
    const slug = decodeSegment(segments[1]!);
    if (slug !== null && knownProjects.has(slug)) return projectHref(slug as (typeof projectSlugs)[number]);
  }
  return null;
}

/**
 * The public URL path for a pathname that may be internal. Pages are prerendered
 * at their internal path (/sq/sherbimet), while the browser shows the public one
 * (/sherbimet); anything rendered from the path must use this so both agree.
 */
export function toPublicPath(pathname: string): string {
  const prefix = `/${defaultLocale}`;
  if (pathname === prefix) return "/";
  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}

/** Resolves a public pathname (without query string) to an internal route or a redirect. */
export function resolvePublicPath(pathname: string): RouteResolution {
  const segments = pathname.split("/").filter(Boolean);

  // /sq and /sq/... duplicate the unprefixed Albanian URLs.
  if (segments[0] === defaultLocale) {
    return { type: "redirect", path: `/${segments.slice(1).join("/")}` };
  }

  const page = findPage(pathname, segments);
  return { type: "rewrite", path: `/${defaultLocale}${page === null ? `/${NOT_FOUND_SEGMENT}` : page === "/" ? "" : page}` };
}
