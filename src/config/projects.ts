import type { PackageId } from "@/config/pricing";
import { routes } from "@/config/routes";
import { serviceIds, type ServiceId } from "@/config/services";

/**
 * Portfolio entries.
 *
 * IMPORTANT: every entry is a WEBSITE CONCEPT designed by WideCode, not
 * completed client work. The brands shown inside the previews (Dritëhije,
 * Oxhaku, Aura, ELARA, Bleta & Toka, Ritmi) are fictional. The site presents
 * them as "Koncepte website" and must never claim they were built for, or
 * used by, real clients. Never add client names, testimonials, results or
 * statistics. A real client project may only be added with the client's
 * explicit approval, as `kind: "client"`.
 *
 * Copy: src/content/<locale>/projects.ts (cards and detail pages) and
 * src/content/<locale>/concepts.ts (text inside the previews).
 * Previews: src/components/projects/concepts. Images: public/projects/<slug>
 * (licences and sources in docs/IMAGE_CREDITS.md).
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

export type Project = {
  slug: ProjectSlug;
  category: ProjectCategory;
  /** Pricing package a similar real project would start from. */
  packageId: PackageId;
  /** "concept" = designed by WideCode as a showcase, not client work. */
  kind: "concept";
  /** Shown on the home page. */
  featured: boolean;
};

export const projects: readonly Project[] = [
  { slug: "studio-fotografie", category: "presentation", packageId: "starter", kind: "concept", featured: false },
  { slug: "restorant-tradicional", category: "business", packageId: "business", kind: "concept", featured: true },
  { slug: "klinike-dentare", category: "business", packageId: "business", kind: "concept", featured: false },
  { slug: "dyqan-veshjesh", category: "ecommerce", packageId: "ecommerce", kind: "concept", featured: true },
  { slug: "produkte-vendore", category: "ecommerce", packageId: "ecommerce", kind: "concept", featured: false },
  { slug: "panel-palestre", category: "platform", packageId: "custom", kind: "concept", featured: true },
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
