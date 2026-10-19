import { Geist, Sora } from "next/font/google";

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

/** Classes for <html> in every document the app renders (root layout and global 404). */
export const htmlClassName = `${geist.variable} ${sora.variable} antialiased`;
