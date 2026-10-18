import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { formatPrice, getPackage } from "@/config/pricing";
import type { Service } from "@/config/services";
import { quoteHref } from "@/lib/quote";
import type { Dictionary } from "@/types/content";
import { serviceIcons } from "./service-icons";

type ServiceDetailProps = {
  service: Service;
  index: number;
  dict: Dictionary;
};

/** One service on the services page: description, fit, scope and matching packages. */
export function ServiceDetail({ service, index, dict }: ServiceDetailProps) {
  const page = dict.servicesPage;
  const detail = page.details[service.id];
  const { title } = dict.services.items[service.id];
  const Icon = serviceIcons[service.id];
  const headingId = `${service.anchor}-title`;

  return (
    <section id={service.anchor} aria-labelledby={headingId} className="border-t border-border py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="reveal">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-text">
              <Icon aria-hidden="true" className="size-6" />
            </span>
            <span aria-hidden="true" className="font-mono text-sm text-fg-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h2 id={headingId} className="mt-6 text-title font-semibold text-fg">
            {title}
          </h2>
          <p className="mt-5 text-lead text-fg-muted">{detail.description}</p>

          <h3 className="mt-10 text-sm font-semibold tracking-wide text-fg">{page.idealForLabel}</h3>
          <ul className="mt-4 grid gap-3">
            {detail.idealFor.map((item) => (
              <li key={item} className="flex items-start gap-3 text-fg-muted">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-text" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Card className="reveal self-start">
          <h3 className="text-sm font-semibold tracking-wide text-fg">{page.includesLabel}</h3>
          <ul className="mt-5 grid gap-3">
            {detail.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-fg-muted">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 border-t border-border pt-8 text-sm font-semibold tracking-wide text-fg">
            {page.packagesLabel}
          </h3>
          <ul className="mt-5 grid gap-3">
            {service.packages.map((id, i) => {
              const pkg = getPackage(id);
              const name = dict.pricing.packages[id].name;
              return (
                <li
                  key={id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-bg/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-fg">{name}</p>
                    <p className="mt-1 text-sm text-fg-muted">
                      {pkg.startingPrice === null ? (
                        dict.pricing.customPrice
                      ) : (
                        <>
                          {dict.pricing.from}{" "}
                          <span className="font-semibold text-fg">{formatPrice(pkg.startingPrice)}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <ButtonLink
                    href={quoteHref(id)}
                    size="sm"
                    variant={i === 0 ? "primary" : "secondary"}
                    className="group shadow-none"
                    aria-label={`${page.quoteCta}: ${name}`}
                  >
                    {page.quoteCta}
                    <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                  </ButtonLink>
                </li>
              );
            })}
          </ul>
        </Card>
      </Container>
    </section>
  );
}
