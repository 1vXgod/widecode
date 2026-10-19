import { FaqPreview } from "@/components/home/faq-preview";
import { Hero } from "@/components/home/hero";
import { PricingPreview } from "@/components/home/pricing-preview";
import { ProcessSection } from "@/components/home/process-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { ServicesSection } from "@/components/home/services-section";
import { WhySection } from "@/components/home/why-section";
import { CtaSection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { homeMetadata } from "@/lib/metadata";
import { siteJsonLd } from "@/lib/seo";

// The title comes from the layout's default; canonical and social fields are page-specific.
export const metadata = homeMetadata();

export default function HomePage() {
  const dict = getDictionary();

  return (
    <>
      {/* Structured data needs absolute URLs, so it waits for the production domain. */}
      {siteConfig.canonicalUrl ? <JsonLd data={siteJsonLd(dict.meta.description, siteConfig.canonicalUrl)} /> : null}
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
