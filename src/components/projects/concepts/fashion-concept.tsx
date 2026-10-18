import { ArrowRight, Menu, Search, ShoppingBag, User } from "lucide-react";
import { concepts } from "@/content/sq/concepts";
import { ConceptImage, type ConceptProps } from "./concept-ui";

const copy = concepts["dyqan-veshjesh"];
const img = (name: string) => `/projects/dyqan-veshjesh/${name}.jpg`;
const productImages = [
  // Zoomed into the coat, so the product card does not repeat the hero portrait.
  { src: img("hero"), position: "center 40%", zoom: "[&_img]:origin-[40%_72%] [&_img]:scale-[2.1]" },
  { src: img("lookbook"), position: "center 40%", zoom: "" },
];

function Bag() {
  return (
    <span className="relative">
      <ShoppingBag className="size-5" />
      <span className="absolute -top-1.5 -right-2 grid size-4 place-items-center rounded-full bg-[#1d1b18] text-[calc(var(--u)*9)] font-semibold text-[#f3efe9]">
        {copy.cartCount}
      </span>
    </span>
  );
}

/** Clothing shop: quiet luxury, beige palette, editorial serif, product cards. */
export function FashionConcept({ device, sizes, eager }: ConceptProps) {
  if (device === "mobile") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#f3efe9] text-[#1d1b18]">
        <p className="bg-[#1d1b18] pt-11 pb-2 text-center text-xs text-[#f3efe9]">{copy.announcement}</p>
        <header className="flex items-center justify-between px-5 py-4">
          <Menu className="size-5" />
          <span className="font-concept-serif text-2xl tracking-[0.3em]">{copy.brand}</span>
          <Bag />
        </header>
        <div className="relative mx-4 h-112">
          <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="absolute inset-0" position="center 30%" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-6 text-white">
            <p className="text-xs tracking-[0.25em] uppercase">{copy.eyebrow}</p>
            <p className="mt-2 font-concept-serif text-4xl leading-[1.02]">{copy.title}</p>
            <span className="mt-5 inline-flex items-center gap-2 bg-white px-6 py-3 text-xs font-semibold tracking-[0.15em] text-[#1d1b18] uppercase">
              {copy.primary} <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4 pt-4">
          {copy.products.map(([name, price], i) => (
            <div key={name}>
              <ConceptImage
                src={productImages[i]?.src ?? img("hero")}
                sizes="180px"
                className={`h-28 ${productImages[i]?.zoom ?? ""}`}
                position={productImages[i]?.position}
              />
              <p className="mt-2 text-xs">{name}</p>
              <p className="text-xs font-semibold">{price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#f3efe9] text-[#1d1b18]">
      <p className="bg-[#1d1b18] py-2 text-center text-xs tracking-wide text-[#f3efe9]">{copy.announcement}</p>
      <header className="grid grid-cols-3 items-center px-14 py-5">
        <nav className="flex gap-8 text-xs font-medium tracking-[0.15em] uppercase">
          {copy.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <span className="text-center font-concept-serif text-4xl tracking-[0.35em]">{copy.brand}</span>
        <span className="flex justify-end gap-6">
          <Search className="size-5" />
          <User className="size-5" />
          <Bag />
        </span>
      </header>

      <div className="grid h-[calc(var(--u)*690)] grid-cols-[1fr_1.15fr]">
        <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="h-full" position="center 28%" />
        <div className="flex flex-col justify-between px-16 py-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#6f675d] uppercase">{copy.eyebrow}</p>
            <p className="mt-5 font-concept-serif text-7xl leading-[0.98]">{copy.title}</p>
            <p className="mt-6 w-105 text-base text-[#5e574f]">{copy.text}</p>
            <div className="mt-8 flex items-center gap-6">
              <span className="flex items-center gap-2 bg-[#1d1b18] px-8 py-4 text-xs font-semibold tracking-[0.18em] text-[#f3efe9] uppercase">
                {copy.primary} <ArrowRight className="size-4" />
              </span>
              <span className="border-b border-[#1d1b18] pb-1 text-xs font-semibold tracking-[0.18em] uppercase">
                {copy.secondary}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {copy.products.map(([name, price], i) => (
              <div key={name}>
                <div className="relative">
                  <ConceptImage
                    src={productImages[i]?.src ?? img("hero")}
                    sizes="260px"
                    className={`h-56 ${productImages[i]?.zoom ?? ""}`}
                    position={productImages[i]?.position}
                  />
                  <span className="absolute top-3 left-3 bg-[#f3efe9] px-2.5 py-1 text-xs font-semibold">
                    {copy.newBadge}
                  </span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="font-semibold">{price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
