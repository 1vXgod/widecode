import { ArrowRight, Check, Info } from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { formatPrice, packages, type PackageId } from "@/config/pricing";
import { routes } from "@/config/routes";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/types/content";

/** Contact link that pre-selects a package for the (upcoming) quote form. */
export function quoteHref(id: PackageId): string {
  return `${routes.contact}?paketa=${id}`;
}

export function PricingPreview({ copy }: { copy: Dictionary["pricing"] }) {
  const priced = packages.filter((p) => p.startingPrice !== null);
  const custom = packages.find((p) => p.startingPrice === null);

  return (
    <Section id="cmimet" aria-labelledby="pricing-title">
      <SectionHeader intro={copy} headingId="pricing-title" link={{ href: routes.pricing, label: copy.viewAll }} />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {priced.map((pkg) => {
          const text = copy.packages[pkg.id];
          return (
            <li key={pkg.id} className="reveal">
              <article
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
                <ButtonLink
                  href={quoteHref(pkg.id)}
                  variant={pkg.recommended ? "primary" : "secondary"}
                  className="mt-8 w-full"
                  aria-label={`${copy.packageCta}: ${text.name}`}
                >
                  {copy.packageCta}
                </ButtonLink>
              </article>
            </li>
          );
        })}
      </ul>

      {custom ? (
        <div className="reveal mt-5 flex flex-col gap-6 rounded-card border border-border bg-surface p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-fg">{copy.packages[custom.id].name}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{copy.packages[custom.id].summary}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center">
            <span className="font-display text-2xl font-semibold text-fg">{copy.customPrice}</span>
            <ButtonLink href={quoteHref(custom.id)} variant="secondary" className="group">
              {copy.customCta}
              <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          </div>
        </div>
      ) : null}

      <p className="reveal mt-8 flex max-w-3xl items-start gap-2.5 text-sm leading-relaxed text-fg-muted">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
        {copy.disclaimer}
      </p>
    </Section>
  );
}
