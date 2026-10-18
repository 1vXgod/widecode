import { ArrowRight, Check, Leaf, Menu, Plus, ShoppingBasket } from "lucide-react";
import { concepts } from "@/content/sq/concepts";
import { ConceptImage, type ConceptProps } from "./concept-ui";

const copy = concepts["produkte-vendore"];
const img = (name: string) => `/projects/produkte-vendore/${name}.jpg`;

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center rounded-full bg-[#2f5d3a] text-[#f6f1e4]">
        <Leaf className="size-5" />
      </span>
      <span className="font-concept-serif text-2xl font-semibold">{copy.brand}</span>
    </span>
  );
}

function ProductCard() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-2xl shadow-[#2f5d3a]/15">
      <div className="flex items-start justify-between gap-4">
        <span>
          <span className="block text-base font-semibold">{copy.productName}</span>
          <span className="block text-xs text-[#6b6455]">{copy.productSize}</span>
        </span>
        <span className="text-lg font-semibold text-[#2f5d3a]">{copy.productPrice}</span>
      </div>
      <span className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#2f5d3a] py-2.5 text-xs font-semibold text-white">
        <Plus className="size-4" /> {copy.productButton}
      </span>
    </div>
  );
}

/** Local producers' online shop: warm honey and green palette, product-first hero. */
export function LocalProductsConcept({ device, sizes, eager }: ConceptProps) {
  if (device === "mobile") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#f6f1e4] text-[#22301f]">
        <header className="flex items-center justify-between px-6 pt-14 pb-5">
          <Brand />
          <Menu className="size-6" />
        </header>
        <div className="relative mx-4">
          <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="h-72 rounded-3xl" position="center 55%" />
          <div className="absolute right-3 -bottom-8 w-52">
            <ProductCard />
          </div>
        </div>
        <div className="px-6 pt-12">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#b07a12] uppercase">{copy.eyebrow}</p>
          <p className="mt-3 font-concept-serif text-4xl leading-[1.05] font-semibold">{copy.title}</p>
          <span className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#2f5d3a] py-4 text-sm font-semibold text-white">
            {copy.primary} <ArrowRight className="size-4" />
          </span>
          <ul className="mt-5 flex flex-wrap gap-2">
            {copy.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs">
                <Check className="size-3.5 text-[#2f5d3a]" /> {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#f6f1e4] text-[#22301f]">
      <header className="flex items-center justify-between px-14 py-7">
        <Brand />
        <nav className="flex gap-10 text-sm font-medium text-[#4b5446]">
          {copy.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <span className="flex items-center gap-2 rounded-full bg-[#2f5d3a] px-5 py-3 text-sm font-semibold text-white">
          <ShoppingBasket className="size-4" /> {copy.cta}
        </span>
      </header>

      <div className="grid grid-cols-[1fr_1fr] gap-14 px-14 pt-8">
        <div className="pt-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#efe2bf] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-[#6f4a06] uppercase">
            <Leaf className="size-3.5" /> {copy.eyebrow}
          </p>
          <p className="mt-6 font-concept-serif text-7xl leading-[0.98] font-semibold">{copy.title}</p>
          <p className="mt-6 w-115 text-lg text-[#4b5446]">{copy.text}</p>
          <div className="mt-9 flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-full bg-[#2f5d3a] px-7 py-4 text-sm font-semibold text-white">
              {copy.primary} <ArrowRight className="size-4" />
            </span>
            <span className="rounded-full border border-[#22301f]/25 px-7 py-4 text-sm font-semibold">{copy.secondary}</span>
          </div>
          <ul className="mt-9 flex gap-6 text-sm text-[#4b5446]">
            {copy.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2">
                <Check className="size-4 text-[#2f5d3a]" /> {chip}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-150">
          <ConceptImage
            src={img("hero")}
            sizes={sizes}
            eager={eager}
            className="absolute inset-y-0 right-0 left-16 rounded-[calc(var(--u)*32)]"
            position="center 55%"
          />
          <div className="absolute bottom-10 left-0 w-56 rounded-[calc(var(--u)*20)] bg-[#f6f1e4] p-2">
            <ConceptImage src={img("market")} sizes="240px" className="h-36 rounded-2xl" />
            <p className="px-2 pt-2 pb-1 text-xs font-semibold">{copy.seasonal}</p>
          </div>
          <div className="absolute top-10 -right-4 w-64">
            <ProductCard />
          </div>
        </div>
      </div>
    </div>
  );
}
