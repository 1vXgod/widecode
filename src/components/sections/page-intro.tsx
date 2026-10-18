import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  /** id of the h1, referenced by the section's aria-labelledby. */
  headingId: string;
  actions?: ReactNode;
  /** Extra content under the intro, e.g. an in-page navigation. */
  children?: ReactNode;
};

/**
 * Top-of-page intro for inner pages. Like the home hero, it runs up behind the
 * transparent header, with the same grid and glow backdrop.
 */
export function PageIntro({ eyebrow, title, lead, headingId, actions, children }: PageIntroProps) {
  return (
    <section aria-labelledby={headingId} className="relative isolate -mt-header overflow-hidden pt-header">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-40" />
      <div
        aria-hidden="true"
        className="absolute -top-48 left-1/4 -z-10 h-[32rem] w-[56rem] max-w-[160vw] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]"
      />

      <Container className="pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24">
        <div className="max-w-3xl animate-fade-up">
          <Badge variant="accent">{eyebrow}</Badge>
          <h1 id={headingId} className="mt-6 text-display font-semibold text-fg">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-fg-muted">{lead}</p>
          {actions ? <div className="mt-10 flex flex-col gap-3 xs:flex-row">{actions}</div> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
