import type { Metadata } from "next";
import { NotFoundContent } from "@/components/sections/not-found-content";
import { getPageDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { notFound } = await getPageDictionary();
  return {
    title: notFound.title,
    robots: { index: false },
  };
}

export default async function NotFound() {
  const { notFound } = await getPageDictionary();
  return <NotFoundContent copy={notFound} />;
}
