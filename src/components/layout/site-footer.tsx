import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { footerNav, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/types/content";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  const { email } = siteConfig.contact;

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex max-w-sm flex-col gap-4">
          <Link href={routes.home} aria-label={dict.a11y.homeLinkLabel} className="self-start rounded-lg">
            <Logo />
          </Link>
          <p className="text-sm leading-relaxed text-fg-muted">{dict.footer.tagline}</p>
        </div>

        <nav aria-label={dict.a11y.footerNavLabel}>
          <h2 className="text-sm font-semibold text-fg">{dict.footer.navHeading}</h2>
          <ul className="mt-4 grid gap-2.5">
            {footerNav.map((key) => (
              <li key={key}>
                <Link href={routes[key]} className="text-sm text-fg-muted transition-colors hover:text-fg">
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-fg">{dict.footer.contactHeading}</h2>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">{dict.footer.contactText}</p>
          {email ? (
            <a href={`mailto:${email}`} className="mt-3 block text-sm text-fg hover:text-accent-text">
              {email}
            </a>
          ) : null}
          <Link
            href={routes.contact}
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:text-fg"
          >
            {dict.footer.contactLink}
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>

      <Container className="border-t border-border py-6">
        <p className="text-xs text-fg-subtle">
          © {siteConfig.name}. {dict.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
