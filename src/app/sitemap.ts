import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/lib/seo";

/**
 * Every public page and website concept, with absolute URLs on the production
 * domain (NEXT_PUBLIC_SITE_URL). Empty until that domain is configured, so no
 * localhost or temporary address is ever listed. No lastModified dates: the
 * site has no reliable per-page dates, and wrong ones would mislead crawlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries();
}
