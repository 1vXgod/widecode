import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LOGO_DARK, LOGO_LIGHT, Logo } from "@/components/brand/logo";

/** Both theme versions are in the markup; CSS shows one (jsdom applies no CSS, so both are found here). */
function logos() {
  const [dark, light] = screen.getAllByRole("img", { name: "WideCode" });
  return { dark: dark!, light: light! };
}

describe("Logo", () => {
  it("renders the supplied logo files for both themes with accessible alt text", () => {
    render(<Logo />);
    const { dark, light } = logos();
    expect(dark.getAttribute("src")).toContain(encodeURIComponent(LOGO_DARK.src));
    expect(light.getAttribute("src")).toContain(encodeURIComponent(LOGO_LIGHT.src));
    // Only one is shown at a time.
    expect(dark).toHaveClass("light:hidden");
    expect(light).toHaveClass("hidden", "light:block");
  });

  it.each([26, 32, 44])("has the same height in both themes and keeps each file's aspect ratio at %ipx", (height) => {
    render(<Logo height={height} />);
    const { dark, light } = logos();
    for (const [img, file] of [[dark, LOGO_DARK], [light, LOGO_LIGHT]] as const) {
      expect(Number(img.getAttribute("height"))).toBe(height);
      expect(Number(img.getAttribute("width")) / height).toBeCloseTo(file.width / file.height, 1);
    }
  });

  it("defaults to the header size", () => {
    render(<Logo />);
    expect(Number(logos().dark.getAttribute("height"))).toBe(26);
  });
});
