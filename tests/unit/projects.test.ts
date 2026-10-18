import { describe, expect, it } from "vitest";
import { packageIds } from "@/config/pricing";
import {
  featuredProjects,
  findProject,
  projectCategories,
  projectHref,
  projects,
  projectSlugs,
  relatedProjects,
} from "@/config/projects";
import { serviceIds } from "@/config/services";
import { getDictionary } from "@/content";
import { concepts } from "@/content/sq/concepts";
import { categoryToParam, countByCategory, filterProjects, parseCategoryParam } from "@/lib/projects";

const dict = getDictionary("sq");

describe("projects config", () => {
  it("marks every project as a concept (not client work)", () => {
    for (const project of projects) expect(project.kind, project.slug).toBe("concept");
  });

  it("lists every slug once, URL-safe, in the declared order", () => {
    expect(projects.map((p) => p.slug)).toEqual([...projectSlugs]);
    for (const slug of projectSlugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("uses known categories and packages", () => {
    expect([...projectCategories]).toEqual([...serviceIds]);
    for (const project of projects) {
      expect(projectCategories).toContain(project.category);
      expect(packageIds).toContain(project.packageId);
    }
  });

  it("features between one and three projects on the home page", () => {
    expect(featuredProjects.length).toBeGreaterThanOrEqual(1);
    expect(featuredProjects.length).toBeLessThanOrEqual(3);
  });

  it("builds detail links and finds projects by slug", () => {
    expect(projectHref("klinike-dentare")).toBe("/projektet/klinike-dentare");
    expect(findProject("klinike-dentare")?.category).toBe("business");
    expect(findProject("nuk-ekziston")).toBeUndefined();
  });
});

describe("project copy", () => {
  it("is complete for every project and category", () => {
    for (const slug of projectSlugs) {
      const item = dict.projects.items[slug];
      expect(item.title, slug).toBeTruthy();
      expect(item.concept, slug).toMatch(/^Koncept/);
      expect(item.goals.length, slug).toBeGreaterThanOrEqual(2);
      expect(item.features.length, slug).toBeGreaterThanOrEqual(3);
      expect(item.sections.length, slug).toBeGreaterThanOrEqual(2);
    }
    for (const category of projectCategories) expect(dict.projects.categories[category]).toBeTruthy();
  });

  it("never claims results, clients or testimonials", () => {
    const text = JSON.stringify(dict.projects.items);
    expect(text).not.toMatch(/\d+\s*%/); // "40% more bookings"
    expect(text).not.toMatch(/\d+\s*\+/); // "500+ orders"
    expect(text).not.toMatch(/\b(19|20)\d{2}\b/); // dates of "completed" work
    expect(text).not.toMatch(/klient[ëe]t? (t[ëe] )?k[ëe]naqur|rritje|dëshmi|testimonial|vlerësim nga klient/i);
  });

  it("presents the work honestly as WideCode concepts, without demo labels", () => {
    expect(dict.projects.title).toBe("Koncepte website");
    expect(dict.projects.description).toMatch(/Koncepte të dizajnuara nga WideCode/);
    expect(dict.projects.conceptLabel).toBe("Koncept website");
    expect(dict.projectsPage.detail.metaTitle).toMatch(/koncept website/);
    const visible = JSON.stringify({ projects: dict.projects, page: dict.projectsPage });
    expect(visible).not.toMatch(/demonstrues/i);
  });

  it("never implies the concepts are completed client work", () => {
    const visible = JSON.stringify({ projects: dict.projects, page: dict.projectsPage, concepts });
    expect(visible).not.toMatch(/klienti ynë|klientët tanë|për klientin|projekt i përfunduar|punuam për/i);
  });
});

describe("concept preview copy", () => {
  it("exists for every project", () => {
    for (const slug of projectSlugs) expect(concepts[slug].brand, slug).toBeTruthy();
  });

  it("contains no ratings, reviews, testimonials, percentages or 'N+' claims", () => {
    const text = JSON.stringify(concepts);
    expect(text).not.toMatch(/\d+\s*%|\d+\s*\+|★|yje|vlerësim|recension|dëshmi|testimonial/i);
  });

  it("uses the agreed terminology", () => {
    expect(JSON.stringify(concepts)).not.toMatch(/uebfaq|shabllon/i);
  });
});

describe("project filters", () => {
  it("filters by category and returns all for null", () => {
    expect(filterProjects(null)).toHaveLength(projects.length);
    expect(filterProjects("ecommerce").map((p) => p.slug)).toEqual(["dyqan-veshjesh", "produkte-vendore"]);
    expect(filterProjects("presentation").every((p) => p.category === "presentation")).toBe(true);
  });

  it("counts projects per category", () => {
    const counts = countByCategory();
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(projects.length);
    expect(counts.ecommerce).toBe(2);
  });

  it("round-trips readable URL values and ignores unknown ones", () => {
    for (const category of projectCategories) expect(parseCategoryParam(categoryToParam(category))).toBe(category);
    expect(categoryToParam("ecommerce")).toBe("online-shop");
    expect(parseCategoryParam("ecommerce")).toBeNull();
    expect(parseCategoryParam("<script>")).toBeNull();
    expect(parseCategoryParam("")).toBeNull();
    expect(parseCategoryParam(null)).toBeNull();
  });
});

describe("relatedProjects", () => {
  it("excludes the current project, prefers the same category and respects the limit", () => {
    const related = relatedProjects("dyqan-veshjesh");
    expect(related.map((p) => p.slug)).not.toContain("dyqan-veshjesh");
    expect(related[0]?.slug).toBe("produkte-vendore");
    expect(related).toHaveLength(3);
    expect(relatedProjects("dyqan-veshjesh", 1)).toHaveLength(1);
  });
});
