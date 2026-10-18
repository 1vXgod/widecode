import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/lib/seo";

/** Production allows crawling and points to the sitemap; Vercel previews are blocked. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
