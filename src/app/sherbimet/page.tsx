import Link from "next/link";
import { Accessibility, ArrowRight, CodeXml, Gauge, Info, Search, ShieldCheck, Smartphone, type LucideIcon } from "lucide-react";
import { FaqPreview } from "@/components/home/faq-preview";
import { CtaSection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { PageIntro } from "@/components/sections/page-intro";
import { SectionHeader } from "@/components/sections/section-header";
import { ServiceDetail } from "@/components/services/service-detail";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getPackage } from "@/config/pricing";
import { routes } from "@/config/routes";
import { serviceHref, services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { quoteHref } from "@/lib/quote";
import { servicesJsonLd } from "@/lib/seo";
import { standardIds, type StandardId } from "@/types/content";

export const metadata = pageMetadata("services");

const standardIcons: Record<StandardId, LucideIcon> = {
  responsive: Smartphone,
  seo: Search,
  performance: Gauge,
  accessibility: Accessibility,
  security: ShieldCheck,
  custom: CodeXml,
};

/** FAQ entries most relevant to services: cost, timeline and mobile support. */
const SERVICE_FAQ = [0, 2, 3] as const;

export default function ServicesPage() {
  const dict = getDictionary();
  const page = dict.servicesPage;

  return (
    <>
      {/* Structured data needs absolute URLs, so it waits for the production domain. */}
      {siteConfig.canonicalUrl ? (
        <JsonLd
          data={servicesJsonLd(
            services.map((service) => {
              const prices = service.packages.flatMap((id) => {
                const price = getPackage(id).startingPrice;
                return price === null ? [] : [price];
              });
              return {
                name: dict.services.items[service.id].title,
                description: dict.services.items[service.id].summary,
                path: serviceHref(service.id),
                startingPrice: prices.length > 0 ? Math.min(...prices) : null,
              };
            }),
            siteConfig.canonicalUrl,
          )}
        />
      ) : null}
      <PageIntro
        headingId="services-page-title"
        eyebrow={page.intro.eyebrow}
        title={page.intro.title}
        lead={page.intro.lead}
        actions={
          <>
            <ButtonLink href={quoteHref()} size="lg" className="group">
              {page.intro.primaryCta}
              <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={routes.pricing} size="lg" variant="secondary">
              {page.intro.secondaryCta}
            </ButtonLink>
          </>
        }
      >
        <nav aria-label={page.onThisPage} className="mt-14 animate-fade-up">
          <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">{page.onThisPage}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href={`#${service.anchor}`}
                  className="inline-flex rounded-full border border-border-strong px-4 py-2 text-sm text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
                >
                  {dict.services.items[service.id].title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      {services.map((service, index) => (
        <ServiceDetail key={service.id} service={service} index={index} dict={dict} />
      ))}

      {/* Prices above are indicative starting prices; the disclaimer must stay next to them. */}
      <Container className="pb-16">
        <div className="reveal flex max-w-3xl items-start gap-2.5 border-t border-border pt-8 text-sm leading-relaxed text-fg-muted">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
          <p>
            {dict.pricing.disclaimer}{" "}
            <Link href={routes.pricing} className="rounded-sm font-medium text-accent-text hover:text-fg">
              {dict.pricing.viewAll}
            </Link>
          </p>
        </div>
      </Container>

      <Section tone="surface" aria-labelledby="standards-title">
        <SectionHeader intro={page.standards} headingId="standards-title" />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {standardIds.map((id) => {
            const item = page.standards.items[id];
            const Icon = standardIcons[id];
            return (
              <li key={id} className="reveal bg-bg p-7 sm:p-8">
                <Icon aria-hidden="true" className="size-6 text-accent-text" />
                <h3 className="mt-5 text-lg font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.text}</p>
              </li>
            );
          })}
        </ul>

        <div className="reveal mt-8 flex flex-col gap-6 rounded-card border border-border bg-bg p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <Info aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent-text" />
            <div>
              <h3 className="text-lg font-semibold text-fg">{page.process.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{page.process.text}</p>
            </div>
          </div>
          <ButtonLink href={`${routes.about}#procesi`} variant="secondary" className="group shrink-0">
            {page.process.cta}
            <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
        </div>
      </Section>

      <FaqPreview copy={dict.faq} itemIndices={SERVICE_FAQ} />
      <CtaSection />
    </>
  );
}
