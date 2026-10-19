"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "./routing";
import { useLocale } from "./locale-context";

/**
 * next/link that keeps visitors in their language: internal links are written
 * with the Albanian routes (src/config/routes.ts) and translated here into the
 * current page's language, e.g. "/sherbimet#online-shop" → "/en/services#online-shop".
 */
export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  return <NextLink href={typeof href === "string" ? localizeHref(href, locale) : href} {...props} />;
}
