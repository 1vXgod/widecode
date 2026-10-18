/**
 * Portfolio projects. Every entry here is a DEMONSTRATION project created by
 * WideCode, not client work, and must stay flagged with `demo: true` until a
 * real, approved client project replaces it. Text lives in
 * src/content/<locale>/projects.ts, keyed by slug.
 */
export const projectCategories = ["business", "ecommerce", "platform"] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export const projectSlugs = ["restorant-tradicional", "dyqan-veshjesh", "panel-palestre"] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

/** Visual style of the CSS-only preview (no stock imagery). */
export type ProjectPreview = {
  layout: "restaurant" | "shop" | "dashboard";
  /** Accent color of the mock site. */
  accent: string;
  /** Background tint of the mock site. */
  tint: string;
};

export type Project = {
  slug: ProjectSlug;
  category: ProjectCategory;
  demo: true;
  featured: boolean;
  preview: ProjectPreview;
};

export const projects: readonly Project[] = [
  {
    slug: "restorant-tradicional",
    category: "business",
    demo: true,
    featured: true,
    preview: { layout: "restaurant", accent: "#f59e0b", tint: "#1a120a" },
  },
  {
    slug: "dyqan-veshjesh",
    category: "ecommerce",
    demo: true,
    featured: true,
    preview: { layout: "shop", accent: "#f472b6", tint: "#1a0c14" },
  },
  {
    slug: "panel-palestre",
    category: "platform",
    demo: true,
    featured: true,
    preview: { layout: "dashboard", accent: "#34d399", tint: "#08160f" },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
