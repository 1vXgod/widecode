import { BadgeEuro, CodeXml, Languages, Smartphone, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { reasonIds, type Dictionary, type ReasonId } from "@/types/content";

const icons: Record<ReasonId, LucideIcon> = {
  transparent: BadgeEuro,
  custom: CodeXml,
  devices: Smartphone,
  communication: Languages,
};

export function WhySection({ copy }: { copy: Dictionary["why"] }) {
  return (
    <Section id="pse-widecode" aria-labelledby="why-title" containerClassName="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div className="reveal lg:sticky lg:top-28 lg:self-start">
        <SectionHeading id="why-title" eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      </div>

      <ul className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2">
        {reasonIds.map((id) => {
          const reason = copy.items[id];
          const Icon = icons[id];
          return (
            <li key={id} className="reveal bg-bg p-7 sm:p-8">
              <Icon aria-hidden="true" className="size-6 text-accent-text" />
              <h3 className="mt-5 text-lg font-semibold text-fg">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{reason.text}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
