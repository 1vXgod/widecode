import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNav, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getContactChannels, getSocialLinks } from "@/lib/contact";
import type { Dictionary } from "@/types/content";
import { ContactList } from "./contact-list";
import { HeaderShell } from "./header-shell";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { SocialLinks } from "./social-links";

export function SiteHeader({ dict }: { dict: Dictionary }) {
  const items = mainNav.map((key) => ({ href: routes[key], label: dict.nav[key] }));
  const cta = { href: routes.contact, label: dict.header.cta };
  const channels = getContactChannels(siteConfig.contact);
  const socialLinks = getSocialLinks(siteConfig.social);

  const menuExtra =
    channels.length > 0 || socialLinks.length > 0 ? (
      <>
        <ContactList channels={channels} labels={dict.contact.labels} />
        <SocialLinks
          links={socialLinks}
          labels={dict.social}
          navLabel={dict.a11y.socialNavLabel}
          newTabLabel={dict.a11y.opensInNewTab}
        />
      </>
    ) : undefined;

  return (
    <HeaderShell>
      <Container className="flex h-header items-center justify-between gap-6">
        <Link href={routes.home} aria-label={dict.a11y.homeLinkLabel} className="rounded-lg">
          <Logo />
        </Link>

        <MainNav items={items} label={dict.a11y.mainNavLabel} className="hidden lg:block" />

        <div className="flex items-center gap-2">
          <ButtonLink href={cta.href} size="sm" className="group hidden shadow-none sm:inline-flex">
            {cta.label}
            <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </ButtonLink>
          <MobileMenu
            items={items}
            cta={cta}
            extra={menuExtra}
            labels={{
              open: dict.a11y.openMenu,
              close: dict.a11y.closeMenu,
              title: dict.a11y.menuTitle,
              nav: dict.a11y.mainNavLabel,
              home: dict.a11y.homeLinkLabel,
            }}
          />
        </div>
      </Container>
    </HeaderShell>
  );
}
