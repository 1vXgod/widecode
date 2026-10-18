import type { PackageId } from "@/config/pricing";
import { routes } from "@/config/routes";
import { serviceIds, type ServiceId } from "@/config/services";

/**
 * Portfolio projects. Every entry here is a DEMONSTRATION project (a concept
 * created by WideCode), not client work, and must stay flagged with
 * `demo: true` until a real, approved client project replaces it. Never add
 * client names, results, statistics or testimonials to demo projects.
 * Text lives in src/content/<locale>/projects.ts, keyed by slug.
 */

/** Project categories mirror the services, so filters, labels and links stay consistent. */
export const projectCategories = serviceIds;

export type ProjectCategory = ServiceId;

export const projectSlugs = [
  "studio-fotografie",
  "restorant-tradicional",
  "klinike-dentare",
  "dyqan-veshjesh",
  "produkte-vendore",
  "panel-palestre",
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

/** Visual style of the CSS-only preview (no stock imagery). */
export type ProjectPreview = {
  layout: "gallery" | "restaurant" | "clinic" | "shop" | "dashboard";
  /** Accent color of the mock site. */
  accent: string;
  /** Background tint of the mock site. */
  tint: string;
};

export type Project = {
  slug: ProjectSlug;
  category: ProjectCategory;
  /** Pricing package a similar real project would start from. */
  packageId: PackageId;
  demo: true;
  /** Shown on the home page. */
  featured: boolean;
  preview: ProjectPreview;
};

export const projects: readonly Project[] = [
  {
    slug: "studio-fotografie",
    category: "presentation",
    packageId: "starter",
    demo: true,
    featured: false,
    preview: { layout: "gallery", accent: "#38bdf8", tint: "#06121a" },
  },
  {
    slug: "restorant-tradicional",
    category: "business",
    packageId: "business",
    demo: true,
    featured: true,
    preview: { layout: "restaurant", accent: "#f59e0b", tint: "#1a120a" },
  },
  {
    slug: "klinike-dentare",
    category: "business",
    packageId: "business",
    demo: true,
    featured: false,
    preview: { layout: "clinic", accent: "#2dd4bf", tint: "#061513" },
  },
  {
    slug: "dyqan-veshjesh",
    category: "ecommerce",
    packageId: "ecommerce",
    demo: true,
    featured: true,
    preview: { layout: "shop", accent: "#f472b6", tint: "#1a0c14" },
  },
  {
    slug: "produkte-vendore",
    category: "ecommerce",
    packageId: "ecommerce",
    demo: true,
    featured: false,
    preview: { layout: "shop", accent: "#a3e635", tint: "#0d1405" },
  },
  {
    slug: "panel-palestre",
    category: "platform",
    packageId: "custom",
    demo: true,
    featured: true,
    preview: { layout: "dashboard", accent: "#34d399", tint: "#08160f" },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Path of a project's detail page. */
export function projectHref(slug: ProjectSlug): string {
  return `${routes.projects}/${slug}`;
}

/** Other projects to suggest on a detail page: same category first, then the rest. */
export function relatedProjects(slug: ProjectSlug, limit = 3): Project[] {
  const current = findProject(slug);
  const others = projects.filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current?.category);
  const rest = others.filter((p) => p.category !== current?.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
