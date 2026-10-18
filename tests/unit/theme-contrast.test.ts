import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(__dirname, "../../src/styles/theme.css"), "utf8");

function token(name: string): string {
  const match = css.match(new RegExp(`--wc-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  if (!match?.[1]) throw new Error(`Hex token --wc-${name} not found in theme.css`);
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

describe("theme color contrast (WCAG AA)", () => {
  const textPairs: Array<[foreground: string, background: string]> = [
    ["fg", "bg"],
    ["fg-muted", "bg"],
    ["fg-subtle", "bg"],
    ["accent-text", "bg"],
    ["fg", "surface"],
    ["fg-muted", "surface"],
    ["fg-subtle", "surface"],
    ["accent-text", "surface"],
    ["fg-muted", "surface-raised"],
    ["accent-fg", "accent"],
    ["accent-fg", "accent-hover"],
    ["danger", "bg"],
    ["success", "bg"],
  ];

  it.each(textPairs)("%s on %s is at least 4.5:1", (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it("focus ring is at least 3:1 against the page background", () => {
    expect(contrast(token("ring"), token("bg"))).toBeGreaterThanOrEqual(3);
  });
});
