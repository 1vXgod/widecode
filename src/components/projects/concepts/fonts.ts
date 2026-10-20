import { Bebas_Neue, Cormorant_Garamond } from "next/font/google";

/**
 * Display fonts used only inside portfolio concept canvases, to give each
 * concept its own character. Not preloaded: they are not needed for the
 * first paint of the page itself. Their variables are set on <html> (see
 * src/app/fonts.ts).
 */
export const conceptSerif = Cormorant_Garamond({
  variable: "--font-concept-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  display: "swap",
  preload: false,
});

export const conceptCondensed = Bebas_Neue({
  variable: "--font-concept-condensed",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const conceptFontVariables = `${conceptSerif.variable} ${conceptCondensed.variable}`;
