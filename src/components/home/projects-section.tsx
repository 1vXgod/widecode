import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeader } from "@/components/sections/section-header";
import { Section } from "@/components/ui/section";
import { featuredProjects } from "@/config/projects";
import { routes } from "@/config/routes";
import type { Dictionary } from "@/types/content";

export function ProjectsSection({ copy }: { copy: Dictionary["projects"] }) {
  return (
    <Section id="projektet" tone="surface" aria-labelledby="projects-title">
      <SectionHeader intro={copy} headingId="projects-title" link={{ href: routes.projects, label: copy.cta }} />

      <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <li key={project.slug} className="reveal">
            <ProjectCard project={project} copy={copy} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
