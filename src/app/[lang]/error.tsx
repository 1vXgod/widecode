"use client";

import { RotateCcw } from "lucide-react";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/config/routes";
import { errorPages } from "@/content/error-pages";
import { useLocale } from "@/i18n/locale-context";

/**
 * Shown in place of a page that failed to render, inside the normal header and
 * footer. Server errors arrive without their message (Next.js hides it in
 * production); only the digest is shown, so it can be matched to the server log.
 */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  const errorPage = errorPages[useLocale()];
  const digest = error instanceof Error && "digest" in error && typeof error.digest === "string" ? error.digest : null;

  return (
    <Section className="min-h-[60vh]">
      <SectionHeading as="h1" size="title" title={errorPage.title} description={errorPage.text} />
      <div className="mt-10 flex flex-col gap-3 xs:flex-row">
        <button type="button" onClick={() => retry()} className={buttonClasses()}>
          <RotateCcw aria-hidden="true" />
          {errorPage.retry}
        </button>
        <ButtonLink href={routes.home} variant="secondary">
          {errorPage.backHome}
        </ButtonLink>
      </div>
      {digest ? (
        <p className="mt-8 text-xs text-fg-subtle">
          {errorPage.reference}: <code>{digest}</code>
        </p>
      ) : null}
    </Section>
  );
}
