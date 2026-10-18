import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/config/routes";
import { getDictionary } from "@/content";

const { notFound } = getDictionary();

export const metadata: Metadata = {
  title: notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Section className="min-h-[60vh]">
      <SectionHeading as="h1" size="title" eyebrow={notFound.eyebrow} title={notFound.title} description={notFound.text} />
      <ButtonLink href={routes.home} variant="secondary" className="mt-10">
        <ArrowLeft aria-hidden="true" />
        {notFound.backHome}
      </ButtonLink>
    </Section>
  );
}
