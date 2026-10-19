import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projectHref, type Project } from "@/config/projects";
import { fill } from "@/lib/template";
import type { Dictionary } from "@/types/content";
import { ConceptFrame } from "./concepts/concept-frame";

type ProjectCardProps = {
  project: Project;
  copy: Dictionary["projects"];
  /** h3 under a section heading (home), h2 directly under the page h1 (projects page). */
  headingLevel?: "h2" | "h3";
  /** Load the preview image right away: for the first card when it is the largest element on screen. */
  eager?: boolean;
};

/** Card for a website concept: live homepage preview, category, title and tags. */
export function ProjectCard({ project, copy, headingLevel: Heading = "h3", eager = false }: ProjectCardProps) {
  const item = copy.items[project.slug];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-bg transition-[border-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-border-strong">
      <div className="relative overflow-hidden bg-linear-to-b from-white/[0.05] to-transparent p-4 pb-0">
        <ConceptFrame
          slug={project.slug}
          device="desktop"
          label={fill(copy.desktopPreviewLabel, { title: item.title })}
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, 92vw"
          eager={eager}
          className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-fg-subtle">
          <span className="font-medium text-accent-text">{copy.categories[project.category]}</span>
          <span aria-hidden="true">·</span>
          <span>{copy.conceptLabel}</span>
        </p>
        <Heading className="mt-3 text-heading font-semibold text-fg">
          {/* Stretched link: the whole card is clickable, with one accessible link. */}
          <Link
            href={projectHref(project.slug)}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-ring"
          >
            {item.title}
          </Link>
        </Heading>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-6">
          {item.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-fg-muted">
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="absolute right-6 bottom-6 size-5 text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </article>
  );
}
