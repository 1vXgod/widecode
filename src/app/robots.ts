import type { MetadataRoute } from "next";
import { robotsRules } from "@/lib/seo";

/**
 * Production on the configured domain allows crawling and points to the
 * sitemap; previews, local builds and deployments without a domain are blocked.
 */
export default function robots(): MetadataRoute.Robots {
  return robotsRules();
}
