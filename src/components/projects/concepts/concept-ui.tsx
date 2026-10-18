import Image from "next/image";
import { cn } from "@/lib/cn";

export type ConceptDevice = "desktop" | "mobile";

export type ConceptProps = {
  device: ConceptDevice;
  /** `sizes` for the images, matching how wide the frame is rendered. */
  sizes: string;
  /** Load the main image eagerly (e.g. the first screen of a detail page). */
  eager?: boolean;
};

type ConceptImageProps = {
  src: string;
  sizes: string;
  eager?: boolean;
  className?: string;
  /** CSS object-position, e.g. "center 30%". */
  position?: string;
};

/**
 * Photo inside a concept canvas. Decorative: the frame carries the accessible
 * description, so the image itself has an empty alt.
 */
export function ConceptImage({ src, sizes, eager = false, className, position }: ConceptImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        quality={75}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
