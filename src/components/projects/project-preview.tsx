import type { CSSProperties } from "react";
import type { ProjectPreview as PreviewConfig } from "@/config/projects";
import { cn } from "@/lib/cn";

/**
 * Illustrative, CSS-only preview of a demo project (no stock imagery).
 * Decorative: the card around it carries the accessible text.
 */
export function ProjectPreview({ preview, className }: { preview: PreviewConfig; className?: string }) {
  const style = { "--p-accent": preview.accent, "--p-tint": preview.tint } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn("@container relative aspect-[4/3] overflow-hidden bg-(--p-tint)", className)}
    >
      <div className="absolute inset-0 bg-linear-to-br from-(--p-accent)/20 via-transparent to-transparent" />
      <div className="absolute inset-[6cqw] top-[8cqw] overflow-hidden rounded-[2.5cqw] border border-white/10 bg-black/40 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-[1.4cqw] border-b border-white/10 px-[3cqw] py-[2.2cqw]">
          <span className="size-[1.8cqw] rounded-full bg-white/20" />
          <span className="size-[1.8cqw] rounded-full bg-white/20" />
          <span className="size-[1.8cqw] rounded-full bg-white/20" />
        </div>
        <div className="p-[4cqw]">
          {preview.layout === "restaurant" && <RestaurantLayout />}
          {preview.layout === "shop" && <ShopLayout />}
          {preview.layout === "dashboard" && <DashboardLayout />}
        </div>
      </div>
    </div>
  );
}

function Bar({ className }: { className?: string }) {
  return <span className={cn("block h-[2cqw] rounded-full bg-white/15", className)} />;
}

function RestaurantLayout() {
  return (
    <div className="grid gap-[3cqw]">
      <div className="flex h-[22cqw] flex-col justify-end gap-[1.6cqw] rounded-[2cqw] bg-linear-to-br from-(--p-accent)/60 to-(--p-accent)/10 p-[3cqw]">
        <Bar className="h-[3cqw] w-1/2 bg-white/70" />
        <Bar className="w-1/3 bg-white/40" />
      </div>
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-[2cqw]">
          <Bar className="w-2/5" />
          <span className="flex-1 border-b border-dotted border-white/15" />
          <Bar className="w-[8cqw] bg-(--p-accent)/70" />
        </div>
      ))}
    </div>
  );
}

function ShopLayout() {
  return (
    <div className="grid grid-cols-3 gap-[2.4cqw]">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="grid gap-[1.2cqw]">
          <span
            className={cn(
              "block aspect-square rounded-[1.6cqw]",
              item % 2 === 0 ? "bg-(--p-accent)/40" : "bg-white/10",
            )}
          />
          <Bar className="w-4/5" />
          <Bar className="w-2/5 bg-(--p-accent)/70" />
        </div>
      ))}
    </div>
  );
}

function DashboardLayout() {
  const bars = [45, 70, 55, 90, 65, 80, 50];
  return (
    <div className="grid grid-cols-[18cqw_1fr] gap-[3cqw]">
      <div className="grid content-start gap-[2cqw]">
        <Bar className="bg-(--p-accent)/70" />
        <Bar />
        <Bar />
        <Bar />
      </div>
      <div className="grid gap-[3cqw]">
        <div className="grid grid-cols-3 gap-[2cqw]">
          {[0, 1, 2].map((tile) => (
            <div key={tile} className="grid gap-[1.2cqw] rounded-[1.6cqw] bg-white/[0.06] p-[2cqw]">
              <Bar className="w-1/2" />
              <Bar className="h-[3cqw] w-3/4 bg-white/30" />
            </div>
          ))}
        </div>
        <div className="flex h-[20cqw] items-end gap-[1.6cqw] rounded-[1.6cqw] bg-white/[0.04] p-[2cqw]">
          {bars.map((height, i) => (
            <span key={i} className="flex-1 rounded-t-[0.8cqw] bg-(--p-accent)/70" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
