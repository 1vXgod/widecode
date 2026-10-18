import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPrice, lowestStartingPrice } from "@/config/pricing";
import { routes } from "@/config/routes";
import { fill } from "@/lib/template";
import type { Dictionary } from "@/types/content";

const DEFAULT_ITEMS = [0, 1, 2, 3] as const;

type FaqPreviewProps = {
  copy: Dictionary["faq"];
  /** Which questions to show, by index in copy.items (defaults to the first four). */
  itemIndices?: readonly number[];
};

export function FaqPreview({ copy, itemIndices = DEFAULT_ITEMS }: FaqPreviewProps) {
  const price = formatPrice(lowestStartingPrice());
  const items = itemIndices.flatMap((i) => {
    const item = copy.items[i];
    return item ? [item] : [];
  });

  return (
    <Section id="pyetje" aria-labelledby="faq-title" containerClassName="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div className="reveal flex flex-col items-start gap-8">
        <SectionHeading id="faq-title" eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        <Link
          href={routes.faq}
          className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-accent-text transition-colors hover:text-fg"
        >
          {copy.viewAll}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Native <details>: keyboard accessible and works without JavaScript. */}
      <div className="reveal self-start divide-y divide-border border-y border-border">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-fg transition-colors hover:text-accent-text [&::-webkit-details-marker]:hidden">
              {item.question}
              <Plus
                aria-hidden="true"
                className="size-5 shrink-0 text-fg-muted transition-transform duration-300 group-open:rotate-45"
              />
            </summary>
            <p className="pb-6 text-sm leading-relaxed text-fg-muted">{fill(item.answer, { price })}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
