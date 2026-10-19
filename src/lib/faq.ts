import { addOns } from "@/config/estimator";
import { formatPrice, getPackage, lowestStartingPrice } from "@/config/pricing";
import type { Locale } from "@/i18n/config";
import { fill } from "@/lib/template";
import type { FaqItem } from "@/types/content";

/** Values for the placeholders FAQ answers may use, always taken from the pricing config. */
export function faqValues(locale: Locale = "sq"): Record<string, string> {
  const multilingual = addOns.find((a) => a.id === "multilingual");
  const ecommerce = getPackage("ecommerce").startingPrice;
  if (!multilingual || ecommerce === null) throw new Error("FAQ prices are missing from the pricing config");
  return {
    price: formatPrice(lowestStartingPrice(), locale),
    multilingualPrice: formatPrice(multilingual.price, locale),
    ecommercePrice: formatPrice(ecommerce, locale),
  };
}

/** An FAQ item with its placeholders filled in. */
export function fillFaqItem(item: FaqItem, values = faqValues()): FaqItem {
  return { question: item.question, answer: fill(item.answer, values) };
}
