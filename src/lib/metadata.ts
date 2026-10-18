import type { Metadata } from "next";
import type { RouteKey } from "@/config/routes";
import { getDictionary } from "@/content";

/** Metadata for a finished (indexable) page, from the page copy in the dictionary. */
export function pageMetadata(page: Exclude<RouteKey, "home">): Metadata {
  const { title, description } = getDictionary().pages[page];
  return { title, description };
}
