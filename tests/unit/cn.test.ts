import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins conditional classes", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("keeps custom font-size tokens alongside text colors", () => {
    expect(cn("text-display text-fg")).toBe("text-display text-fg");
    expect(cn("text-lead text-fg-muted")).toBe("text-lead text-fg-muted");
  });

  it("resolves conflicts between custom tokens of the same kind", () => {
    expect(cn("text-title", "text-display")).toBe("text-display");
    expect(cn("max-w-content", "max-w-narrow")).toBe("max-w-narrow");
    expect(cn("py-section", "py-4")).toBe("py-4");
    expect(cn("bg-accent", "bg-accent-hover")).toBe("bg-accent-hover");
  });
});
