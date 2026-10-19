"use client";

import { usePathname } from "next/navigation";
import { toPublicPath } from "./routing";

/**
 * The current page's public path (e.g. /sherbimet), the same during the build's
 * prerender (which only knows the internal /sq/sherbimet) and in the browser.
 * Use it instead of usePathname() for anything rendered from the path, such
 * as the current-page marker in the navigation; otherwise hydration fails.
 */
export function usePublicPathname(): string {
  return toPublicPath(usePathname());
}
