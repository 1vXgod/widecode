import { addOns, pageRules } from "@/config/estimator";
import { formatPrice, packageIds, type PackageId } from "@/config/pricing";
import { formatList } from "@/lib/format";
import { fill } from "@/lib/template";
import type { Dictionary } from "@/types/content";

type AddOnListProps = {
  dict: Dictionary;
};

/**
 * Add-on prices, generated from src/config/estimator.ts so this list and the
 * estimator can never disagree.
 */
export function AddOnList({ dict }: AddOnListProps) {
  const copy = dict.pricingPage.addOns;
  const names = (ids: readonly PackageId[]) =>
    formatList(packageIds.filter((id) => ids.includes(id)).map((id) => dict.pricing.packages[id].name), dict.locale);

  const pagePackages = packageIds.filter((id) => pageRules[id]?.extraPagePrice !== undefined);
  const extraPagePrice = pagePackages.map((id) => pageRules[id]?.extraPagePrice).find((p) => p !== undefined);

  const rows = [
    ...(extraPagePrice !== undefined
      ? [
          {
            key: "pages",
            label: copy.extraPage,
            // e.g. "Për faqet mbi numrin e përfshirë në paketë (Business 5 faqe dhe Professional 10 faqe)."
            description: `${copy.extraPageNote} (${formatList(
              pagePackages.map((id) =>
                fill(copy.includedPages, {
                  name: dict.pricing.packages[id].name,
                  count: String(pageRules[id]?.included ?? 0),
                }),
              ),
              dict.locale,
            )}).`,
            price: fill(copy.perPage, { price: formatPrice(extraPagePrice, dict.locale) }),
            availability: [fill(copy.availableFor, { packages: names(pagePackages) })],
          },
        ]
      : []),
    ...addOns.map((addOn) => ({
      key: addOn.id,
      label: dict.estimator.addOns[addOn.id].label,
      description: dict.estimator.addOns[addOn.id].description,
      price: `+${formatPrice(addOn.price, dict.locale)}`,
      availability: [
        fill(copy.availableFor, { packages: names(addOn.availableFor) }),
        ...(addOn.includedIn?.length ? [fill(copy.includedIn, { packages: names(addOn.includedIn) })] : []),
      ],
    })),
  ];

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <li key={row.key} className="reveal flex flex-col rounded-card border border-border bg-bg p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-fg">{row.label}</h3>
            <span className="shrink-0 font-display text-lg font-semibold text-accent-text">{row.price}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{row.description}</p>
          <ul className="mt-auto grid gap-1 pt-5 text-xs text-fg-subtle">
            {row.availability.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
