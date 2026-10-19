import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The e2e tests build into their own folder (see playwright.config.ts), so
  // they never overwrite or reuse the regular build in .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // 90 is used for the logo (src/components/brand/logo.tsx) to keep the wordmark crisp.
    qualities: [75, 90],
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
