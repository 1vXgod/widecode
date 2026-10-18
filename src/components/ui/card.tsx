import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  /** Adds hover feedback; use when the card contains a primary link. */
  interactive?: boolean;
};

/** Elevated surface for grouped content (services, packages, projects). */
export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-card border border-border bg-surface p-6 sm:p-8",
        interactive &&
          "transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-raised",
        className,
      )}
      {...props}
    />
  );
}
