import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const variants = {
  default: "border-border-strong bg-white/[0.04] text-fg-muted",
  accent: "border-accent/40 bg-accent/10 text-accent-text",
  outline: "border-border-strong bg-transparent text-fg-muted",
} as const;

export type BadgeVariant = keyof typeof variants;

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

/** Small pill label, e.g. for eyebrows, categories or "Demo" markers. */
export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
