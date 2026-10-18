"use client";

import { useSearchParams } from "next/navigation";
import { CATEGORY_PARAM, parseCategoryParam } from "@/lib/projects";
import type { Dictionary } from "@/types/content";
import { ProjectsBrowser } from "./projects-browser";

/** Reads ?kategoria= once to preselect the filter. Render inside <Suspense>. */
export function ProjectsFromUrl({
  copy,
  filterCopy,
}: {
  copy: Dictionary["projects"];
  filterCopy: Dictionary["projectsPage"]["filter"];
}) {
  const searchParams = useSearchParams();
  return (
    <ProjectsBrowser
      initialCategory={parseCategoryParam(searchParams.get(CATEGORY_PARAM))}
      copy={copy}
      filterCopy={filterCopy}
    />
  );
}
