import { describe, expect, it } from "vitest";
import { footerNav, mainNav, routes, type RouteKey } from "@/config/routes";
import { getDictionary } from "@/content";
import { locales } from "@/i18n/config";

function collectStrings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => collectStrings(child, path ? `${path}.${key}` : key));
  }
  return [];
}

describe.each(locales)("dictionary (%s)", (locale) => {
  const dict = getDictionary(locale);

  it("has a navigation label for every route", () => {
    for (const key of Object.keys(routes) as RouteKey[]) {
      expect(dict.nav[key], key).toBeTruthy();
    }
  });

  it("has page copy for every non-home route", () => {
    for (const key of Object.keys(routes) as RouteKey[]) {
      if (key === "home") continue;
      expect(dict.pages[key].title, key).toBeTruthy();
      expect(dict.pages[key].description, key).toBeTruthy();
    }
  });

  it("contains no empty or untrimmed strings", () => {
    for (const [path, text] of collectStrings(dict)) {
      expect(text.trim(), path).not.toBe("");
      expect(text, path).toBe(text.trim());
    }
  });
});

describe("Albanian copy", () => {
  const strings = collectStrings(getDictionary("sq"));

  it("uses ë and ç instead of ASCII fallbacks for common words", () => {
    const asciiFallbacks = /\b(sherbim|cmim|pergatit|pershtat|kerko|kthehu ne)/i;
    for (const [path, text] of strings) {
      expect(text, path).not.toMatch(asciiFallbacks);
    }
  });
});

describe("navigation config", () => {
  it("only references known routes and has no duplicates", () => {
    for (const list of [mainNav, footerNav]) {
      expect(new Set(list).size).toBe(list.length);
      for (const key of list) expect(routes[key]).toMatch(/^\//);
    }
  });

  it("uses unique paths", () => {
    const paths = Object.values(routes);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
