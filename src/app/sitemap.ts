import type { MetadataRoute } from "next";
import { projectHref, projectSlugs } from "@/config/projects";
import { routes } from "@/config/routes";
import { absoluteUrl } from "@/lib/seo";

/**
 * Every public page, with absolute URLs on the configured site origin
 * (NEXT_PUBLIC_SITE_URL, see src/lib/site-url.ts). No lastModified dates:
 * the site has no reliable per-page dates, and wrong ones would mislead crawlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...Object.values(routes), ...projectSlugs.map(projectHref)];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
