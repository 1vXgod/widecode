import type { Metadata } from "next";
import { Suspense } from "react";
import { Estimator } from "@/components/estimator/estimator";
import { EstimatorFromUrl } from "@/components/estimator/estimator-from-url";
import { CtaSection } from "@/components/sections/cta-section";
import { PageIntro } from "@/components/sections/page-intro";
import { Section } from "@/components/ui/section";
import { getLocale, getPageDictionary } from "@/i18n/server";
import { normalizeInput } from "@/lib/estimator";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("estimator", undefined, await getLocale());
}

export default async function EstimatorPage() {
  const dict = await getPageDictionary();
  const { intro } = dict.estimator;

  return (
    <>
      <PageIntro headingId="estimator-page-title" eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} />

      <Section className="pt-0 sm:pt-0">
        {/*
          The fallback is the estimator in its default state, so the prerendered
          HTML has the same layout; preselections from the URL apply on the client.
        */}
        <Suspense
          fallback={<Estimator initialInput={normalizeInput({})} copy={dict.estimator} pricing={dict.pricing} />}
        >
          <EstimatorFromUrl copy={dict.estimator} pricing={dict.pricing} />
        </Suspense>
      </Section>

      <CtaSection />
    </>
  );
}
