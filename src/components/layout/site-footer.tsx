import { Link } from "@/i18n/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
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
      {/* Columns (the page-level CTA lives in components/sections/cta-section.tsx) */}
      <Container className="grid gap-12 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div className="flex max-w-sm flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <Link href={routes.home} aria-label={dict.a11y.homeLinkLabel} className="self-start rounded-lg">
            <Logo height={52} />
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
