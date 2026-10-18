import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeEuro,
  CodeXml,
  Gem,
  Globe,
  Handshake,
  MessagesSquare,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ProcessSection } from "@/components/home/process-section";
import { CtaSection } from "@/components/sections/cta-section";
import { PageIntro } from "@/components/sections/page-intro";
import { SectionHeader } from "@/components/sections/section-header";
import { serviceIcons } from "@/components/services/service-icons";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { routes } from "@/config/routes";
import { serviceHref, serviceIds } from "@/config/services";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { quoteHref } from "@/lib/quote";
import { valueIds, type ValueId } from "@/types/content";

export const metadata = pageMetadata("about");

const valueIcons: Record<ValueId, LucideIcon> = {
  transparency: BadgeEuro,
  quality: Gem,
  custom: CodeXml,
  communication: MessagesSquare,
  honesty: Scale,
  partnership: Handshake,
};

export default function AboutPage() {
  const dict = getDictionary();
  const page = dict.aboutPage;

  return (
    <>
      <PageIntro
        headingId="about-page-title"
        eyebrow={page.intro.eyebrow}
        title={page.intro.title}
        lead={page.intro.lead}
        actions={
          <>
            <ButtonLink href={quoteHref()} size="lg" className="group">
              {page.intro.primaryCta}
              <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={routes.services} size="lg" variant="secondary">
              {page.intro.secondaryCta}
            </ButtonLink>
          </>
        }
      />

      {/* Mission */}
      <Section aria-labelledby="mission-title" containerClassName="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="reveal">
          <p className="text-sm font-medium text-accent-text">{page.mission.eyebrow}</p>
          <h2 id="mission-title" className="mt-4 text-title font-semibold text-fg">
            {page.mission.title}
          </h2>
          <div className="mt-6 grid gap-5 text-lead text-fg-muted">
            {page.mission.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <figure className="reveal relative isolate overflow-hidden rounded-[1.75rem] border border-border-strong bg-surface-raised p-8 sm:p-10">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-40" />
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-accent/25 blur-[90px]"
          />
          <Logo height={52} />
          <blockquote className="mt-10 font-display text-heading leading-snug font-medium text-fg">
            {page.mission.statement}
          </blockquote>
        </figure>
      </Section>

      {/* Values */}
      <Section tone="surface" aria-labelledby="values-title">
        <SectionHeader intro={page.values} headingId="values-title" />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {valueIds.map((id) => {
            const value = page.values.items[id];
            const Icon = valueIcons[id];
            return (
              <li key={id} className="reveal bg-bg p-7 sm:p-8">
                <Icon aria-hidden="true" className="size-6 text-accent-text" />
                <h3 className="mt-5 text-lg font-semibold text-fg">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{value.text}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Services overview */}
      <Section aria-labelledby="about-services-title">
        <SectionHeader
          intro={page.services}
          headingId="about-services-title"
          link={{ href: routes.services, label: page.services.cta }}
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {serviceIds.map((id) => {
            const service = dict.services.items[id];
            const Icon = serviceIcons[id];
            return (
              <li key={id} className="reveal">
                <Card interactive className="group flex h-full gap-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-text">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-fg">
                      <Link
                        href={serviceHref(id)}
                        className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-ring"
                      >
                        {service.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">{service.summary}</p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="ml-auto size-5 shrink-0 text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      <ProcessSection copy={dict.process} />

      {/* Market */}
      <Section aria-labelledby="market-title" size="narrow">
        <div className="reveal flex flex-col items-start gap-5 sm:flex-row sm:gap-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-text">
            <Globe aria-hidden="true" className="size-6" />
          </span>
          <div>
            <h2 id="market-title" className="text-heading font-semibold text-fg">
              {page.market.title}
            </h2>
            <p className="mt-3 text-lead text-fg-muted">{page.market.text}</p>
          </div>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
