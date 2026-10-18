import { ArrowRight, Clock, Flame, Menu, UtensilsCrossed } from "lucide-react";
import { concepts } from "@/content/sq/concepts";
import { ConceptImage, type ConceptProps } from "./concept-ui";

const copy = concepts["restorant-tradicional"];
const img = (name: string) => `/projects/restorant-tradicional/${name}.jpg`;

function Brand({ large = false }: { large?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-full bg-[#b5532d] text-[#fbf5ec]">
        <Flame className="size-5" />
      </span>
      <span className="leading-none">
        <span className={`block font-concept-serif ${large ? "text-3xl" : "text-2xl"} font-semibold`}>{copy.brand}</span>
        <span className="mt-1 block text-xs tracking-[0.2em] text-[#7a6450] uppercase">{copy.brandSub}</span>
      </span>
    </span>
  );
}

/** Traditional restaurant: warm cream and terracotta, serif headlines, food photography. */
export function RestaurantConcept({ device, sizes, eager }: ConceptProps) {
  if (device === "mobile") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#f4ede3] text-[#2a1d14]">
        <header className="flex items-center justify-between px-6 pt-14 pb-5">
          <Brand />
          <Menu className="size-6" />
        </header>
        <div className="relative mx-4">
          <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="h-80 rounded-3xl" />
          <span className="absolute bottom-4 left-4 rounded-2xl bg-[#fbf5ec] px-4 py-3 shadow-lg">
            <span className="block text-xs text-[#99431f] uppercase">{copy.special}</span>
            <span className="mt-0.5 block text-sm font-semibold">{copy.specialName}</span>
          </span>
        </div>
        <div className="px-6 pt-7">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#99431f] uppercase">{copy.eyebrow}</p>
          <p className="mt-3 font-concept-serif text-5xl leading-[1.02] font-semibold">{copy.title}</p>
          <p className="mt-4 text-base text-[#5b4636]">{copy.text}</p>
          <span className="mt-7 flex items-center justify-center gap-2 rounded-full bg-[#b5532d] py-4 text-sm font-semibold text-white">
            {copy.primary} <ArrowRight className="size-4" />
          </span>
          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-[#5b4636]">
            <Clock className="size-4" /> {copy.hours}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#f4ede3] text-[#2a1d14]">
      <header className="flex items-center justify-between px-14 py-7">
        <Brand large />
        <nav className="flex gap-10 text-sm font-medium text-[#5b4636]">
          {copy.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <span className="rounded-full bg-[#2a1d14] px-6 py-3 text-sm font-semibold text-[#fbf5ec]">{copy.cta}</span>
      </header>

      <div className="grid grid-cols-[1fr_1.12fr] gap-14 px-14 pt-6">
        <div className="pt-10">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-[#99431f] uppercase">
            <UtensilsCrossed className="size-4" /> {copy.eyebrow}
          </p>
          <p className="mt-6 font-concept-serif text-7xl leading-[0.98] font-semibold">{copy.title}</p>
          <p className="mt-6 w-110 text-lg text-[#5b4636]">{copy.text}</p>
          <div className="mt-10 flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-full bg-[#b5532d] px-7 py-4 text-sm font-semibold text-white">
              {copy.primary} <ArrowRight className="size-4" />
            </span>
            <span className="rounded-full border border-[#2a1d14]/25 px-7 py-4 text-sm font-semibold">{copy.secondary}</span>
          </div>
          <p className="mt-10 flex items-center gap-2 text-sm text-[#5b4636]">
            <Clock className="size-4 text-[#99431f]" /> {copy.hours}
          </p>
        </div>

        <div className="relative h-150">
          <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="absolute inset-0 rounded-[calc(var(--u)*32)]" />
          {/* Scaled padding (not a px ring) so the cut-out border scales with the canvas. */}
          <div className="absolute -top-5 -left-12 rounded-[calc(var(--u)*22)] bg-[#f4ede3] p-2">
            <ConceptImage src={img("platter")} sizes="260px" className="h-40 w-52 rounded-2xl" />
          </div>
          <div className="absolute right-6 bottom-6 w-72 rounded-2xl bg-[#fbf5ec] p-5 shadow-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#99431f] uppercase">{copy.special}</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="font-concept-serif text-2xl leading-tight font-semibold">{copy.specialName}</p>
              <p className="text-lg font-semibold whitespace-nowrap">{copy.specialPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
