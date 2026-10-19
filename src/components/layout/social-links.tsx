import { ArrowUpRight } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/lib/contact";
import { cn } from "@/lib/cn";

type SocialLinksProps = {
  links: SocialLink[];
  labels: Record<SocialPlatform, string>;
  navLabel: string;
  newTabLabel: string;
  className?: string;
};

/** External profile links; renders nothing until real URLs are configured. */
export function SocialLinks({ links, labels, navLabel, newTabLabel, className }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <nav aria-label={navLabel} className={className}>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.platform}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group inline-flex items-center gap-1 rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium text-fg-muted",
                "transition-colors duration-200 hover:border-fg/25 hover:text-fg",
              )}
            >
              {labels[link.platform]}{" "}
              <span className="sr-only">{newTabLabel}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
