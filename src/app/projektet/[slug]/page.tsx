import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calculator, Check, Info } from "lucide-react";
import { PricingDisclaimer } from "@/components/pricing/package-cards";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectPreview } from "@/components/projects/project-preview";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatPrice, getPackage } from "@/config/pricing";
import { findProject, projectSlugs, relatedProjects } from "@/config/projects";
import { routes } from "@/config/routes";
import { serviceHref } from "@/config/services";
import { getDictionary } from "@/content";
import { estimatorHref, quoteHref } from "@/lib/quote";
import { fill } from "@/lib/template";

// Every demo project is prerendered; unknown slugs render notFound() (404).
export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projektet/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const dict = getDictionary();
  const item = dict.projects.items[project.slug];
  return {
    title: fill(dict.projectsPage.detail.metaTitle, { title: item.title }),
    description: fill(dict.projectsPage.detail.metaDescription, { summary: item.summary }),
  };
}

export default async function ProjectPage({ params }: PageProps<"/projektet/[slug]">) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const dict = getDictionary();
  const copy = dict.projectsPage.detail;
  const item = dict.projects.items[project.slug];
  const pkg = getPackage(project.packageId);
  const pkgName = dict.pricing.packages[project.packageId].name;
  const serviceTitle = dict.services.items[project.category].title;

  return (
    <>
      {/* Intro (runs up behind the transparent header, like other inner pages) */}
      <section aria-labelledby="project-title" className="relative isolate -mt-header overflow-hidden pt-header">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-40" />
        <div
          aria-hidden="true"
          style={{ backgroundColor: project.preview.accent }}
          className="absolute -top-48 left-1/4 -z-10 h-[30rem] w-[52rem] max-w-[160vw] -translate-x-1/2 rounded-full opacity-15 blur-[140px]"
        />
        <Container className="pt-10 pb-12 sm:pt-14">
          <Link
            href={routes.projects}
            className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5" />
            {copy.back}
          </Link>

          <div className="mt-8 max-w-3xl animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1 text-warning">
                <Info aria-hidden="true" className="size-3.5" />
                {dict.projects.demoBadge}
              </Badge>
              <span className="text-sm text-fg-subtle">{dict.projects.categories[project.category]}</span>
            </div>
            <h1 id="project-title" className="mt-5 text-display font-semibold text-fg">
              {item.title}
            </h1>
            <p className="mt-5 text-lead text-fg-muted">{item.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-white/[0.06] px-3 py-1 text-sm text-fg-muted">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <p
            role="note"
            className="mt-8 flex max-w-3xl items-start gap-3 rounded-xl border border-warning/30 bg-warning/[0.06] p-4 text-sm leading-relaxed text-fg-muted"
          >
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
            {copy.banner}
          </p>

          <figure className="mt-10 overflow-hidden rounded-[1.75rem] border border-border-strong shadow-2xl shadow-black/50">
            <ProjectPreview preview={project.preview} className="aspect-[16/10]" />
            <figcaption className="sr-only">{dict.projects.previewLabel}</figcaption>
          </figure>
        </Container>
      </section>

      {/* Details */}
      <Section className="pt-6 sm:pt-6" containerClassName="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div className="grid content-start gap-12">
          <section aria-labelledby="concept-title">
            <h2 id="concept-title" className="text-title font-semibold text-fg">
              {copy.conceptTitle}
            </h2>
            <p className="mt-5 text-lead text-fg-muted">{item.concept}</p>
          </section>

          <section aria-labelledby="goals-title">
            <h2 id="goals-title" className="text-heading font-semibold text-fg">
              {copy.goalsTitle}
            </h2>
            <ul className="mt-5 grid gap-3">
              {item.goals.map((goal) => (
                <li key={goal} className="flex items-start gap-3 text-fg-muted">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-text" />
                  {goal}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="features-title">
            <h2 id="features-title" className="text-heading font-semibold text-fg">
              {copy.featuresTitle}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {item.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-fg-muted"
                >
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="sections-title">
            <h2 id="sections-title" className="text-heading font-semibold text-fg">
              {copy.sectionsTitle}
            </h2>
            <ol className="mt-5 flex flex-wrap gap-2">
              {item.sections.map((section, i) => (
                <li
                  key={section}
                  className="inline-flex items-center gap-2 rounded-full border border-border-strong px-3.5 py-1.5 text-sm text-fg-muted"
                >
                  <span aria-hidden="true" className="font-mono text-xs text-accent-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside aria-labelledby="similar-title" className="lg:sticky lg:top-24 lg:self-start">
          <Card className="grid gap-6">
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="text-fg-subtle">{copy.serviceLabel}</dt>
                <dd className="mt-1">
                  <Link
                    href={serviceHref(project.category)}
                    className="group inline-flex items-center gap-1 rounded-sm font-medium text-fg hover:text-accent-text"
                  >
                    {serviceTitle}
                    <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5" />
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-fg-subtle">{copy.packageLabel}</dt>
                <dd className="mt-1 font-medium text-fg">
                  {pkgName}
                  <span className="ml-2 text-fg-muted">
                    {pkg.startingPrice === null
                      ? dict.pricing.customPrice
                      : `${dict.pricing.from} ${formatPrice(pkg.startingPrice)}`}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="border-t border-border pt-6">
              <h2 id="similar-title" className="text-lg font-semibold text-fg">
                {copy.ctaTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{copy.ctaText}</p>
              <div className="mt-5 grid gap-3">
                {/* Long label: allow wrapping so it never forces the card wider on small phones. */}
                <ButtonLink
                  href={quoteHref(project.packageId)}
                  className="group h-auto min-h-11 w-full py-3 text-center whitespace-normal"
                >
                  {copy.quoteCta}
                  <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
                {pkg.startingPrice !== null ? (
                  <ButtonLink href={estimatorHref(project.packageId)} variant="secondary" className="w-full">
                    <Calculator aria-hidden="true" />
                    {copy.estimateCta}
                  </ButtonLink>
                ) : null}
              </div>
            </div>

            <PricingDisclaimer text={dict.pricing.disclaimer} className="text-xs" />
          </Card>
        </aside>
      </Section>

      {/* Related demo projects */}
      <Section tone="surface" aria-labelledby="related-title">
        <h2 id="related-title" className="text-title font-semibold text-fg">
          {copy.relatedTitle}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedProjects(project.slug).map((related) => (
            <li key={related.slug} className="reveal">
              <ProjectCard project={related} copy={dict.projects} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
