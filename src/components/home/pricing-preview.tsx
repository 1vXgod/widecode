import { CustomPackageBand, PackageGrid, PricingDisclaimer } from "@/components/pricing/package-cards";
import { SectionHeader } from "@/components/sections/section-header";
import { Section } from "@/components/ui/section";
import { routes } from "@/config/routes";
import type { Dictionary } from "@/types/content";

export function PricingPreview({ copy }: { copy: Dictionary["pricing"] }) {
  return (
    <Section id="cmimet" aria-labelledby="pricing-title">
      <SectionHeader intro={copy} headingId="pricing-title" link={{ href: routes.pricing, label: copy.viewAll }} />
      <div className="mt-14">
        <PackageGrid copy={copy} />
      </div>
      <div className="mt-5">
        <CustomPackageBand copy={copy} />
      </div>
      <PricingDisclaimer text={copy.disclaimer} className="reveal mt-8" />
    </Section>
  );
}
