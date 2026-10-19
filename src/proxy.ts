import { NextResponse, type NextRequest } from "next/server";
import { resolvePublicPath } from "@/i18n/routing";

/**
 * Routes public URLs to app/[lang] (see src/i18n/routing.ts): Albanian URLs
 * stay unprefixed, other languages have their prefix and slugs, /sq/... and
 * internal slugs redirect, and anything that is not a page gets the 404 page
 * with a real 404 status. The query string is kept.
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
    // metadata routes at the app root (icons, robots.txt, sitemap.xml). The social image is
    // per language (app/[lang]/opengraph-image.tsx), so it goes through the proxy.
    "/((?!_next/|__nextjs|_vercel/|brand/[^/]+\\.\\w+$|projects/.+\\.\\w+$|icon\\.png$|apple-icon\\.png$|robots\\.txt$|sitemap\\.xml$).*)",
  ],
};
