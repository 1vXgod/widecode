import { ArrowRight, ArrowDown, Menu } from "lucide-react";
import { concepts } from "@/content/sq/concepts";
import { ConceptImage, type ConceptProps } from "./concept-ui";

const copy = concepts["studio-fotografie"];
const img = (name: string) => `/projects/studio-fotografie/${name}.jpg`;

/** Landscape & portrait photographer: dark, full-bleed, editorial serif. */
export function PhotographyConcept({ device, sizes, eager }: ConceptProps) {
  if (device === "mobile") {
    return (
      <div className="absolute inset-0 bg-[#0c0d10] text-white">
        <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="absolute inset-0" position="60% center" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/50" />
        <header className="absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-14">
          <span className="font-concept-serif text-xl tracking-[0.3em]">{copy.brand}</span>
          <Menu className="size-6" />
        </header>
        <div className="absolute inset-x-6 bottom-12">
          <p className="text-xs tracking-[0.25em] text-white/70 uppercase">{copy.eyebrow}</p>
          <p className="mt-4 font-concept-serif text-5xl leading-[1.02]">{copy.title}</p>
          <p className="mt-4 text-base text-white/75">{copy.text}</p>
          <span className="mt-8 flex items-center justify-center gap-2 rounded-full bg-white py-4 text-sm font-semibold text-black">
            {copy.primary} <ArrowRight className="size-4" />
          </span>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {(["gallery-1", "gallery-2"] as const).map((name, i) => (
              <div key={name}>
                <ConceptImage src={img(name)} sizes="120px" className="h-24 rounded-lg" />
                <p className="mt-2 text-xs text-white/70">{copy.series[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#0c0d10] text-white">
      <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="absolute inset-0" />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-black/45" />
      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-14 py-9">
        <span className="font-concept-serif text-2xl tracking-[0.35em]">{copy.brand}</span>
        <nav className="flex gap-10 text-sm text-white/80">
          {copy.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <span className="rounded-full border border-white/50 px-6 py-2.5 text-sm">{copy.cta}</span>
      </header>

      <div className="absolute bottom-16 left-14 w-150">
        <p className="text-xs tracking-[0.3em] text-white/70 uppercase">{copy.eyebrow}</p>
        <p className="mt-5 font-concept-serif text-7xl leading-[0.98]">{copy.title}</p>
        <p className="mt-6 w-115 text-lg text-white/75">{copy.text}</p>
        <div className="mt-10 flex items-center gap-6">
          <span className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black">
            {copy.primary} <ArrowRight className="size-4" />
          </span>
          <span className="flex items-center gap-2 text-sm text-white/70">
            <ArrowDown className="size-4" /> {copy.scroll}
          </span>
        </div>
      </div>

      <div className="absolute right-14 bottom-16 flex gap-4">
        {(["gallery-1", "gallery-2"] as const).map((name, i) => (
          <div key={name} className="w-56">
            <ConceptImage src={img(name)} sizes="240px" className="h-36 rounded-lg ring-1 ring-white/20" />
            <p className="mt-3 text-xs tracking-wide text-white/75">{copy.series[i]}</p>
          </div>
        ))}
      </div>

      <p className="absolute top-1/2 right-14 -translate-y-1/2 text-xs tracking-[0.3em] text-white/70">{copy.counter}</p>
    </div>
  );
}
