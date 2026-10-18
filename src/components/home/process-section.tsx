import { SectionHeader } from "@/components/sections/section-header";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/types/content";

export function ProcessSection({ copy }: { copy: Dictionary["process"] }) {
  return (
    <Section id="procesi" tone="surface" aria-labelledby="process-title">
      <SectionHeader intro={copy} headingId="process-title" />

      <ol className="relative mt-14 grid gap-8 md:grid-cols-5 md:gap-6">
        {/* Connecting line (vertical on mobile, horizontal on desktop) */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-5 w-px bg-linear-to-b from-accent/70 via-accent/35 to-border-strong md:top-5 md:right-[10%] md:bottom-auto md:left-[10%] md:h-px md:w-auto md:bg-linear-to-r"
        />
        {copy.steps.map((step, i) => (
          <li key={step.title} className="reveal relative flex gap-5 md:flex-col md:gap-0">
            <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-accent/50 bg-bg font-mono text-sm font-medium text-accent-text md:mx-auto">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="md:mt-6 md:text-center">
              <h3 className="text-lg font-semibold text-fg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
