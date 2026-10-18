import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LOGO_DARK, Logo } from "@/components/brand/logo";

describe("Logo", () => {
  it("renders the supplied logo file with accessible alt text", () => {
    render(<Logo />);
    const img = screen.getByRole("img", { name: "WideCode" });
    expect(img.getAttribute("src")).toContain(encodeURIComponent(LOGO_DARK.src));
  });

  it.each([32, 44, 52])("keeps the file's aspect ratio at %ipx high", (height) => {
    render(<Logo height={height} />);
    const img = screen.getByRole("img", { name: "WideCode" });
    const width = Number(img.getAttribute("width"));
    expect(Number(img.getAttribute("height"))).toBe(height);
    expect(width / height).toBeCloseTo(LOGO_DARK.width / LOGO_DARK.height, 1);
  });
});
