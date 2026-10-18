import Link from "next/link";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";
import { serviceIcons } from "@/components/services/service-icons";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { routes } from "@/config/routes";
import { serviceHref, serviceIds } from "@/config/services";
import type { Dictionary } from "@/types/content";

export function ServicesSection({ copy }: { copy: Dictionary["services"] }) {
  return (
    <Section id="sherbimet" aria-labelledby="services-title">
      <SectionHeader intro={copy} headingId="services-title" link={{ href: routes.services, label: copy.cta }} />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {serviceIds.map((id) => {
          const service = copy.items[id];
          const Icon = serviceIcons[id];
          return (
            <li key={id} className="reveal">
              <Card interactive className="flex h-full flex-col">
                <span className="grid size-11 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-text">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-6 text-heading font-semibold text-fg">
                  {/* Stretched link: the whole card opens the service section. */}
                  <Link
                    href={serviceHref(id)}
                    className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-ring"
                  >
                    {service.title}
                  </Link>
                </h3>
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
