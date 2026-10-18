import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/site-url";

describe("resolveSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL when set, normalized to its origin", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://example.com/some/path/" }).href).toBe(
      "https://example.com/",
    );
  });

  it("prefers the explicit URL over the Vercel production host", () => {
    const url = resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      VERCEL_PROJECT_PRODUCTION_URL: "widecode.vercel.app",
    });
    expect(url.origin).toBe("https://example.com");
  });

  it("falls back to the Vercel production host over https", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "widecode.vercel.app" }).origin).toBe(
      "https://widecode.vercel.app",
    );
  });

  it("falls back to localhost when nothing is configured", () => {
    expect(resolveSiteUrl({}).origin).toBe("http://localhost:3000");
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "   " }).origin).toBe("http://localhost:3000");
  });

  it("rejects invalid explicit URLs instead of silently ignoring them", () => {
    expect(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "example.com" })).toThrow(/NEXT_PUBLIC_SITE_URL/);
    expect(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "ftp://example.com" })).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});
