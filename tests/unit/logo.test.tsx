import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LOGO_DARK, LOGO_LIGHT, LOGO_LIGHT_SCALE, Logo } from "@/components/brand/logo";

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

  it.each([32, 44, 52])("keeps each file's aspect ratio at %ipx high", (height) => {
    render(<Logo height={height} />);
    const { dark, light } = logos();
    expect(Number(dark.getAttribute("height"))).toBe(height);
    expect(Number(dark.getAttribute("width")) / height).toBeCloseTo(LOGO_DARK.width / LOGO_DARK.height, 1);
    const lightHeight = Number(light.getAttribute("height"));
    expect(lightHeight).toBe(Math.round(height * LOGO_LIGHT_SCALE));
    expect(Number(light.getAttribute("width")) / lightHeight).toBeCloseTo(LOGO_LIGHT.width / LOGO_LIGHT.height, 1);
  });
});
