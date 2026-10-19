import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowRight, Calculator } from "lucide-react";
import { ContactList } from "@/components/layout/contact-list";
import { QuoteForm } from "@/components/quote/quote-form";
import { QuoteFormFromUrl } from "@/components/quote/quote-form-from-url";
import { PageIntro } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { projectSlugs, type ProjectSlug } from "@/config/projects";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/content";
import { getContactChannels } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import { resolveDeliveryConfig } from "@/lib/quote-delivery";
import type { QuoteCopy } from "@/lib/quote-labels";
import { emptyQuotePrefill } from "@/lib/quote-request";

export const metadata = pageMetadata("contact");

/**
 * Whether quote requests can be delivered, from server environment variables
 * at request time. Only "available or not" reaches the browser, never the
 * delivery mode or its configuration.
 */
async function deliveryAvailability(): Promise<boolean> {
  await connection();
  return resolveDeliveryConfig().mode !== "disabled";
}

export default function ContactPage() {
  const dict = getDictionary();
  const page = dict.contactPage;
  const copy: QuoteCopy = { contactPage: page, pricing: dict.pricing, estimator: dict.estimator };
  const projectTitles = Object.fromEntries(
    projectSlugs.map((slug) => [slug, dict.projects.items[slug].title]),
  ) as Record<ProjectSlug, string>;
  const channels = getContactChannels(siteConfig.contact);

  return (
    <>
      <PageIntro headingId="contact-page-title" eyebrow={page.intro.eyebrow} title={page.intro.title} lead={page.intro.lead} />

      <Section className="pt-0 sm:pt-0">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0">
            {/*
              The fallback (the empty form, same layout) is only part of the prerendered
              shell; the pre-filled form replaces it while the page loads. On client-side
              navigations the form renders at once from the URL (see QuoteFormFromUrl).
            */}
            <Suspense
              fallback={
                <QuoteForm prefill={emptyQuotePrefill} available={null} copy={copy} projectTitles={projectTitles} />
              }
            >
              <QuoteFormFromUrl availability={deliveryAvailability()} copy={copy} projectTitles={projectTitles} />
            </Suspense>
          </div>

          <aside aria-labelledby="contact-next-title" className="grid min-w-0 gap-6 lg:sticky lg:top-24">
            <div className="rounded-card border border-border bg-surface p-6 sm:p-8">
              <h2 id="contact-next-title" className="text-lg font-semibold text-fg">
                {page.aside.nextTitle}
              </h2>
              <ol className="mt-6 grid gap-5">
                {page.aside.steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full border border-accent/50 font-mono text-sm text-accent-text"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-fg">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-card border border-border bg-surface p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-fg">{page.aside.priceTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{page.aside.priceText}</p>
              <div className="mt-5 flex flex-col gap-3 xs:flex-row lg:flex-col xl:flex-row">
                <ButtonLink href={routes.estimator} variant="secondary">
                  <Calculator aria-hidden="true" />
                  {page.aside.estimatorCta}
                </ButtonLink>
                <ButtonLink href={routes.pricing} variant="ghost">
                  {page.aside.pricingCta}
                  <ArrowRight aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>

            {/* Only configured, real contact details; nothing is shown until they exist. */}
            {channels.length > 0 ? (
              <div className="rounded-card border border-border bg-surface p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-fg">{page.aside.contactTitle}</h2>
                <ContactList channels={channels} labels={dict.contact.labels} className="mt-4" />
              </div>
            ) : null}
          </aside>
        </div>
      </Section>
    </>
  );
}
