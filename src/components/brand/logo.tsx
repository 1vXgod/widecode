import { cn } from "@/lib/cn";

/**
 * Temporary WideCode logo (no official logo provided yet).
 * Replace the mark here and in src/app/icon.svg / apple-icon.tsx when brand assets exist.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[0.6rem] bg-linear-to-br from-accent to-accent-2 shadow-glow",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-6" fill="none">
        <path
          d="M7 10l4 12 5-9 5 9 4-12"
          stroke="currentColor"
          className="text-white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-lg font-semibold tracking-tight text-fg">
        Wide<span className="text-accent-text">Code</span>
      </span>
    </span>
  );
}
