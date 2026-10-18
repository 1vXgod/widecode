import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNav, routes } from "@/config/routes";
import type { Dictionary } from "@/types/content";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader({ dict }: { dict: Dictionary }) {
  const items = mainNav.map((key) => ({ href: routes[key], label: dict.nav[key] }));
  const cta = { href: routes.contact, label: dict.header.cta };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/75 backdrop-blur-xl">
      <Container className="flex h-header items-center justify-between gap-6">
        <Link href={routes.home} aria-label={dict.a11y.homeLinkLabel} className="rounded-lg">
          <Logo />
        </Link>

        <MainNav items={items} label={dict.a11y.mainNavLabel} className="hidden lg:block" />

        <div className="flex items-center gap-2">
          <ButtonLink href={cta.href} size="sm" className="hidden sm:inline-flex">
            {cta.label}
          </ButtonLink>
          <MobileMenu
            items={items}
            cta={cta}
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
    </header>
  );
}
