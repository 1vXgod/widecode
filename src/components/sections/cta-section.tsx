import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { routes } from "@/config/routes";
import { getDictionary } from "@/content";

/** Closing call to action, shared by the home page and inner pages. */
export function CtaSection() {
  const { cta } = getDictionary();

  return (
    <section aria-labelledby="cta-title" className="pb-section">
      <Container>
        <div className="reveal relative isolate overflow-hidden rounded-[1.75rem] border border-border-strong bg-surface-raised px-6 py-16 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-40" />
          <div
            aria-hidden="true"
            className="absolute -top-32 left-1/2 -z-10 h-80 w-[40rem] max-w-[120%] -translate-x-1/2 rounded-full bg-accent/30 blur-[100px]"
          />
          <h2 id="cta-title" className="mx-auto max-w-2xl text-title font-semibold text-fg">
            {cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lead text-fg-muted">{cta.text}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 xs:flex-row">
            <ButtonLink href={routes.contact} size="lg" className="group">
              {cta.primary}
              <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={routes.estimator} size="lg" variant="secondary">
              {cta.secondary}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
