import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(__dirname, "../../src/styles/theme.css"), "utf8");

/** The token declarations of a theme block in theme.css. */
function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Theme block "${selector}" not found in theme.css`);
  return css.slice(start, css.indexOf("\n}", start));
}

const themes = {
  dark: block(":root"),
  light: block(':root:has(meta[name="widecode-theme"][content="light"])'),
};

function token(theme: keyof typeof themes, name: string): string {
  const match = themes[theme].match(new RegExp(`--wc-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  if (!match?.[1]) throw new Error(`Hex token --wc-${name} not found in the ${theme} theme`);
  return match[1];
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const textPairs: Array<[foreground: string, background: string]> = [
  ["fg", "bg"],
  ["fg-muted", "bg"],
  ["fg-subtle", "bg"],
  ["accent-text", "bg"],
  ["accent-2", "bg"],
  ["fg", "surface"],
  ["fg-muted", "surface"],
  ["fg-subtle", "surface"],
  ["accent-text", "surface"],
  ["accent-2", "surface"],
  ["fg-muted", "surface-raised"],
  ["fg-subtle", "surface-raised"],
  ["accent-fg", "accent"],
  ["accent-fg", "accent-hover"],
  ["danger", "bg"],
  ["danger", "surface"],
  ["success", "bg"],
  ["success", "surface"],
];

describe.each(Object.keys(themes) as Array<keyof typeof themes>)("%s theme color contrast (WCAG AA)", (theme) => {
  it.each(textPairs)("%s on %s is at least 4.5:1", (fg, bg) => {
    expect(contrast(token(theme, fg), token(theme, bg))).toBeGreaterThanOrEqual(4.5);
  });

  it("focus ring is at least 3:1 against the page and card backgrounds", () => {
    expect(contrast(token(theme, "ring"), token(theme, "bg"))).toBeGreaterThanOrEqual(3);
    expect(contrast(token(theme, "ring"), token(theme, "surface"))).toBeGreaterThanOrEqual(3);
  });

  it("defines every token the other theme defines", () => {
    const names = (text: string) => [...text.matchAll(/--wc-([\w-]+):/g)].map((m) => m[1]).sort();
    expect(names(themes[theme])).toEqual(names(themes.dark));
  });
});

describe("brand color", () => {
  it("is the logo's royal blue in both themes", () => {
    expect(token("dark", "accent")).toBe("#1034f8");
    expect(token("light", "accent")).toBe("#1034f8");
  });
});
