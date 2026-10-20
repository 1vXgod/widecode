import { Geist, Sora } from "next/font/google";
import { conceptFontVariables } from "@/components/projects/concepts/fonts";

// Both fonts include the Latin-1 range, which covers Albanian ë and ç.
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/**
 * Classes for <html> in every document the app renders (root layout and global 404).
 * The concept fonts' variables are set here too, so their small @font-face CSS is
 * part of the global stylesheet: as a separate chunk of the project pages, every
 * page's prefetch of the "Projects" link preloaded it without using it (a browser
 * console warning). Their font files still load only where a concept uses them.
 */
export const htmlClassName = `${geist.variable} ${sora.variable} ${conceptFontVariables} antialiased`;
