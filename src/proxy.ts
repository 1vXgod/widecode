import { NextResponse, type NextRequest } from "next/server";
import { isNotFoundPath, localeFromPublicPath, NOT_FOUND_LOCALE_HEADER, resolvePublicPath } from "@/i18n/routing";

/**
 * Routes public URLs to app/[lang] (see src/i18n/routing.ts): Albanian URLs
 * stay unprefixed, other languages have their prefix and slugs, /sq/... and
 * internal slugs redirect, and anything that is not a page gets the 404 page
 * with a real 404 status, in the URL's language. The query string is kept.
 */
export function proxy(request: NextRequest) {
  const resolution = resolvePublicPath(request.nextUrl.pathname);
  const url = request.nextUrl.clone();
  url.pathname = resolution.path;
  if (resolution.type === "redirect") return NextResponse.redirect(url, 308);
  if (!isNotFoundPath(resolution.path)) return NextResponse.rewrite(url);

  // The 404 page renders in the language of the URL (always set here, so a value sent by the client never counts).
  const headers = new Headers(request.headers);
  headers.set(NOT_FOUND_LOCALE_HEADER, localeFromPublicPath(request.nextUrl.pathname));
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: [
    // Everything except Next.js internals, files in public/ (brand/*.png, projects/*.jpg) and
    // metadata routes at the app root (icons, robots.txt, sitemap.xml). The social image is
    // per language (app/[lang]/opengraph-image.tsx), so it goes through the proxy.
    "/((?!_next/|__nextjs|_vercel/|brand/[^/]+\\.\\w+$|projects/.+\\.\\w+$|icon\\.png$|apple-icon\\.png$|robots\\.txt$|sitemap\\.xml$).*)",
  ],
};
