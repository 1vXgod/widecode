"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Calculator, CheckCircle2, ChevronDown, Clock, Info, Loader2, X } from "lucide-react";
import { submitQuoteRequest } from "@/app/kontakt/actions";
import { buttonClasses, ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/config/pricing";
import { type ProjectSlug } from "@/config/projects";
import { budgetIds, projectTypeIds, quoteLimits, quotePackageIds, timelineIds } from "@/config/quote";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import { calculateEstimate, estimateToSearchParams, type EstimateInput } from "@/lib/estimator";
import { estimateLineLabel, packageOptionLabel, type QuoteCopy } from "@/lib/quote-labels";
import {
  emptyQuoteValues,
  quoteFields,
  validateQuoteValues,
  type QuoteField,
  type QuoteFieldErrors,
  type QuoteFormValues,
  type QuotePrefill,
  type QuoteSubmission,
} from "@/lib/quote-request";
import type { QuoteSubmitResult } from "@/lib/quote-submission";
import { fill } from "@/lib/template";

type Outcome = QuoteSubmitResult | { status: "network" };

type QuoteFormProps = {
  prefill: QuotePrefill;
  /**
   * Whether requests can be delivered. null while unknown (prerendered fallback);
   * the real value streams in with the request. The delivery mode itself never
   * reaches the browser.
   */
  available: boolean | null;
  copy: QuoteCopy;
  projectTitles: Record<ProjectSlug, string>;
};

const fieldId = (field: QuoteField) => `quote-${field}`;
const SUMMARY_ID = "quote-error-summary";
const SUCCESS_ID = "quote-success-title";

function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function initialValues(prefill: QuotePrefill): QuoteFormValues {
  return { ...emptyQuoteValues, packageId: prefill.packageId ?? "", projectType: prefill.projectType ?? "" };
}

/**
 * Quote request form. Validates with the same rules as the server, then calls
 * the Server Action, which validates again and reports honestly whether the
 * request was emailed. Only an email accepted by Resend leads to the confirmation.
 */
export function QuoteForm({ prefill, available, copy, projectTitles }: QuoteFormProps) {
  const text = copy.contactPage;
  const [values, setValues] = useState<QuoteFormValues>(() => initialValues(prefill));
  const [estimate, setEstimate] = useState<EstimateInput | null>(prefill.estimate);
  const [projectSlug, setProjectSlug] = useState<ProjectSlug | null>(prefill.projectSlug);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [submitted, setSubmitted] = useState<QuoteFormValues | null>(null);
  const [focusTarget, setFocusTarget] = useState<{ id: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const mountedAt = useRef(0);
  const submissionId = useRef("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountedAt.current = performance.now();
    submissionId.current = newSubmissionId();
  }, []);

  // Moves focus after a state change: to the error summary, the confirmation, or a field.
  useEffect(() => {
    if (!focusTarget) return;
    const element = document.getElementById(focusTarget.id);
    element?.focus();
    element?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusTarget]);

  // The estimate only belongs to the request while its package is still selected.
  const attachedEstimate = estimate && estimate.packageId === values.packageId ? estimate : null;
  const estimateResult = attachedEstimate ? calculateEstimate(attachedEstimate) : null;
  const errorCount = Object.keys(errors).length;

  function update(field: QuoteField, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    // After a failed attempt, errors update live as the visitor corrects them.
    if (attempted) {
      const result = validateQuoteValues(next);
      setErrors(result.ok ? {} : result.errors);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending || available === false) return;

    setAttempted(true);
    setOutcome(null);
    const validation = validateQuoteValues(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setFocusTarget({ id: SUMMARY_ID });
      return;
    }
    setErrors({});

    const submission: QuoteSubmission = {
      values,
      estimate: attachedEstimate ? { pages: attachedEstimate.pages, addOns: attachedEstimate.addOns } : null,
      projectSlug,
      website: honeypotRef.current?.value ?? "",
      elapsedMs: Math.round(performance.now() - mountedAt.current),
      submissionId: submissionId.current,
    };

    startTransition(async () => {
      let result: Outcome;
      try {
        result = await submitQuoteRequest(submission);
      } catch {
        // Network failure, server error or an outdated deployment: nothing was sent.
        result = { status: "network" };
      }
      setOutcome(result);
      if (result.status === "sent") {
        setSubmitted(values);
        setFocusTarget({ id: SUCCESS_ID });
      } else if (result.status === "invalid") {
        setErrors(result.errors);
        setFocusTarget({ id: SUMMARY_ID });
      }
    });
  }

  function startOver() {
    setValues(emptyQuoteValues);
    setEstimate(null);
    setProjectSlug(null);
    setErrors({});
    setAttempted(false);
    setOutcome(null);
    setSubmitted(null);
    mountedAt.current = performance.now();
    submissionId.current = newSubmissionId();
    setFocusTarget({ id: fieldId("name") });
  }

  if (submitted && outcome?.status === "sent") {
    return <QuoteConfirmation values={submitted} copy={copy} onStartOver={startOver} />;
  }

  if (available === false) return <QuoteUnavailable copy={copy} />;

  const fieldProps = (field: QuoteField) => ({
    field,
    label: text.form.fields[field].label,
    hint: text.form.fields[field].hint,
    error: errors[field] ? (text.errors.fields[field][errors[field]] ?? text.errors.fields[field].required) : undefined,
  });

  const formMessage = outcome ? outcomeMessage(outcome, copy) : null;
  const hasPrefill = Boolean(prefill.packageId || prefill.projectSlug);

  return (
    <form
      noValidate
      aria-label={text.form.label}
      aria-busy={isPending}
      onSubmit={onSubmit}
      className="relative grid gap-8 rounded-card border border-border bg-surface p-5 sm:p-8"
    >
      {attempted && errorCount > 0 ? (
        <div
          id={SUMMARY_ID}
          tabIndex={-1}
          aria-labelledby={`${SUMMARY_ID}-title`}
          className="rounded-xl border border-danger/40 bg-danger/[0.07] p-4 sm:p-5"
        >
          <p id={`${SUMMARY_ID}-title`} className="flex items-center gap-2 font-semibold text-fg">
            <AlertCircle aria-hidden="true" className="size-5 shrink-0 text-danger" />
            {errorCount === 1 ? text.errors.summaryOne : fill(text.errors.summaryMany, { count: String(errorCount) })}
          </p>
          <ul className="mt-3 grid gap-1.5 pl-7 text-sm">
            {quoteFields
              .filter((field) => errors[field])
              .map((field) => (
                <li key={field}>
                  <a
                    href={`#${fieldId(field)}`}
                    onClick={(event) => {
                      event.preventDefault();
                      setFocusTarget({ id: fieldId(field) });
                    }}
                    className="text-danger underline underline-offset-2 hover:text-fg"
                  >
                    {fieldProps(field).error}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {hasPrefill ? (
        <p className="flex items-start gap-2.5 text-sm text-fg-muted">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
          {text.form.prefillNotice}
        </p>
      ) : null}

      <p className="text-sm text-fg-subtle">{text.form.requiredNote}</p>

      <fieldset className="grid min-w-0 gap-5">
        <legend className="mb-5 text-lg font-semibold text-fg">{text.form.sections.contact}</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            {...fieldProps("name")}
            value={values.name}
            onChange={(v) => update("name", v)}
            autoComplete="name"
            maxLength={quoteLimits.name.max}
            required
          />
          <TextField
            {...fieldProps("business")}
            value={values.business}
            onChange={(v) => update("business", v)}
            autoComplete="organization"
            maxLength={quoteLimits.business.max}
            optionalLabel={text.form.optional}
          />
          <TextField
            {...fieldProps("email")}
            type="email"
            value={values.email}
            onChange={(v) => update("email", v)}
            autoComplete="email"
            inputMode="email"
            maxLength={quoteLimits.email.max}
            required
          />
          <TextField
            {...fieldProps("phone")}
            type="tel"
            value={values.phone}
            onChange={(v) => update("phone", v)}
            autoComplete="tel"
            inputMode="tel"
            maxLength={quoteLimits.phone.max}
            optionalLabel={text.form.optional}
          />
        </div>
      </fieldset>

      <fieldset className="grid min-w-0 gap-5">
        <legend className="mb-5 text-lg font-semibold text-fg">{text.form.sections.project}</legend>

        {projectSlug ? (
          <AttachedCard
            title={text.form.project.title}
            removeLabel={text.form.project.remove}
            onRemove={() => {
              setProjectSlug(null);
              setFocusTarget({ id: fieldId("projectType") });
            }}
          >
            <p className="font-medium text-fg">{projectTitles[projectSlug]}</p>
          </AttachedCard>
        ) : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectField
            {...fieldProps("projectType")}
            value={values.projectType}
            onChange={(v) => update("projectType", v)}
            placeholder={text.form.selectPlaceholder}
            options={projectTypeIds.map((id) => ({ value: id, label: text.form.options.projectType[id] }))}
          />
          <SelectField
            {...fieldProps("packageId")}
            value={values.packageId}
            onChange={(v) => update("packageId", v)}
            placeholder={text.form.selectPlaceholder}
            options={quotePackageIds.map((id) => ({ value: id, label: packageOptionLabel(id, copy) }))}
          />
        </div>

        {attachedEstimate && estimateResult?.kind === "estimate" ? (
          <AttachedCard
            title={text.form.estimate.title}
            removeLabel={text.form.estimate.remove}
            onRemove={() => {
              setEstimate(null);
              setFocusTarget({ id: fieldId("packageId") });
            }}
          >
            <dl className="grid gap-2 text-sm">
              {estimateResult.lines.map((line) => (
                <div key={line.kind === "addOn" ? line.addOnId : line.kind} className="flex justify-between gap-4">
                  <dt className="text-fg-muted">{estimateLineLabel(line, copy)}</dt>
                  <dd className="shrink-0 font-medium text-fg">{formatPrice(line.amount)}</dd>
                </div>
              ))}
              <div className="mt-1 flex justify-between gap-4 border-t border-border pt-3">
                <dt className="font-medium text-fg">{copy.estimator.summary.total}</dt>
                <dd data-testid="quote-estimate-total" className="shrink-0 font-semibold text-fg">
                  {copy.pricing.from} {formatPrice(estimateResult.total)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-fg-subtle">{text.form.estimate.text}</p>
            <Link
              href={`${routes.estimator}?${estimateToSearchParams(attachedEstimate).toString()}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-accent-text hover:text-fg"
            >
              <Calculator aria-hidden="true" className="size-4" />
              {text.form.estimate.edit}
            </Link>
          </AttachedCard>
        ) : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectField
            {...fieldProps("budget")}
            value={values.budget}
            onChange={(v) => update("budget", v)}
            placeholder={text.form.selectPlaceholder}
            options={budgetIds.map((id) => ({ value: id, label: text.form.options.budget[id] }))}
          />
          <SelectField
            {...fieldProps("timeline")}
            value={values.timeline}
            onChange={(v) => update("timeline", v)}
            placeholder={text.form.selectPlaceholder}
            options={timelineIds.map((id) => ({ value: id, label: text.form.options.timeline[id] }))}
          />
        </div>

        <TextAreaField
          {...fieldProps("description")}
          value={values.description}
          onChange={(v) => update("description", v)}
          maxLength={quoteLimits.description.max}
          counter={fill(text.form.characterCount, {
            count: String(values.description.length),
            max: String(quoteLimits.description.max),
          })}
        />
      </fieldset>

      {/* Honeypot: invisible to people and skipped by keyboard and screen readers; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="quote-website">{text.form.honeypotLabel}</label>
        <input ref={honeypotRef} id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4">
        {formMessage ? (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-danger/40 bg-danger/[0.07] p-4 text-sm leading-relaxed text-fg"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" />
            <span>{formMessage}</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-fg-subtle sm:max-w-xs">{text.form.privacy}</p>
          <button
            type="submit"
            aria-disabled={isPending || undefined}
            className={buttonClasses({ size: "lg", className: cn("group w-full sm:w-auto", isPending && "cursor-wait opacity-80") })}
          >
            {isPending ? (
              <>
                <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
                {text.form.submitting}
              </>
            ) : (
              <>
                {text.form.submit}
                <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
        {/* Announces the pending state; the result is announced by the alert or the focused confirmation. */}
        <p aria-live="polite" className="sr-only">
          {isPending ? text.form.submitting : ""}
        </p>
      </div>
    </form>
  );
}

function outcomeMessage(outcome: Outcome, copy: QuoteCopy): string | null {
  const status = copy.contactPage.status;
  switch (outcome.status) {
    case "invalid":
      return status.invalid;
    case "rateLimited": {
      const minutes = Math.max(1, Math.ceil(outcome.retryAfterSeconds / 60));
      const time = minutes === 1 ? status.minuteOne : fill(status.minuteMany, { count: String(minutes) });
      return fill(status.rateLimited, { time });
    }
    case "tooFast":
      return status.tooFast;
    case "rejected":
      return status.rejected;
    case "unavailable":
      return status.unavailable;
    case "failed":
      return status.failed;
    case "network":
      return status.network;
    default:
      return null;
  }
}

/** Shown only after Resend accepted the email. */
function QuoteConfirmation({
  values,
  copy,
  onStartOver,
}: {
  values: QuoteFormValues;
  copy: QuoteCopy;
  onStartOver: () => void;
}) {
  const text = copy.contactPage;
  const options = text.form.options;
  const summary: Array<[string, string]> = [
    [text.form.fields.projectType.label, options.projectType[values.projectType as keyof typeof options.projectType]],
    [text.form.fields.packageId.label, packageOptionLabel(values.packageId as (typeof quotePackageIds)[number], copy)],
    [text.form.fields.budget.label, options.budget[values.budget as keyof typeof options.budget]],
    [text.form.fields.timeline.label, options.timeline[values.timeline as keyof typeof options.timeline]],
  ];

  return (
    <section aria-labelledby={SUCCESS_ID} className="rounded-card border border-success/40 bg-success/[0.05] p-6 sm:p-10">
      <CheckCircle2 aria-hidden="true" className="size-10 text-success" />
      <h2 id={SUCCESS_ID} tabIndex={-1} className="mt-5 text-heading font-semibold text-fg">
        {text.success.title}
      </h2>
      <p className="mt-3 max-w-prose leading-relaxed text-fg-muted">
        {fill(text.success.text, { email: values.email.trim() })}
      </p>

      <h3 className="mt-8 text-sm font-semibold text-fg">{text.success.summaryTitle}</h3>
      <dl className="mt-3 grid gap-3 rounded-xl border border-border bg-surface p-4 text-sm sm:grid-cols-2">
        {summary.map(([label, value]) => (
          <div key={label}>
            <dt className="text-fg-subtle">{label}</dt>
            <dd className="mt-0.5 font-medium text-fg">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3 xs:flex-row">
        <button type="button" onClick={onStartOver} className={buttonClasses({ variant: "secondary" })}>
          {text.success.again}
        </button>
        <ButtonLink href={routes.projects} variant="ghost">
          {text.success.projects}
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </div>
    </section>
  );
}

/** Replaces the form while delivery is not configured, so nobody fills it in for nothing. */
function QuoteUnavailable({ copy }: { copy: QuoteCopy }) {
  const text = copy.contactPage;
  return (
    <section
      aria-labelledby="quote-unavailable-title"
      className="rounded-card border border-border-strong bg-surface p-6 sm:p-10"
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent-text"
      >
        <Clock className="size-5" />
      </span>
      <h2 id="quote-unavailable-title" className="mt-6 text-heading font-semibold text-fg">
        {text.status.unavailableNotice.title}
      </h2>
      <p className="mt-3 max-w-prose leading-relaxed text-fg-muted">{text.status.unavailableNotice.text}</p>
      <div className="mt-8 flex flex-col gap-3 xs:flex-row">
        <ButtonLink href={routes.pricing} variant="secondary">
          {text.aside.pricingCta}
        </ButtonLink>
        <ButtonLink href={routes.estimator} variant="ghost">
          <Calculator aria-hidden="true" />
          {text.aside.estimatorCta}
        </ButtonLink>
      </div>
    </section>
  );
}

function AttachedCard({
  title,
  removeLabel,
  onRemove,
  children,
}: {
  title: string;
  removeLabel: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-accent/40 bg-accent/[0.06] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-accent-text uppercase">{title}</p>
        <button
          type="button"
          onClick={onRemove}
          className="-m-1.5 inline-flex shrink-0 items-center gap-1 rounded-md p-1.5 text-xs text-fg-muted transition-colors hover:bg-white/5 hover:text-fg"
        >
          <X aria-hidden="true" className="size-3.5" />
          {removeLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

type BaseFieldProps = {
  field: QuoteField;
  label: string;
  hint?: string;
  error?: string;
  optionalLabel?: string;
};

const controlClasses = (invalid: boolean) =>
  cn(
    "w-full rounded-lg border bg-bg px-3.5 text-[0.9375rem] text-fg transition-colors placeholder:text-fg-subtle",
    "hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-60",
    invalid ? "border-danger" : "border-border-strong",
  );

function FieldShell({
  field,
  label,
  hint,
  error,
  optionalLabel,
  extra,
  children,
}: BaseFieldProps & { extra?: ReactNode; children: ReactNode }) {
  const id = fieldId(field);
  return (
    <div className="grid min-w-0 content-start gap-2">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
        {optionalLabel ? <span className="font-normal text-fg-subtle"> ({optionalLabel})</span> : null}
      </label>
      {children}
      {/* Hints sit under the control so controls in the same row stay aligned. */}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-fg-subtle">
          {hint}
        </p>
      ) : null}
      {extra}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(field: QuoteField, hint?: string, error?: string): string | undefined {
  const id = fieldId(field);
  const ids = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function TextField({
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  required,
  ...base
}: BaseFieldProps & {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete: string;
  inputMode?: "email" | "tel";
  maxLength: number;
  required?: boolean;
}) {
  return (
    <FieldShell {...base}>
      <input
        id={fieldId(base.field)}
        name={base.field}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
        aria-invalid={base.error ? true : undefined}
        aria-describedby={describedBy(base.field, base.hint, base.error)}
        className={cn(controlClasses(Boolean(base.error)), "h-11")}
      />
    </FieldShell>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  ...base
}: BaseFieldProps & {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}) {
  return (
    <FieldShell {...base}>
      <div className="relative">
        <select
          id={fieldId(base.field)}
          name={base.field}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          aria-invalid={base.error ? true : undefined}
          aria-describedby={describedBy(base.field, base.hint, base.error)}
          className={cn(controlClasses(Boolean(base.error)), "h-11 appearance-none pr-10", !value && "text-fg-subtle")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-fg">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-fg-muted"
        />
      </div>
    </FieldShell>
  );
}

function TextAreaField({
  value,
  onChange,
  maxLength,
  counter,
  ...base
}: BaseFieldProps & { value: string; onChange: (value: string) => void; maxLength: number; counter: string }) {
  return (
    <FieldShell {...base} extra={<p className="-mt-1 text-right text-xs text-fg-subtle">{counter}</p>}>
      <textarea
        id={fieldId(base.field)}
        name={base.field}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        maxLength={maxLength}
        required
        aria-invalid={base.error ? true : undefined}
        aria-describedby={describedBy(base.field, base.hint, base.error)}
        className={cn(controlClasses(Boolean(base.error)), "min-h-36 resize-y py-3 leading-relaxed")}
      />
    </FieldShell>
  );
}
