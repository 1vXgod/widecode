import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy without nonces: nonces would force every page to
 * render per request and disable prerendering. Everything the site loads is
 * same-origin (self-hosted fonts and images, no third-party scripts), so
 * 'self' is enough; 'unsafe-inline' is needed for Next.js's inline scripts and
 * style attributes, and 'unsafe-eval' only for React's debugging in `next dev`.
 * Adding analytics, embeds or other third parties means extending this list.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Older browsers that ignore CSP frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Browsers only honour this over HTTPS. No includeSubDomains/preload: other
  // subdomains of the future domain may not serve HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig: NextConfig = {
  // The e2e tests build into their own folder (see playwright.config.ts), so
  // they never overwrite or reuse the regular build in .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: {
    // The root layout lives in app/[lang]; unmatched URLs are served from
    // app/global-not-found.tsx (complete page, status 404). See src/i18n/routing.ts.
    globalNotFound: true,
  },
  images: {
    // 90 is used for the logo (src/components/brand/logo.tsx) to keep the wordmark crisp.
    qualities: [75, 90],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
