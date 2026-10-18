import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Use "h1" once per page (page intro); "h2" for sections. */
  as?: "h1" | "h2";
  /** Visual size; defaults to display for h1 and title for h2. */
  size?: "display" | "title";
  align?: "left" | "center";
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  size = Heading === "h1" ? "display" : "title",
  align = "left",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-narrow flex-col gap-5",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? <Badge variant="accent">{eyebrow}</Badge> : null}
      <Heading
        id={id}
        className={cn("font-semibold text-fg", size === "display" ? "text-display" : "text-title")}
      >
        {title}
      </Heading>
      {description ? <p className="text-lead text-fg-muted">{description}</p> : null}
    </div>
  );
}
