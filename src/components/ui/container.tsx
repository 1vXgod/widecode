import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  narrow: "max-w-narrow",
  content: "max-w-content",
  wide: "max-w-wide",
} as const;

export type ContainerSize = keyof typeof sizes;

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: ContainerSize;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** Horizontally centered, width-constrained wrapper with responsive gutters. */
export function Container<T extends ElementType = "div">({
  as,
  size = "content",
  className,
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component className={cn("mx-auto w-full px-gutter", sizes[size], className)} {...props} />;
}
