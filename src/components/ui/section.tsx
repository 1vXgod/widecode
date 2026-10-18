import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Container, type ContainerSize } from "./container";

const tones = {
  default: "",
  surface: "bg-surface border-y border-border",
} as const;

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: keyof typeof tones;
  size?: ContainerSize;
  /** Extra classes for the inner container. */
  containerClassName?: string;
};

/** Page section with consistent vertical rhythm and an inner container. */
export function Section({
  tone = "default",
  size = "content",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("relative py-section", tones[tone], className)} {...props}>
      <Container size={size} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}
