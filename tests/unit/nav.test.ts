import { describe, expect, it } from "vitest";
import { isActivePath } from "@/components/layout/nav-types";

describe("isActivePath", () => {
  it("matches the exact page", () => {
    expect(isActivePath("/cmimet", "/cmimet")).toBe(true);
  });

  it("matches nested pages", () => {
    expect(isActivePath("/portofoli/projekt-demo", "/portofoli")).toBe(true);
  });

  it("does not match sibling paths sharing a prefix", () => {
    expect(isActivePath("/cmimet-extra", "/cmimet")).toBe(false);
  });

  it("only matches home on the root path", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/cmimet", "/")).toBe(false);
  });
});
