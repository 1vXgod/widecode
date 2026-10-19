import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Official WideCode logo for dark backgrounds (dark theme).
 * Source: WIDE_CODE_LOGO_PACK/wide-code-dark.png, with only its fully transparent
 * margin removed (see docs/CHECKLIST.md → Brand assets).
 */
export const LOGO_DARK = {
  src: "/brand/wide-code-logo-dark.png",
  width: 688,
  height: 174,
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

/**
 * The dark logo sits on its own navy pill; the light one has no pill, so at
 * this share of the height its symbol and wordmark match the dark logo's size.
 */
export const LOGO_LIGHT_SCALE = 0.6;

/** Allowed in next.config.ts `images.qualities`; keeps the wordmark crisp. */
export const LOGO_QUALITY = 90;

type LogoProps = {
  /** Rendered height in CSS pixels (of the dark logo); width follows the file's aspect ratio. */
  height?: number;
  /** Use "eager" for above-the-fold placements such as the header. */
  loading?: "eager" | "lazy";
  className?: string;
};

/** Both versions are rendered; CSS shows the one for the current theme (`light:` variant). */
export function Logo({ height = 44, loading = "lazy", className }: LogoProps) {
  const lightHeight = Math.round(height * LOGO_LIGHT_SCALE);
  const common = { quality: LOGO_QUALITY, loading, draggable: false } as const;

  return (
    <>
      <Image
        {...common}
        alt="WideCode"
        src={LOGO_DARK.src}
        width={Math.round((height * LOGO_DARK.width) / LOGO_DARK.height)}
        height={height}
        className={cn("block h-auto max-w-full select-none light:hidden", className)}
      />
      <Image
        {...common}
        alt="WideCode"
        src={LOGO_LIGHT.src}
        width={Math.round((lightHeight * LOGO_LIGHT.width) / LOGO_LIGHT.height)}
        height={lightHeight}
        className={cn("hidden h-auto max-w-full select-none light:block", className)}
      />
    </>
  );
}
