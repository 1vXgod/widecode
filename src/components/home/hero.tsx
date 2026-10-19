import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPrice, lowestStartingPrice } from "@/config/pricing";
import { routes } from "@/config/routes";
import { getLocale } from "@/i18n/server";
import { fill } from "@/lib/template";
import type { Dictionary } from "@/types/content";
import { HeroShowcase } from "./hero-showcase";

export async function Hero({ copy }: { copy: Dictionary["home"] }) {
  const { hero } = copy;
  const priceNote = fill(hero.priceNote, { price: formatPrice(lowestStartingPrice(), await getLocale()) });

  return (
    // Pulled up behind the transparent header so the backdrop runs edge to edge.
    <section aria-labelledby="hero-title" className="relative isolate -mt-header overflow-hidden pt-header">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-50" />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[70rem] max-w-[160vw] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-40 -z-10 size-[28rem] rounded-full bg-accent-2/10 blur-[120px]"
      />

      <Container className="grid items-center gap-14 pt-12 pb-20 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pt-24 lg:pb-28">
        <div className="animate-fade-up">
          <Badge variant="accent">{hero.eyebrow}</Badge>
          <h1 id="hero-title" className="mt-6 text-display font-semibold text-fg">
            {hero.title} <span className="text-gradient">{hero.titleHighlight}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-fg-muted">{hero.lead}</p>

          <div className="mt-10 flex flex-col gap-3 xs:flex-row">
            <ButtonLink href={routes.contact} size="lg" className="group">
              {hero.primaryCta}
              <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={routes.projects} size="lg" variant="secondary">
              {hero.secondaryCta}
            </ButtonLink>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
            {[priceNote, hero.noObligation].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden="true" className="size-4 text-accent-text" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroShowcase copy={copy.showcase} />
      </Container>
    </section>
  );
}
