import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectsBrowser } from "@/components/projects/projects-browser";
import { ProjectsFromUrl } from "@/components/projects/projects-from-url";
import { CtaSection } from "@/components/sections/cta-section";
import { PageIntro } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { projects, type ProjectSlug } from "@/config/projects";
import { getLocale, getPageDictionary } from "@/i18n/server";
import { pageMetadata } from "@/lib/metadata";
import { estimatorHref, quoteHref } from "@/lib/quote";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("projects", undefined, await getLocale());
}

export default async function ProjectsPage() {
  const dict = await getPageDictionary();
  const page = dict.projectsPage;
  // Server-rendered cards; the client-side filter only chooses which to show.
  // The first preview is the largest element on screen from tablet width up, so it is not lazy-loaded.
  const browserProps = {
    cards: Object.fromEntries(
      projects.map((project, index) => [
        project.slug,
        <ProjectCard key={project.slug} project={project} copy={dict.projects} headingLevel="h2" eager={index === 0} />,
      ]),
    ) as Record<ProjectSlug, ReactNode>,
    categoryLabels: dict.projects.categories,
    filterCopy: page.filter,
  };

  return (
    <>
      <PageIntro
        headingId="projects-page-title"
        eyebrow={page.intro.eyebrow}
        title={page.intro.title}
        lead={page.intro.lead}
        actions={
          <>
            <ButtonLink href={quoteHref()} size="lg" className="group">
              {page.intro.primaryCta}
              <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={estimatorHref()} size="lg" variant="secondary">
              <Calculator aria-hidden="true" />
              {page.intro.secondaryCta}
            </ButtonLink>
          </>
        }
      />

      <Section className="pt-0 sm:pt-0">
        {/* Fallback = all projects, so the prerendered HTML is complete and stable. */}
        <Suspense fallback={<ProjectsBrowser initialCategory={null} {...browserProps} />}>
          <ProjectsFromUrl {...browserProps} />
        </Suspense>
      </Section>

      <CtaSection />
    </>
  );
}
