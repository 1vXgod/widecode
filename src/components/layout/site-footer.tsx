import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { footerNav, routes, type FooterNavGroup } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getContactChannels, getSocialLinks } from "@/lib/contact";
import { getCurrentYear } from "@/lib/current-year";
import type { Dictionary } from "@/types/content";
import { ContactList } from "./contact-list";
import { SocialLinks } from "./social-links";

const linkClass = "rounded-sm text-sm text-fg-muted transition-colors duration-200 hover:text-fg";

export async function SiteFooter({ dict }: { dict: Dictionary }) {
  const year = await getCurrentYear();
  const channels = getContactChannels(siteConfig.contact);
  const socialLinks = getSocialLinks(siteConfig.social);
  const groups = Object.keys(footerNav) as FooterNavGroup[];

  return (
    <footer className="border-t border-border bg-surface">
      {/* Call to action */}
      <Container className="py-14 sm:py-16">
        <div className="relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-card border border-border bg-surface-raised p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-accent/25 blur-[90px]"
          />
          <div className="max-w-xl">
            <h2 className="text-heading font-semibold text-fg">{dict.footer.ctaTitle}</h2>
            <p className="mt-2 text-fg-muted">{dict.footer.ctaText}</p>
          </div>
          <ButtonLink href={routes.contact} size="lg" className="group">
            {dict.header.cta}
            <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </ButtonLink>
        </div>
      </Container>

      {/* Columns */}
      <Container className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div className="flex max-w-sm flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <Link href={routes.home} aria-label={dict.a11y.homeLinkLabel} className="self-start rounded-lg">
            <Logo />
          </Link>
          <p className="text-sm leading-relaxed text-fg-muted">{dict.footer.tagline}</p>
        </div>

        <nav aria-label={dict.a11y.footerNavLabel} className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-2">
          {groups.map((group) => (
            <div key={group}>
              <h2 className="text-sm font-semibold text-fg">{dict.footer.groups[group]}</h2>
              <ul className="mt-4 grid gap-2.5">
                {footerNav[group].map((key) => (
                  <li key={key}>
                    <Link href={routes[key]} className={linkClass}>
                      {dict.nav[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-fg">{dict.footer.contactHeading}</h2>
          {channels.length > 0 ? (
            <ContactList channels={channels} labels={dict.contact.labels} className="mt-4" />
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">{dict.footer.contactPending}</p>
          )}
          <Link
            href={routes.contact}
            className="group mt-4 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-accent-text transition-colors hover:text-fg"
          >
            {dict.footer.contactLink}
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {socialLinks.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-fg">{dict.footer.socialHeading}</h2>
              <SocialLinks
                links={socialLinks}
                labels={dict.social}
                navLabel={dict.a11y.socialNavLabel}
                newTabLabel={dict.a11y.opensInNewTab}
                className="mt-4"
              />
            </div>
          ) : null}
        </div>
      </Container>

      {/* Legal */}
      <Container>
        <p className="border-t border-border py-6 text-xs text-fg-subtle">
          © {year} {siteConfig.name}. {dict.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
