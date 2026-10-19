import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/config/routes";
import type { Dictionary } from "@/types/content";

/** The 404 page's content, shared by app/[lang]/not-found.tsx and app/global-not-found.tsx. */
export function NotFoundContent({ copy }: { copy: Dictionary["notFound"] }) {
  return (
    <Section className="min-h-[60vh]">
      <SectionHeading as="h1" size="title" eyebrow={copy.eyebrow} title={copy.title} description={copy.text} />
      <ButtonLink href={routes.home} variant="secondary" className="mt-10">
        <ArrowLeft aria-hidden="true" />
        {copy.backHome}
      </ButtonLink>
    </Section>
  );
}
