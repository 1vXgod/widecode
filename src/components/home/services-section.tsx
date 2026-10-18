import { Building2, Check, CodeXml, Monitor, ShoppingBag, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { routes } from "@/config/routes";
import { serviceIds, type Dictionary, type ServiceId } from "@/types/content";

const icons: Record<ServiceId, LucideIcon> = {
  presentation: Monitor,
  business: Building2,
  ecommerce: ShoppingBag,
  platform: CodeXml,
};

export function ServicesSection({ copy }: { copy: Dictionary["services"] }) {
  return (
    <Section id="sherbimet" aria-labelledby="services-title">
      <SectionHeader intro={copy} headingId="services-title" link={{ href: routes.services, label: copy.cta }} />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {serviceIds.map((id) => {
          const service = copy.items[id];
          const Icon = icons[id];
          return (
            <li key={id} className="reveal">
              <Card className="flex h-full flex-col">
                <span className="grid size-11 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-text">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-6 text-heading font-semibold text-fg">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{service.summary}</p>
                <ul className="mt-6 grid gap-2.5 border-t border-border pt-6">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-fg-muted">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
