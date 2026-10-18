import { cacheLife } from "next/cache";

/**
 * Current calendar year for the copyright notice. With Cache Components a bare
 * `new Date()` would break static prerendering, so the value is cached and
 * refreshed daily.
 */
export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
