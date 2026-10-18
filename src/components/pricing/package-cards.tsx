import Link from "next/link";
import { ArrowRight, Calculator, Check, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatPrice, packages, type PricingPackage } from "@/config/pricing";
import { cn } from "@/lib/cn";
import { estimatorHref, quoteHref } from "@/lib/quote";
import type { Dictionary } from "@/types/content";

type PricingCopy = Dictionary["pricing"];

const pricedPackages = packages.filter((p) => p.startingPrice !== null);
const customPackage = packages.find((p) => p.startingPrice === null);

/**
 * Package cards for every priced package, from the central pricing config.
 * Pass `estimateCta` to add a link that opens the estimator with the package preselected.
 */
export function PackageGrid({ copy, estimateCta }: { copy: PricingCopy; estimateCta?: string }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {pricedPackages.map((pkg) => (
        <li key={pkg.id} className="reveal">
          <PackageCard pkg={pkg} copy={copy} estimateCta={estimateCta} />
        </li>
      ))}
    </ul>
  );
}

function PackageCard({ pkg, copy, estimateCta }: { pkg: PricingPackage; copy: PricingCopy; estimateCta?: string }) {
  const text = copy.packages[pkg.id];

  return (
    <article
      aria-label={text.name}
      className={cn(
        "relative flex h-full flex-col rounded-card border p-6 sm:p-7",
        pkg.recommended
          ? "border-accent/60 bg-linear-to-b from-accent/[0.12] to-surface shadow-glow"
          : "border-border bg-surface",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-fg">{text.name}</h3>
        {pkg.recommended ? <Badge variant="accent">{copy.recommended}</Badge> : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{text.summary}</p>
      <p className="mt-6 flex items-baseline gap-2">
        <span className="text-sm text-fg-subtle">{copy.from}</span>
        <span className="font-display text-4xl font-semibold tracking-tight text-fg">
          {formatPrice(pkg.startingPrice ?? 0)}
        </span>
      </p>
      <ul className="mt-6 grid gap-2.5 border-t border-border pt-6">
        {text.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-fg-muted">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-auto grid gap-3 pt-8">
        <ButtonLink
          href={quoteHref(pkg.id)}
          variant={pkg.recommended ? "primary" : "secondary"}
          className="w-full"
          aria-label={`${copy.packageCta}: ${text.name}`}
        >
          {copy.packageCta}
        </ButtonLink>
        {estimateCta ? (
          <Link
            href={estimatorHref(pkg.id)}
            aria-label={`${estimateCta}: ${text.name}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium text-accent-text transition-colors hover:text-fg"
          >
            <Calculator aria-hidden="true" className="size-4" />
            {estimateCta}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

/** The custom package: no starting price, always "on request". */
export function CustomPackageBand({ copy, showFeatures = false }: { copy: PricingCopy; showFeatures?: boolean }) {
  if (!customPackage) return null;
  const text = copy.packages[customPackage.id];

  return (
    <article
      aria-label={text.name}
      className="reveal flex flex-col gap-6 rounded-card border border-border bg-surface p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold text-fg">{text.name}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{text.summary}</p>
        {showFeatures ? (
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {text.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-fg-muted">
                <Check aria-hidden="true" className="size-4 shrink-0 text-accent-text" />
                {feature}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center">
        <span className="font-display text-2xl font-semibold text-fg">{copy.customPrice}</span>
        <ButtonLink
          href={quoteHref(customPackage.id)}
          variant="secondary"
          className="group"
          aria-label={`${copy.customCta}: ${text.name}`}
        >
          {copy.customCta}
          <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
        </ButtonLink>
      </div>
    </article>
  );
}

/** Indicative-price disclaimer; must accompany every display of prices. */
export function PricingDisclaimer({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn("flex max-w-3xl items-start gap-2.5 text-sm leading-relaxed text-fg-muted", className)}>
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
      {text}
    </p>
  );
}
