"use server";

import { headers } from "next/headers";
import { handleQuoteSubmission, type QuoteSubmitResult } from "@/lib/quote-submission";
import { visitorKey } from "@/lib/rate-limit";

/**
 * Server Action behind the quote form. Anyone can POST to it, so the input is
 * treated as untrusted: handleQuoteSubmission validates and rate-limits it
 * again, whatever the form already checked.
 */
export async function submitQuoteRequest(submission: unknown): Promise<QuoteSubmitResult> {
  const requestHeaders = await headers();
  return handleQuoteSubmission(submission, { visitorKey: visitorKey(requestHeaders) });
}
