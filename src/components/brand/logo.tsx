import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Official WideCode logo for dark backgrounds (dark theme): white "WIDE", blue
 * "CODE". Source: WIDE_CODE_LOGO_PACK/wide-code-dark.png, the pack's only
 * lockup for dark backgrounds, which comes on a baked-in navy pill. Only the
 * pill (with its rim and shadow) was removed, so the logo sits directly on the
 * site's surfaces: artwork pixels keep their exact colors, anti-aliased edges
 * the alpha that reproduces them over the pill (see docs/CHECKLIST.md → Brand assets).
 */
export const LOGO_DARK = {
  src: "/brand/wide-code-logo-on-dark.png",
  width: 562,
  height: 102,
} as const;

/**
 * Official WideCode logo for light backgrounds (light theme): navy "WIDE",
 * blue "CODE". Source: WIDE_CODE_LOGO_PACK/wide-code-horizontal.png, with only
 * its fully transparent margin removed (pixel-identical otherwise).
 */
export const LOGO_LIGHT = {
  src: "/brand/wide-code-logo-light.png",
  width: 694,
  height: 139,
} as const;

/** Allowed in next.config.ts `images.qualities`; keeps the wordmark crisp. */
export const LOGO_QUALITY = 90;

type LogoProps = {
  /**
   * Rendered height in CSS pixels. Both files are cropped to the artwork, with
   * the symbol as its tallest part, so the logo has the same size in both themes;
   * the width follows each file's aspect ratio.
   */
  height?: number;
  /** Use "eager" for above-the-fold placements such as the header. */
  loading?: "eager" | "lazy";
  className?: string;
};

/** Both versions are rendered; CSS shows the one for the current theme (`light:` variant). */
export function Logo({ height = 26, loading = "lazy", className }: LogoProps) {
  const common = { quality: LOGO_QUALITY, loading, draggable: false, height } as const;

  return (
    <>
      <Image
        {...common}
        alt="WideCode"
        src={LOGO_DARK.src}
        width={Math.round((height * LOGO_DARK.width) / LOGO_DARK.height)}
        className={cn("block h-auto max-w-full select-none light:hidden", className)}
      />
      <Image
        {...common}
        alt="WideCode"
        src={LOGO_LIGHT.src}
        width={Math.round((height * LOGO_LIGHT.width) / LOGO_LIGHT.height)}
        className={cn("hidden h-auto max-w-full select-none light:block", className)}
      />
    </>
  );
}
