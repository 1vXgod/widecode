"use client";

import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import { parseQuotePrefill } from "@/lib/quote-request";
import { QuoteForm } from "./quote-form";

type QuoteFormFromUrlProps = Omit<ComponentProps<typeof QuoteForm>, "prefill" | "available" | "keepDraft"> & {
  /** Whether requests can be delivered; resolved on the server at request time. */
  availability: Promise<boolean>;
};

/**
 * Quote form pre-filled from the URL (?paketa, ?faqe, ?shtesa, ?vleresim, ?projekti).
 *
 * The URL is read in the browser: on a client-side navigation (e.g. from the
 * estimator) the router already knows it, so the form appears complete at once
 * instead of waiting for the server. Only delivery availability comes from the
 * server, and it arrives without remounting the form, so nothing the visitor
 * has typed meanwhile is lost. Render inside <Suspense> (useSearchParams).
 */
export function QuoteFormFromUrl({ availability, ...props }: QuoteFormFromUrlProps) {
  const searchParams = useSearchParams();
  const prefill = useMemo(() => parseQuotePrefill(searchParams), [searchParams]);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let current = true;
    availability.then(
      (value) => current && setAvailable(value),
      // Unknown: keep the form; the server still refuses requests it cannot deliver.
      () => undefined,
    );
    return () => {
      current = false;
    };
  }, [availability]);

  return <QuoteForm {...props} prefill={prefill} available={available} keepDraft />;
}
