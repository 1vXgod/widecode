"use client";

import { useEffect, useState, type ReactNode } from "react";
import { projectCategories, type ProjectCategory, type ProjectSlug } from "@/config/projects";
import { cn } from "@/lib/cn";
import { CATEGORY_PARAM, categoryToParam, countByCategory, filterProjects } from "@/lib/projects";
import { fill } from "@/lib/template";
import type { Dictionary } from "@/types/content";

type ProjectsBrowserProps = {
  initialCategory: ProjectCategory | null;
  /**
   * The project cards, rendered on the server. This component only decides
   * which ones to show, so the previews never ship as client JavaScript.
   */
  cards: Record<ProjectSlug, ReactNode>;
  categoryLabels: Dictionary["projects"]["categories"];
  filterCopy: Dictionary["projectsPage"]["filter"];
};

const counts = countByCategory();
const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

/** Category filter (toggle buttons) and project grid. The choice is kept in ?kategoria=. */
export function ProjectsBrowser({ initialCategory, cards, categoryLabels, filterCopy }: ProjectsBrowserProps) {
  const [category, setCategory] = useState<ProjectCategory | null>(initialCategory);
  const visible = filterProjects(category);

  // Keep the filter in the URL so a filtered view can be shared or bookmarked.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (category) url.searchParams.set(CATEGORY_PARAM, categoryToParam(category));
    else url.searchParams.delete(CATEGORY_PARAM);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [category]);

  const options: Array<{ value: ProjectCategory | null; label: string; count: number }> = [
    { value: null, label: filterCopy.all, count: total },
    ...projectCategories
      .filter((c) => counts[c] > 0)
      .map((c) => ({ value: c, label: categoryLabels[c], count: counts[c] })),
  ];

  const results = fill(visible.length === 1 ? filterCopy.resultsOne : filterCopy.resultsMany, {
    count: String(visible.length),
  });

  return (
    <div>
      <div role="group" aria-label={filterCopy.label} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === category;
          return (
            <button
              key={option.value ?? "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(option.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                active
                  ? "border-accent/70 bg-accent/15 text-fg"
                  : "border-border-strong text-fg-muted hover:border-fg/25 hover:text-fg",
              )}
            >
              {option.label}
              <span
                aria-hidden="true"
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  active ? "bg-accent text-accent-fg" : "bg-fg/[0.08] text-fg-muted",
                )}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-fg-subtle">
        {results}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.slug}>{cards[project.slug]}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-card border border-border bg-surface p-8 text-center text-fg-muted">
          {filterCopy.empty}
        </p>
      )}
    </div>
  );
}
