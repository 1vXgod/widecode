import { ArrowRight, CalendarCheck, Check, Menu, ShieldCheck, Smile, Sparkles, Stethoscope } from "lucide-react";
import { concepts } from "@/content/sq/concepts";
import { ConceptImage, type ConceptProps } from "./concept-ui";

const copy = concepts["klinike-dentare"];
const img = (name: string) => `/projects/klinike-dentare/${name}.jpg`;
const serviceIcons = [Stethoscope, ShieldCheck, Sparkles];

function Brand() {
  return (
    <span className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-[#0f766e] text-white">
        <Smile className="size-5" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-xl font-semibold">{copy.brand}</span>
        <span className="mt-1 block text-xs text-[#5b6b7a]">{copy.brandSub}</span>
      </span>
    </span>
  );
}

function SlotCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl shadow-[#0f766e]/10">
      <span className="grid size-11 place-items-center rounded-xl bg-[#ccfbf1] text-[#0f766e]">
        <CalendarCheck className="size-5" />
      </span>
      <span>
        <span className="block text-xs text-[#5b6b7a]">{copy.slotTitle}</span>
        <span className="block text-base font-semibold text-[#0f172a]">{copy.slotValue}</span>
      </span>
    </div>
  );
}

/** Dental clinic: bright, clean, teal accents, appointment-first UI. */
export function DentalConcept({ device, sizes, eager }: ConceptProps) {
  if (device === "mobile") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#f6fbfa] text-[#0f172a]">
        <header className="flex items-center justify-between px-6 pt-14 pb-5">
          <Brand />
          <Menu className="size-6" />
        </header>
        <div className="px-6">
          <span className="inline-flex rounded-full bg-[#ccfbf1] px-3 py-1.5 text-xs font-semibold text-[#0f766e]">
            {copy.eyebrow}
          </span>
          <p className="mt-4 font-display text-4xl leading-[1.08] font-semibold">{copy.title}</p>
          <p className="mt-3 text-base text-[#475569]">{copy.text}</p>
          <span className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] py-4 text-sm font-semibold text-white">
            {copy.primary} <ArrowRight className="size-4" />
          </span>
        </div>
        <div className="relative mx-4 mt-6">
          <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="h-64 rounded-3xl" />
          <div className="absolute inset-x-4 -bottom-6">
            <SlotCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#f6fbfa] text-[#0f172a]">
      <header className="flex items-center justify-between px-14 py-6">
        <Brand />
        <nav className="flex gap-10 text-sm font-medium text-[#475569]">
          {copy.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <span className="rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white">{copy.cta}</span>
      </header>

      <div className="grid grid-cols-[1fr_1.05fr] gap-12 px-14 pt-8">
        <div className="pt-6">
          <span className="inline-flex rounded-full bg-[#ccfbf1] px-4 py-2 text-sm font-semibold text-[#0f766e]">
            {copy.eyebrow}
          </span>
          <p className="mt-6 font-display text-6xl leading-[1.05] font-semibold tracking-tight">{copy.title}</p>
          <p className="mt-6 w-110 text-lg text-[#475569]">{copy.text}</p>
          <div className="mt-9 flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-xl bg-[#0f766e] px-7 py-4 text-sm font-semibold text-white">
              {copy.primary} <ArrowRight className="size-4" />
            </span>
            <span className="rounded-xl border border-[#0f172a]/15 bg-white px-7 py-4 text-sm font-semibold">
              {copy.secondary}
            </span>
          </div>
          <ul className="mt-9 flex gap-6 text-sm text-[#334155]">
            {copy.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="size-4 text-[#0f766e]" /> {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-118">
          <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="absolute inset-0 rounded-[calc(var(--u)*28)]" />
          <div className="absolute -bottom-6 -left-10 w-72">
            <SlotCard />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-14 bottom-8 grid grid-cols-3 gap-5">
        {copy.services.map(([title, text], i) => {
          const Icon = serviceIcons[i] ?? Sparkles;
          return (
            <div key={title} className="flex items-center gap-4 rounded-2xl border border-[#0f172a]/8 bg-white p-4">
              <span className="grid size-10 place-items-center rounded-xl bg-[#f0fdfa] text-[#0f766e]">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-xs text-[#5b6b7a]">{text}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
