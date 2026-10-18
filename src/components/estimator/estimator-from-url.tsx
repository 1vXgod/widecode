"use client";

import { useSearchParams } from "next/navigation";
import { parseEstimateParams } from "@/lib/estimator";
import type { Dictionary } from "@/types/content";
import { Estimator } from "./estimator";

/**
 * Reads ?paketa=…&faqe=…&shtesa=… once to preselect the estimator. Must be
 * rendered inside <Suspense> (useSearchParams on a prerendered page).
 */
export function EstimatorFromUrl({ copy, pricing }: { copy: Dictionary["estimator"]; pricing: Dictionary["pricing"] }) {
  const searchParams = useSearchParams();
  return <Estimator initialInput={parseEstimateParams(searchParams)} copy={copy} pricing={pricing} />;
}
