import { FaqPreview } from "@/components/home/faq-preview";
import { Hero } from "@/components/home/hero";
import { PricingPreview } from "@/components/home/pricing-preview";
import { ProcessSection } from "@/components/home/process-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { ServicesSection } from "@/components/home/services-section";
import { WhySection } from "@/components/home/why-section";
import { CtaSection } from "@/components/sections/cta-section";
import { getDictionary } from "@/content";

export default function HomePage() {
  const dict = getDictionary();

  return (
    <>
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
