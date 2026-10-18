import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/types/content";

/**
 * Questions and answers as native <details>: keyboard accessible and works
 * without JavaScript. Items must already have their placeholders filled.
 */
export function FaqList({ items, className }: { items: readonly FaqItem[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-fg transition-colors hover:text-accent-text [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus
              aria-hidden="true"
              className="size-5 shrink-0 text-fg-muted transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="pb-6 text-sm leading-relaxed text-fg-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
