/**
 * FAQ page topics in display order. Each id is also the topic's anchor on
 * /pyetje-te-shpeshta (e.g. #cmimet). Text lives in src/content/<locale>/faq-page.ts.
 */
export const faqCategoryIds = ["cmimet", "procesi", "website", "pas-publikimit"] as const;

export type FaqCategoryId = (typeof faqCategoryIds)[number];
