import type { Metadata } from "next";
import { ArrowRight, Blocks, Calculator, FileText, Gauge, Layers, Plug, type LucideIcon } from "lucide-react";
import { FaqPreview } from "@/components/home/faq-preview";
import { AddOnList } from "@/components/pricing/add-on-list";
import { CustomPackageBand, PackageGrid, PricingDisclaimer } from "@/components/pricing/package-cards";
import { CtaSection } from "@/components/sections/cta-section";
import { PageIntro } from "@/components/sections/page-intro";
import { SectionHeader } from "@/components/sections/section-header";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getLocale, getPageDictionary } from "@/i18n/server";
import { pageMetadata } from "@/lib/metadata";
import { estimatorHref, quoteHref } from "@/lib/quote";
import { priceFactorIds, type PriceFactorId } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("pricing", undefined, await getLocale());
}

const factorIcons: Record<PriceFactorId, LucideIcon> = {
  scope: Layers,
  features: Blocks,
  content: FileText,
  integrations: Plug,
  complexity: Gauge,
};

/** FAQ entries about prices: cost, why prices are "starting" prices, and timelines. */
const PRICING_FAQ = [0, 1, 2] as const;

export default async function PricingPage() {
  const dict = await getPageDictionary();
  const page = dict.pricingPage;

  return (
    <>
      <PageIntro
        headingId="pricing-page-title"
        eyebrow={page.intro.eyebrow}
        title={page.intro.title}
        lead={page.intro.lead}
        actions={
          <>
            <ButtonLink href={estimatorHref()} size="lg" className="group">
              <Calculator aria-hidden="true" />
              {page.intro.primaryCta}
            </ButtonLink>
            <ButtonLink href={quoteHref()} size="lg" variant="secondary">
              {page.intro.secondaryCta}
            </ButtonLink>
          </>
        }
      />

      <Section aria-labelledby="packages-title" className="pt-0 sm:pt-0">
        <SectionHeader intro={page.packages} headingId="packages-title" />
        <div className="mt-14">
          <PackageGrid copy={dict.pricing} estimateCta={page.packages.estimateCta} />
        </div>
        <div className="mt-5">
          <CustomPackageBand copy={dict.pricing} showFeatures />
        </div>
        <PricingDisclaimer text={dict.pricing.disclaimer} className="reveal mt-8" />
      </Section>

      <Section tone="surface" aria-labelledby="add-ons-title">
        <SectionHeader intro={page.addOns} headingId="add-ons-title" />
        <div className="mt-14">
          <AddOnList dict={dict} />
        </div>
        <PricingDisclaimer text={dict.estimator.summary.disclaimer} className="reveal mt-8" />
        <PricingDisclaimer text={dict.estimator.summary.thirdParty} className="reveal mt-3" />
      </Section>

      <Section aria-labelledby="factors-title">
        <SectionHeader intro={page.factors} headingId="factors-title" />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {priceFactorIds.map((id) => {
            const factor = page.factors.items[id];
            const Icon = factorIcons[id];
            return (
              <li key={id} className="reveal bg-bg p-6">
                <Icon aria-hidden="true" className="size-6 text-accent-text" />
                <h3 className="mt-5 font-semibold text-fg">{factor.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{factor.text}</p>
              </li>
            );
          })}
        </ul>

        <div className="reveal mt-8 flex flex-col gap-6 rounded-card border border-accent/40 bg-linear-to-r from-accent/[0.12] to-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <Calculator aria-hidden="true" className="mt-1 size-6 shrink-0 text-accent-text" />
            <div>
              <h3 className="text-lg font-semibold text-fg">{page.estimatorCta.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{page.estimatorCta.text}</p>
            </div>
          </div>
          <ButtonLink href={estimatorHref()} className="group shrink-0">
            {page.estimatorCta.cta}
            <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
        </div>
      </Section>

      <FaqPreview copy={dict.faq} itemIndices={PRICING_FAQ} />
      <CtaSection />
    </>
  );
}
