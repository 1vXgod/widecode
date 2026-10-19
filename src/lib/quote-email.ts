import { formatPrice } from "@/config/pricing";
import { projectHref } from "@/config/projects";
import { calculateEstimate } from "@/lib/estimator";
import { estimateDetailRows, estimateLineLabel, packageOptionLabel } from "@/lib/quote-labels";
import type { QuoteRequest } from "@/lib/quote-request";
import { fill } from "@/lib/template";
import type { Dictionary } from "@/types/content";

export type QuoteEmail = {
  subject: string;
  text: string;
  html: string;
  /** The visitor's address, so a reply goes straight to them. */
  replyTo: string;
};

/**
 * Everything in the email must be the same when the visitor retries an
 * unchanged request (see quoteIdempotencyKey), so it carries no send time;
 * the email's own Date header shows when it arrived.
 */
export type QuoteEmailMeta = {
  /** Random id per form fill, shown as the reference. */
  submissionId: string;
  /** Site origin, for links back to referenced pages. */
  siteUrl: URL;
};

/** Escapes text for HTML element content and attribute values. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Builds the notification email for a validated quote request. Every value is escaped. */
export function buildQuoteEmail(request: QuoteRequest, meta: QuoteEmailMeta, dict: Dictionary): QuoteEmail {
  const copy = dict.contactPage;
  const labels = copy.form.fields;
  const options = copy.form.options;
  const none = copy.email.notProvided;

  const rows: Array<[string, string]> = [
    [labels.name.label, request.name],
    [labels.business.label, request.business || none],
    [labels.email.label, request.email],
    [labels.phone.label, request.phone || none],
    [labels.projectType.label, options.projectType[request.projectType]],
    [labels.packageId.label, packageOptionLabel(request.packageId, dict)],
    [labels.budget.label, options.budget[request.budget]],
    [labels.timeline.label, options.timeline[request.timeline]],
  ];

  const project = request.projectSlug
    ? {
        title: dict.projects.items[request.projectSlug].title,
        url: new URL(projectHref(request.projectSlug), meta.siteUrl).href,
      }
    : null;
  if (project) rows.push([copy.email.project, `${project.title} (${project.url})`]);

  const estimate = request.estimate ? calculateEstimate(request.estimate) : null;
  const estimateRows: Array<[string, string]> =
    estimate?.kind === "estimate"
      ? [
          ...estimateDetailRows(estimate.input, dict),
          ...estimate.lines.map((line): [string, string] => [estimateLineLabel(line, dict), formatPrice(line.amount)]),
          [copy.email.estimateTotal, `${dict.pricing.from} ${formatPrice(estimate.total)}`],
        ]
      : [];

  const footerRows: Array<[string, string]> = [[copy.email.reference, meta.submissionId]];

  // Subject lines are a single line by construction (cleanLine), but never trust that here.
  const subject = fill(copy.email.subject, {
    name: request.business ? `${request.name} (${request.business})` : request.name,
    projectType: options.projectType[request.projectType],
  })
    .replace(/[\r\n]+/g, " ")
    .slice(0, 200);

  const textBlock = (pairs: Array<[string, string]>) => pairs.map(([label, value]) => `${label}: ${value}`).join("\n");
  const text = [
    copy.email.heading,
    copy.email.intro,
    "",
    textBlock(rows),
    "",
    `${labels.description.label}:`,
    request.description,
    ...(estimateRows.length > 0 ? ["", `${copy.email.estimateTitle}:`, textBlock(estimateRows)] : []),
    "",
    textBlock(footerRows),
    "",
    copy.email.replyHint,
  ].join("\n");

  const htmlRows = (pairs: Array<[string, string]>) =>
    pairs
      .map(
        ([label, value]) =>
          `<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;color:#555;font-weight:600;white-space:nowrap">${escapeHtml(label)}</th><td style="padding:6px 0;color:#111">${escapeHtml(value)}</td></tr>`,
      )
      .join("");

  const html = [
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111;max-width:640px">`,
    `<h1 style="font-size:20px;margin:0 0 4px">${escapeHtml(copy.email.heading)}</h1>`,
    `<p style="margin:0 0 20px;color:#555">${escapeHtml(copy.email.intro)}</p>`,
    `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${htmlRows(rows)}</table>`,
    `<h2 style="font-size:16px;margin:24px 0 8px">${escapeHtml(labels.description.label)}</h2>`,
    `<p style="margin:0;white-space:pre-wrap">${escapeHtml(request.description)}</p>`,
    estimateRows.length > 0
      ? `<h2 style="font-size:16px;margin:24px 0 8px">${escapeHtml(copy.email.estimateTitle)}</h2><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${htmlRows(estimateRows)}</table>`
      : "",
    `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:24px;font-size:13px">${htmlRows(footerRows)}</table>`,
    `<p style="margin:16px 0 0;font-size:13px;color:#555">${escapeHtml(copy.email.replyHint)}</p>`,
    `</div>`,
  ].join("");

  return { subject, text, html, replyTo: request.email };
}
