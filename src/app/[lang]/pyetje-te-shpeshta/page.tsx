import type { Metadata } from "next";
import { Link } from "@/i18n/link";
import { CtaSection } from "@/components/sections/cta-section";
import { FaqList } from "@/components/sections/faq-list";
import { PageIntro } from "@/components/sections/page-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { faqCategoryIds } from "@/config/faq";
import { getLocale, getPageDictionary } from "@/i18n/server";
import { faqValues, fillFaqItem } from "@/lib/faq";
import { pageMetadata } from "@/lib/metadata";
import { faqJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("faq", undefined, await getLocale());
}

export default async function FaqPage() {
  const dict = await getPageDictionary();
  const page = dict.faqPage;
  const values = faqValues(dict.locale);
  const categories = faqCategoryIds.map((id) => ({
    id,
    title: page.categories[id].title,
    items: page.categories[id].items.map((item) => fillFaqItem(item, values)),
  }));

  return (
    <>
      <JsonLd data={faqJsonLd(categories.flatMap((category) => category.items), dict.locale)} />

      <PageIntro headingId="faq-page-title" eyebrow={page.intro.eyebrow} title={page.intro.title} lead={page.intro.lead}>
        <nav aria-label={page.onThisPage} className="mt-14 animate-fade-up">
          <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">{page.onThisPage}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`#${category.id}`}
                  className="inline-flex rounded-full border border-border-strong px-4 py-2 text-sm text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      <Section className="pt-0 sm:pt-0" containerClassName="grid gap-16 sm:gap-20">
        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`${category.id}-title`}
            className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
          >
            <h2 id={`${category.id}-title`} className="reveal text-heading font-semibold text-fg">
              {category.title}
            </h2>
            <FaqList items={category.items} className="reveal self-start" />
          </section>
        ))}
      </Section>

      <CtaSection />
    </>
  );
}
