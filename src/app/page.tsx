import type { Metadata } from "next";
import { FaqPreview } from "@/components/home/faq-preview";
import { Hero } from "@/components/home/hero";
import { PricingPreview } from "@/components/home/pricing-preview";
import { ProcessSection } from "@/components/home/process-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { ServicesSection } from "@/components/home/services-section";
import { WhySection } from "@/components/home/why-section";
import { CtaSection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/routes";
import { getDictionary } from "@/content";
import { baseOpenGraph } from "@/lib/metadata";
import { siteJsonLd } from "@/lib/seo";

const { meta } = getDictionary();

// The title comes from the layout's default; only the canonical URL is page-specific.
export const metadata: Metadata = {
  alternates: { canonical: routes.home },
  openGraph: { ...baseOpenGraph(), title: meta.defaultTitle, description: meta.description, url: routes.home },
};

export default function HomePage() {
  const dict = getDictionary();

  return (
    <>
      <JsonLd data={siteJsonLd(dict.meta.description)} />
      <Hero copy={dict.home} />
      <ServicesSection copy={dict.services} />
      <ProjectsSection copy={dict.projects} />
      <PricingPreview copy={dict.pricing} />
      <ProcessSection copy={dict.process} />
      <WhySection copy={dict.why} />
      <FaqPreview copy={dict.faq} />
      <CtaSection />
    </>
  );
}
