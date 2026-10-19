import { describe, expect, it } from "vitest";
import { projectHref, projectSlugs } from "@/config/projects";
import { routes } from "@/config/routes";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { NOT_FOUND_SEGMENT, resolvePublicPath, toPublicPath } from "@/i18n/routing";

const notFound = { type: "rewrite", path: `/sq/${NOT_FOUND_SEGMENT}` };

describe("resolvePublicPath", () => {
  it("serves every Albanian page from app/[lang] without changing its public URL", () => {
    expect(resolvePublicPath("/")).toEqual({ type: "rewrite", path: "/sq" });
    for (const path of Object.values(routes).filter((p) => p !== "/")) {
      expect(resolvePublicPath(path), path).toEqual({ type: "rewrite", path: `/sq${path}` });
    }
  });

  it("serves every project page, also when its slug is percent-encoded", () => {
    for (const slug of projectSlugs) {
      expect(resolvePublicPath(projectHref(slug))).toEqual({ type: "rewrite", path: `/sq${projectHref(slug)}` });
    }
    expect(resolvePublicPath("/projektet/studio%2Dfotografie")).toEqual({
      type: "rewrite",
      path: "/sq/projektet/studio-fotografie",
    });
  });

  it("redirects /sq and /sq/... to the unprefixed Albanian URL, so each page has one address", () => {
    expect(resolvePublicPath("/sq")).toEqual({ type: "redirect", path: "/" });
    expect(resolvePublicPath("/sq/")).toEqual({ type: "redirect", path: "/" });
    expect(resolvePublicPath("/sq/sherbimet")).toEqual({ type: "redirect", path: "/sherbimet" });
    expect(resolvePublicPath("/sq/projektet/klinike-dentare")).toEqual({ type: "redirect", path: "/projektet/klinike-dentare" });
  });

  it("sends unknown pages, project slugs and languages to the 404 page", () => {
    for (const path of [
      "/nuk-ekziston",
      "/Sherbimet",
      "/sherbimet/extra",
      "/projektet/nuk-ekziston",
      "/projektet/%E0%A4%A",
      "/projektet/studio-fotografie/extra",
      "/fr",
      "/fr/services",
      "/es/servicios",
      "/foo.php",
      `/${NOT_FOUND_SEGMENT}`,
    ]) {
      expect(resolvePublicPath(path), path).toEqual(notFound);
    }
  });

  it("never exposes or accepts the internal language segment as a second address", () => {
    expect(resolvePublicPath("/sq/sq/sherbimet")).toEqual({ type: "redirect", path: "/sq/sherbimet" });
    expect(resolvePublicPath("/sqsherbimet")).toEqual(notFound);
  });
});

describe("toPublicPath", () => {
  it("turns the internal path a page is prerendered at back into its public path", () => {
    for (const path of Object.values(routes)) {
      const internal = (resolvePublicPath(path) as { path: string }).path;
      expect(toPublicPath(internal), path).toBe(path);
    }
    expect(toPublicPath("/sq/projektet/klinike-dentare")).toBe("/projektet/klinike-dentare");
  });

  it("leaves public paths unchanged, so server and browser agree", () => {
    for (const path of ["/", "/sherbimet", "/projektet/klinike-dentare", "/sqsherbimet"]) {
      expect(toPublicPath(path)).toBe(path);
    }
  });
});

describe("locale config", () => {
  it("has Albanian as the default, published locale", () => {
    expect(defaultLocale).toBe("sq");
    expect(locales).toContain(defaultLocale);
    expect(isLocale("sq")).toBe(true);
    // English (Phase B) and German (Phase C) are published; anything else is not a locale.
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(true);
    for (const value of ["fr", "DE", "de-DE", "", null, undefined, 1]) expect(isLocale(value)).toBe(false);
  });
});
