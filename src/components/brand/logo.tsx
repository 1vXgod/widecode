import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Official WideCode logo for dark backgrounds.
 * Source: WIDE_CODE_LOGO_PACK/wide-code-dark.png, with only its fully transparent
 * margin removed (see docs/CHECKLIST.md → Brand assets).
 */
export const LOGO_DARK = {
  src: "/brand/wide-code-logo-dark.png",
  width: 688,
  height: 174,
} as const;

/** Allowed in next.config.ts `images.qualities`; keeps the wordmark crisp. */
export const LOGO_QUALITY = 90;

type LogoProps = {
  /** Rendered height in CSS pixels; width follows the file's aspect ratio. */
  height?: number;
  /** Use "eager" for above-the-fold placements such as the header. */
  loading?: "eager" | "lazy";
  className?: string;
};

export function Logo({ height = 44, loading = "lazy", className }: LogoProps) {
  const width = Math.round((height * LOGO_DARK.width) / LOGO_DARK.height);

  return (
    <Image
      src={LOGO_DARK.src}
      alt="WideCode"
      width={width}
      height={height}
      quality={LOGO_QUALITY}
      loading={loading}
      draggable={false}
      className={cn("block h-auto max-w-full select-none", className)}
    />
  );
}
