import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projectHref, type Project } from "@/config/projects";
import type { Dictionary } from "@/types/content";
import { ProjectPreview } from "./project-preview";

type ProjectCardProps = {
  project: Project;
  copy: Dictionary["projects"];
  /** h3 under a section heading (home), h2 directly under the page h1 (projects page). */
  headingLevel?: "h2" | "h3";
};

/**
 * Card for a demo project. Always shows the "Projekt demonstrues" badge.
 * Works in server and client components (no hooks).
 */
export function ProjectCard({ project, copy, headingLevel: Heading = "h3" }: ProjectCardProps) {
  const item = copy.items[project.slug];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-bg transition-[border-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-border-strong">
      <ProjectPreview preview={project.preview} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 text-warning">
            <Info aria-hidden="true" className="size-3.5" />
            {copy.demoBadge}
          </Badge>
          <span className="text-xs text-fg-subtle">{copy.categories[project.category]}</span>
        </div>
        <Heading className="mt-4 text-heading font-semibold text-fg">
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
        className="absolute top-4 right-4 size-5 text-white/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </article>
  );
}
