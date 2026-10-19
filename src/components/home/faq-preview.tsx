import { Link } from "@/i18n/link";
import { ArrowRight } from "lucide-react";
import { FaqList } from "@/components/sections/faq-list";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/config/routes";
import { getLocale } from "@/i18n/server";
import { fillFaqItem, faqValues } from "@/lib/faq";
import type { Dictionary } from "@/types/content";

const DEFAULT_ITEMS = [0, 1, 2, 3] as const;

type FaqPreviewProps = {
  copy: Dictionary["faq"];
  /** Which questions to show, by index in copy.items (defaults to the first four). */
  itemIndices?: readonly number[];
};

export async function FaqPreview({ copy, itemIndices = DEFAULT_ITEMS }: FaqPreviewProps) {
  const values = faqValues(await getLocale());
  const items = itemIndices.flatMap((i) => {
    const item = copy.items[i];
    return item ? [fillFaqItem(item, values)] : [];
  });

  return (
    <Section id="pyetje" aria-labelledby="faq-title" containerClassName="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
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

      <FaqList items={items} className="reveal self-start" />
    </Section>
  );
}
