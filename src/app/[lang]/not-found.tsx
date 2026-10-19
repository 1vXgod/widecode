import type { Metadata } from "next";
import { NotFoundContent } from "@/components/sections/not-found-content";
import { getDictionary } from "@/content";

const { notFound } = getDictionary();

export const metadata: Metadata = {
  title: notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundContent copy={notFound} />;
}
