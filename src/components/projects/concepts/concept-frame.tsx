import type { ComponentType, CSSProperties } from "react";
import { Lock } from "lucide-react";
import type { ProjectSlug } from "@/config/projects";
import { cn } from "@/lib/cn";
import { DentalConcept } from "./dental-concept";
import { FashionConcept } from "./fashion-concept";
import { GymConcept } from "./gym-concept";
import { LocalProductsConcept } from "./local-products-concept";
import { PhotographyConcept } from "./photography-concept";
import { RestaurantConcept } from "./restaurant-concept";
import type { ConceptDevice, ConceptProps } from "./concept-ui";

const conceptComponents: Record<ProjectSlug, ComponentType<ConceptProps>> = {
  "studio-fotografie": PhotographyConcept,
  "restorant-tradicional": RestaurantConcept,
  "klinike-dentare": DentalConcept,
  "dyqan-veshjesh": FashionConcept,
  "produkte-vendore": LocalProductsConcept,
  "panel-palestre": GymConcept,
};

/** Address shown in the browser bar: the fictional brand, without a real domain. */
const addressLabels: Record<ProjectSlug, string> = {
  "studio-fotografie": "dritehije",
  "restorant-tradicional": "oxhaku",
  "klinike-dentare": "aura-dental",
  "dyqan-veshjesh": "elara",
  "produkte-vendore": "bleta-toka",
  "panel-palestre": "ritmi / paneli",
};

const DESIGN_WIDTH: Record<ConceptDevice, number> = { desktop: 1280, mobile: 390 };

type ConceptFrameProps = {
  slug: ProjectSlug;
  device: ConceptDevice;
  /** Accessible description of the preview (the mock content inside is decorative). */
  label: string;
  /** `sizes` for the images, matching the rendered width of the frame. */
  sizes: string;
  eager?: boolean;
  className?: string;
};

/**
 * A website concept rendered as a live, scaled homepage inside a browser
 * window (desktop) or a phone (mobile). See `.concept-canvas` in globals.css.
 */
export function ConceptFrame({ slug, device, label, sizes, eager, className }: ConceptFrameProps) {
  const Concept = conceptComponents[slug];
  const canvasStyle = { "--design-width": DESIGN_WIDTH[device] } as CSSProperties;

  if (device === "mobile") {
    return (
      <div role="img" aria-label={label} className={cn("mx-auto w-full", className)}>
        <div className="@container rounded-[2.4rem] border-[7px] border-[#1c1c22] bg-black shadow-2xl shadow-black/60">
          <div className="concept-canvas relative aspect-[390/844] overflow-hidden rounded-[1.9rem]" style={canvasStyle}>
            <Concept device="mobile" sizes={sizes} eager={eager} />
            {/* Phone notch */}
            <span className="absolute top-3 left-1/2 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "@container overflow-hidden rounded-[0.9rem] border border-white/10 bg-[#0d0d11] shadow-2xl shadow-black/50",
        className,
      )}
    >
      <div className="flex items-center gap-[0.8cqw] border-b border-white/10 bg-[#16161b] px-[1.4cqw] py-[1cqw]">
        <span className="size-[0.9cqw] rounded-full bg-[#ff5f57]/80" />
        <span className="size-[0.9cqw] rounded-full bg-[#febc2e]/80" />
        <span className="size-[0.9cqw] rounded-full bg-[#28c840]/80" />
        <span className="mx-auto flex items-center gap-[0.5cqw] rounded-full bg-white/[0.06] px-[1.4cqw] py-[0.4cqw] text-[1.1cqw] text-white/60">
          <Lock className="size-[1cqw]" />
          {addressLabels[slug]}
        </span>
        <span className="w-[3.6cqw]" />
      </div>
      <div className="concept-canvas relative aspect-[16/10] overflow-hidden" style={canvasStyle}>
        <Concept device="desktop" sizes={sizes} eager={eager} />
      </div>
    </div>
  );
}
