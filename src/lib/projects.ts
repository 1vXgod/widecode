import { projectCategories, projects, type Project, type ProjectCategory } from "@/config/projects";
import { getService } from "@/config/services";

/** URL parameter for the projects filter, e.g. /projektet?kategoria=online-shop. */
export const CATEGORY_PARAM = "kategoria";

/** Readable URL value for a category (same as the service's anchor on the services page). */
export function categoryToParam(category: ProjectCategory): string {
  return getService(category).anchor;
}

/** Parses a URL value back to a category; anything unknown means "all projects" (null). */
export function parseCategoryParam(value: string | null | undefined): ProjectCategory | null {
  if (!value) return null;
  return projectCategories.find((category) => categoryToParam(category) === value.trim()) ?? null;
}

/** Projects in a category, or all projects for null. Keeps config order. */
export function filterProjects(category: ProjectCategory | null): Project[] {
  return category ? projects.filter((p) => p.category === category) : [...projects];
}

/** Number of projects per category (categories without projects are 0). */
export function countByCategory(): Record<ProjectCategory, number> {
  const counts = Object.fromEntries(projectCategories.map((c) => [c, 0])) as Record<ProjectCategory, number>;
  for (const project of projects) counts[project.category] += 1;
  return counts;
}
