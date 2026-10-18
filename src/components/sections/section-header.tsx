import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import type { SectionIntro } from "@/types/content";

type SectionHeaderProps = {
  intro: SectionIntro;
  /** id for the h2, referenced by the section's aria-labelledby. */
  headingId: string;
  link?: { href: string; label: string };
  className?: string;
};

/** Section intro with an optional "see all" link aligned to the right on wide screens. */
export function SectionHeader({ intro, headingId, link, className }: SectionHeaderProps) {
  return (
    <div className={cn("reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <SectionHeading
        id={headingId}
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />
      {link ? (
        <Link
          href={link.href}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-medium text-accent-text transition-colors hover:text-fg"
        >
          {link.label}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
