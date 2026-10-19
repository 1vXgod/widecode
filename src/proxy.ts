import { NextResponse, type NextRequest } from "next/server";
import { resolvePublicPath } from "@/i18n/routing";

/**
 * Routes public URLs to app/[lang] (see src/i18n/routing.ts): Albanian URLs
 * stay unprefixed, /sq/... redirects to them, and unknown project slugs get a
 * real 404 status. The query string is kept as it is.
 */
export function proxy(request: NextRequest) {
  const resolution = resolvePublicPath(request.nextUrl.pathname);
  const url = request.nextUrl.clone();
  url.pathname = resolution.path;
  return resolution.type === "redirect" ? NextResponse.redirect(url, 308) : NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except Next.js internals, files in public/ (brand/*.png, projects/*.jpg) and
    // metadata routes at the app root (icons, social image, robots.txt, sitemap.xml).
    "/((?!_next/|__nextjs|_vercel/|brand/[^/]+\\.\\w+$|projects/.+\\.\\w+$|icon\\.png$|apple-icon\\.png$|opengraph-image$|robots\\.txt$|sitemap\\.xml$).*)",
  ],
};
