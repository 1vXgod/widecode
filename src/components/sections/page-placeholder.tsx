import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes, type RouteKey } from "@/config/routes";
import { getDictionary } from "@/content";

type PlaceholderKey = Exclude<RouteKey, "home">;

/** Metadata for pages that are not built yet: titled, but kept out of search indexes. */
export function placeholderMetadata(page: PlaceholderKey): Metadata {
  const { title, description } = getDictionary().pages[page];
  return { title, description, robots: { index: false, follow: true } };
}

/** Temporary page body used until the real page is built in a later sprint. */
export function PagePlaceholder({ page }: { page: PlaceholderKey }) {
  const dict = getDictionary();
  const { title, description } = dict.pages[page];

  return (
    <Section className="min-h-[60vh]">
      <SectionHeading as="h1" size="title" eyebrow={dict.placeholder.badge} title={title} description={description} />
      <p className="mt-6 max-w-narrow text-fg-muted">{dict.placeholder.text}</p>
      <ButtonLink href={routes.home} variant="secondary" className="mt-10">
        <ArrowLeft aria-hidden="true" />
        {dict.placeholder.backHome}
      </ButtonLink>
    </Section>
  );
}
