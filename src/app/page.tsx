import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/config/routes";
import { getDictionary } from "@/content";

/** Interim home page; the full interactive hero is built in Sprint 2. */
export default function HomePage() {
  const { home } = getDictionary();

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-60" />
      <div
        aria-hidden="true"
        className="absolute top-[-20%] left-1/2 -z-10 h-[36rem] w-[56rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />

      <Container className="flex min-h-[calc(100dvh-var(--spacing-header))] flex-col justify-center py-section">
        <div className="animate-fade-up">
          <SectionHeading as="h1" eyebrow={home.eyebrow} title={home.title} description={home.lead} />
          <div className="mt-10 flex flex-col gap-3 xs:flex-row">
            <ButtonLink href={routes.pricing} size="lg">
              {home.primaryCta}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={routes.contact} size="lg" variant="secondary">
              {home.secondaryCta}
            </ButtonLink>
          </div>
          <p className="mt-10 max-w-narrow text-sm text-fg-subtle">{home.note}</p>
        </div>
      </Container>
    </section>
  );
}
