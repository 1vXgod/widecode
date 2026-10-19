import { Link } from "@/i18n/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNav, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { localizedRoutes } from "@/i18n/routing";
import { getContactChannels, getSocialLinks } from "@/lib/contact";
import type { Dictionary } from "@/types/content";
import { ContactList } from "./contact-list";
import { HeaderShell } from "./header-shell";
import { LanguageSwitcher } from "./language-switcher";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { SocialLinks } from "./social-links";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ dict }: { dict: Dictionary }) {
  // Public paths in the page's language, so the current-page marker can compare them.
  const items = mainNav.map((key) => ({ href: localizedRoutes[dict.locale][key], label: dict.nav[key] }));
  const cta = { href: routes.contact, label: dict.header.cta };
  const languageLabels = { language: dict.a11y.language, languageButton: dict.a11y.languageButton };
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
      <Container className="flex h-header items-center justify-between gap-6 lg:gap-4 xl:gap-6">
        <Link href={routes.home} aria-label={dict.a11y.homeLinkLabel} className="shrink-0 rounded-lg">
          <Logo loading="eager" />
        </Link>

        <MainNav items={items} label={dict.a11y.mainNavLabel} className="hidden lg:block" />

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" labels={languageLabels} className="hidden sm:block" />
          <ThemeToggle labels={{ toLight: dict.a11y.themeToLight, toDark: dict.a11y.themeToDark }} />
          <ButtonLink href={cta.href} size="sm" className="group hidden shadow-none sm:inline-flex">
            {cta.label}
            {/*
              Between lg and xl the full navigation, language menu, theme toggle and this button share
              one row (tightest in German at 1024px): the decorative arrow and the switcher's globe are
              left out there, and the navigation is a little tighter (main-nav.tsx).
            */}
            <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 lg:max-xl:hidden" />
          </ButtonLink>
          <MobileMenu
            items={items}
            cta={cta}
            extra={menuExtra}
            languageLabels={languageLabels}
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
