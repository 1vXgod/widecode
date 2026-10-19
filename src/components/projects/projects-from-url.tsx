"use client";

import type { ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORY_PARAM, parseCategoryParam } from "@/lib/projects";
import { ProjectsBrowser } from "./projects-browser";

/** Reads ?kategoria= once to preselect the filter. Render inside <Suspense>. */
export function ProjectsFromUrl(props: Omit<ComponentProps<typeof ProjectsBrowser>, "initialCategory">) {
  const searchParams = useSearchParams();
  return <ProjectsBrowser {...props} initialCategory={parseCategoryParam(searchParams.get(CATEGORY_PARAM))} />;
}
