import { Suspense } from "react";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { ProjectsBrowser } from "@/components/projects/projects-browser";
import { ProjectsFromUrl } from "@/components/projects/projects-from-url";
import { CtaSection } from "@/components/sections/cta-section";
import { PageIntro } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { estimatorHref, quoteHref } from "@/lib/quote";

export const metadata = pageMetadata("projects");

export default function ProjectsPage() {
  const dict = getDictionary();
  const page = dict.projectsPage;

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
      >
        <aside
          aria-labelledby="demo-notice-title"
          className="mt-12 flex max-w-3xl animate-fade-up items-start gap-4 rounded-card border border-warning/30 bg-warning/[0.06] p-5 sm:p-6"
        >
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
          <div>
            <h2 id="demo-notice-title" className="font-semibold text-fg">
              {page.notice.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">{page.notice.text}</p>
          </div>
        </aside>
      </PageIntro>

      <Section className="pt-0 sm:pt-0">
        {/* Fallback = all projects, so the prerendered HTML is complete and stable. */}
        <Suspense fallback={<ProjectsBrowser initialCategory={null} copy={dict.projects} filterCopy={page.filter} />}>
          <ProjectsFromUrl copy={dict.projects} filterCopy={page.filter} />
        </Suspense>
      </Section>

      <CtaSection />
    </>
  );
}
