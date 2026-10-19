"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { ArrowRight, Check, Info, Minus, Plus, RotateCcw } from "lucide-react";
import { buttonClasses, ButtonLink } from "@/components/ui/button";
import { addOns, defaultEstimatorPackage, pageRules } from "@/config/estimator";
import { formatPrice, packages, type PackageId } from "@/config/pricing";
import { useLocale } from "@/i18n/locale-context";
import { cn } from "@/lib/cn";
import {
  addOnStatus,
  calculateEstimate,
  estimateToSearchParams,
  normalizeInput,
  type EstimateInput,
} from "@/lib/estimator";
import { quoteHrefForEstimate } from "@/lib/quote";
import { fill } from "@/lib/template";
import type { Dictionary } from "@/types/content";

type EstimatorProps = {
  initialInput: EstimateInput;
  copy: Dictionary["estimator"];
  pricing: Dictionary["pricing"];
};

const SUMMARY_ID = "vleresimi";

/**
 * Interactive price estimator. All numbers come from calculateEstimate(),
 * which only uses configured prices; the result is always presented as an
 * indicative estimate, never as a confirmed quote.
 */
export function Estimator({ initialInput, copy, pricing }: EstimatorProps) {
  const [input, setInput] = useState<EstimateInput>(() => normalizeInput(initialInput));
  const [pagesDraft, setPagesDraft] = useState(() => String(normalizeInput(initialInput).pages ?? ""));
  const locale = useLocale();
  const price = (amount: number) => formatPrice(amount, locale);
  const estimate = calculateEstimate(input);
  const rule = pageRules[input.packageId];
  const pagesHelpId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [showMobileBar, setShowMobileBar] = useState(false);

  // Mirror the choices in the URL so an estimate can be shared or bookmarked.
  useEffect(() => {
    const query = estimateToSearchParams(input).toString();
    if (window.location.search !== `?${query}`) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?${query}`);
    }
  }, [input]);

  // On small screens, show a compact total while the options are in view but the summary is not.
  useEffect(() => {
    const form = formRef.current;
    const summary = summaryRef.current;
    if (!form || !summary || !("IntersectionObserver" in window)) return;
    const visible = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
      setShowMobileBar(Boolean(visible.get(form)) && !visible.get(summary));
    });
    observer.observe(form);
    observer.observe(summary);
    return () => observer.disconnect();
  }, []);

  /** Applies a change; normalizeInput clamps pages and drops add-ons that no longer apply. */
  function update(next: Partial<EstimateInput>) {
    const normalized = normalizeInput({ ...input, ...next });
    setInput(normalized);
    setPagesDraft(String(normalized.pages ?? ""));
  }

  function selectPackage(packageId: PackageId) {
    const nextRule = pageRules[packageId];
    // Keep the visitor's page count when it still fits, otherwise start from what the package includes.
    const pages = nextRule ? Math.max(input.pages ?? 0, nextRule.included) : null;
    update({ packageId, pages });
  }

  function onPagesChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setPagesDraft(value);
    if (/^\d+$/.test(value)) {
      const normalized = normalizeInput({ ...input, pages: Number(value) });
      setInput(normalized);
    }
  }

  function toggleAddOn(id: (typeof addOns)[number]["id"]) {
    update({ addOns: input.addOns.includes(id) ? input.addOns.filter((a) => a !== id) : [...input.addOns, id] });
  }

  function reset() {
    // pages: null lets normalizeInput fall back to the pages included in the package.
    update({ packageId: defaultEstimatorPackage, pages: null, addOns: [] });
  }

  const packageName = pricing.packages[input.packageId].name;
  const totalText = estimate.kind === "estimate" ? price(estimate.total) : pricing.customPrice;
  const announcement =
    estimate.kind === "estimate" ? fill(copy.summary.announce, { total: totalText }) : copy.summary.announceQuote;
  const visibleAddOns = addOns.filter((a) => addOnStatus(a.id, input.packageId) !== "unavailable");

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <form
          ref={formRef}
          aria-label={copy.formLabel}
          onSubmit={(event) => event.preventDefault()}
          className="grid min-w-0 gap-10"
        >
          {/* Step 1: project type */}
          <fieldset className="min-w-0">
            <StepLegend number={1}>{copy.steps.package}</StepLegend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {packages.map((pkg) => {
                const selected = pkg.id === input.packageId;
                return (
                  <label
                    key={pkg.id}
                    className={cn(
                      "relative flex cursor-pointer flex-col rounded-xl border p-4 transition-colors duration-200",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                      selected
                        ? "border-accent/70 bg-accent/[0.08]"
                        : "border-border bg-surface hover:border-border-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name="package"
                      value={pkg.id}
                      checked={selected}
                      onChange={() => selectPackage(pkg.id)}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-fg">{pricing.packages[pkg.id].name}</span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border",
                          selected ? "border-accent bg-accent text-accent-fg" : "border-border-strong",
                        )}
                      >
                        {selected ? <Check className="size-3" /> : null}
                      </span>
                    </span>
                    <span className="mt-1 text-sm text-fg-muted">
                      {pkg.startingPrice === null ? (
                        pricing.customPrice
                      ) : (
                        <>
                          {pricing.from} <span className="font-semibold text-fg">{price(pkg.startingPrice)}</span>
                        </>
                      )}
                    </span>
                    <span className="mt-2 text-xs leading-relaxed text-fg-subtle">
                      {pricing.packages[pkg.id].summary}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Step 2: pages */}
          <fieldset className="min-w-0">
            <StepLegend number={2}>{copy.steps.pages}</StepLegend>
            {rule && rule.max > 1 ? (
              <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => update({ pages: (input.pages ?? 1) - 1 })}
                    disabled={(input.pages ?? 1) <= 1}
                    aria-label={copy.decreasePages}
                    className={buttonClasses({ variant: "secondary", size: "sm", className: "size-11 px-0" })}
                  >
                    <Minus aria-hidden="true" />
                  </button>
                  <label className="sr-only" htmlFor="estimator-pages">
                    {copy.pagesInputLabel}
                  </label>
                  <input
                    id="estimator-pages"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={rule.max}
                    value={pagesDraft}
                    onChange={onPagesChange}
                    onBlur={() => setPagesDraft(String(input.pages ?? ""))}
                    aria-describedby={pagesHelpId}
                    className="h-11 w-20 rounded-lg border border-border-strong bg-bg text-center text-lg font-semibold text-fg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => update({ pages: (input.pages ?? 0) + 1 })}
                    disabled={(input.pages ?? 0) >= rule.max}
                    aria-label={copy.increasePages}
                    className={buttonClasses({ variant: "secondary", size: "sm", className: "size-11 px-0" })}
                  >
                    <Plus aria-hidden="true" />
                  </button>
                </div>
                <p id={pagesHelpId} className="text-sm text-fg-muted sm:max-w-xs sm:text-right">
                  {fill(copy.pagesHelp, {
                    count: String(rule.included),
                    price: price(rule.extraPagePrice ?? 0),
                  })}
                </p>
              </div>
            ) : (
              <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-border bg-surface p-4 text-sm text-fg-muted">
                <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
                {rule ? copy.pagesFixed : copy.pagesNotApplicable}
              </p>
            )}
          </fieldset>

          {/* Step 3: add-ons */}
          <fieldset className="min-w-0">
            <StepLegend number={3}>{copy.steps.addOns}</StepLegend>
            {visibleAddOns.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {visibleAddOns.map((addOn) => {
                  const included = addOnStatus(addOn.id, input.packageId) === "included";
                  const checked = included || input.addOns.includes(addOn.id);
                  const text = copy.addOns[addOn.id];
                  return (
                    <label
                      key={addOn.id}
                      className={cn(
                        "flex gap-3 rounded-xl border p-4 transition-colors duration-200",
                        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                        included ? "cursor-default border-border bg-surface/60" : "cursor-pointer",
                        !included && checked ? "border-accent/70 bg-accent/[0.08]" : "",
                        !included && !checked ? "border-border bg-surface hover:border-border-strong" : "",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={included}
                        onChange={() => toggleAddOn(addOn.id)}
                        className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
                      />
                      <span className="flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-medium text-fg">{text.label}</span>
                          <span
                            className={cn(
                              "shrink-0 text-sm font-semibold",
                              included ? "text-success" : "text-accent-text",
                            )}
                          >
                            {included
                              ? copy.addOnState.included
                              : fill(copy.addOnState.price, { price: price(addOn.price) })}
                          </span>
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-fg-muted">{text.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-border bg-surface p-4 text-sm text-fg-muted">
                <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
                {copy.addOnsNone}
              </p>
            )}
          </fieldset>
        </form>

        {/* Summary */}
        <aside
          ref={summaryRef}
          id={SUMMARY_ID}
          aria-labelledby="estimate-summary-title"
          className="rounded-[1.5rem] border border-border-strong bg-surface-raised p-6 sm:p-8 lg:sticky lg:top-24"
        >
          <h2 id="estimate-summary-title" className="text-heading font-semibold text-fg">
            {copy.summary.title}
          </h2>

          {estimate.kind === "estimate" ? (
            <>
              <dl className="mt-6 grid gap-3 border-b border-border pb-6 text-sm">
                {estimate.lines.map((line) => {
                  const label =
                    line.kind === "base"
                      ? fill(copy.summary.base, { name: packageName })
                      : line.kind === "extraPages"
                        ? fill(copy.summary.extraPages, {
                            count: String(line.quantity),
                            price: price(line.unitPrice),
                          })
                        : copy.addOns[line.addOnId].label;
                  return (
                    <div key={line.kind === "addOn" ? line.addOnId : line.kind} className="flex justify-between gap-4">
                      <dt className="text-fg-muted">{label}</dt>
                      <dd className="shrink-0 font-medium text-fg">{price(line.amount)}</dd>
                    </div>
                  );
                })}
              </dl>
              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="text-sm font-medium text-fg-muted">{copy.summary.total}</p>
                <p className="flex items-baseline gap-2">
                  <span className="text-sm text-fg-subtle">{pricing.from}</span>
                  <span data-testid="estimate-total" className="font-display text-4xl font-semibold tracking-tight text-fg">
                    {totalText}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="mt-6">
              <p data-testid="estimate-total" className="font-display text-4xl font-semibold tracking-tight text-fg">
                {totalText}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{copy.summary.quoteOnlyText}</p>
            </div>
          )}

          {/* Shown whenever a number is shown; the custom-quote state explains itself above. */}
          {estimate.kind === "estimate" ? (
            <p className="mt-6 flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/[0.06] p-4 text-sm leading-relaxed text-fg-muted">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
              <span>
                {copy.summary.disclaimer}
                <span className="mt-2 block text-fg-subtle">{copy.summary.thirdParty}</span>
              </span>
            </p>
          ) : null}

          <div className="mt-6 grid gap-3">
            <ButtonLink href={quoteHrefForEstimate(input)} size="lg" className="group w-full">
              {estimate.kind === "estimate" ? copy.summary.cta : copy.summary.quoteCta}
              <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <button type="button" onClick={reset} className={buttonClasses({ variant: "ghost", className: "w-full" })}>
              <RotateCcw aria-hidden="true" />
              {copy.summary.reset}
            </button>
          </div>

          {/* Announces total changes to screen-reader users. */}
          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </aside>
      </div>

      {/* Compact total on small screens while the summary is out of view. */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/90 backdrop-blur-xl transition-transform duration-300 ease-out-expo lg:hidden",
          showMobileBar ? "translate-y-0" : "translate-y-full",
        )}
      >
        <a href={`#${SUMMARY_ID}`} tabIndex={-1} className="flex items-center justify-between gap-4 px-gutter py-3">
          <span className="text-sm text-fg-muted">{copy.summary.total}</span>
          <span className="flex items-baseline gap-1.5">
            {estimate.kind === "estimate" ? <span className="text-xs text-fg-subtle">{pricing.from}</span> : null}
            <span className="font-display text-xl font-semibold text-fg">{totalText}</span>
          </span>
        </a>
      </div>
    </>
  );
}

function StepLegend({ number, children }: { number: number; children: string }) {
  return (
    <legend className="flex items-center gap-3 text-lg font-semibold text-fg">
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-full border border-accent/50 font-mono text-sm text-accent-text"
      >
        {number}
      </span>
      {children}
    </legend>
  );
}
