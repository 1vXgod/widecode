import { NextResponse, type NextRequest } from "next/server";
import { projectSlugs } from "@/config/projects";

const knownProjects = new Set<string>(projectSlugs);

/** The project slug of a /projektet/<slug> path, or null when its encoding is malformed (e.g. "%E0%A4%A"). */
function projectSlugFromPath(pathname: string): string | null {
  try {
    return decodeURIComponent(pathname.split("/")[2] ?? "");
  } catch {
    return null;
  }
}

/**
 * Returns a real 404 for unknown project slugs.
 *
 * With Cache Components, /projektet/[slug] streams a prerendered shell for
 * unknown slugs, so a notFound() in the page arrives after the 200 status has
 * been sent (a "soft 404"). Checking here, before rendering, lets Next.js
 * serve the not-found page with a proper 404 status.
 */
export function proxy(request: NextRequest) {
  const slug = projectSlugFromPath(request.nextUrl.pathname);
  if (slug === null || !knownProjects.has(slug)) {
    // A path without a route renders app/not-found.tsx with status 404.
    return NextResponse.rewrite(new URL("/_projekti-nuk-ekziston", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/projektet/:slug",
};
