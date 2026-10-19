import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BACK_TO_TOP_THRESHOLD, BackToTop } from "@/components/layout/back-to-top";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/layout/skip-link";

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    window.dispatchEvent(new Event("scroll"));
  });
}

function reducedMotion(reduce: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) => ({ matches: reduce && query.includes("reduce"), media: query }) as MediaQueryList,
  );
}

const button = () => screen.getByRole("button", { name: "Back to top", hidden: true });

describe("BackToTop", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn() as typeof window.scrollTo;
    scrollTo(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders hidden on the server and at the top of the page, so hydration always matches", () => {
    const html = renderToString(<BackToTop label="Back to top" />);
    expect(html).toContain('aria-label="Back to top"');
    expect(html).toContain('inert=""');
    expect(html).toContain("opacity-0");

    render(<BackToTop label="Back to top" />);
    expect(button()).toHaveAttribute("inert");
    expect(button()).toHaveClass("opacity-0", "pointer-events-none");
  });

  it("appears once the page is scrolled past the threshold, and hides again near the top", () => {
    render(<BackToTop label="Back to top" />);
    scrollTo(BACK_TO_TOP_THRESHOLD);
    expect(button()).toHaveAttribute("inert");

    scrollTo(BACK_TO_TOP_THRESHOLD + 1);
    expect(screen.getByRole("button", { name: "Back to top" })).not.toHaveAttribute("inert");
    expect(button()).toHaveClass("opacity-100");
    expect(button()).toHaveAttribute("type", "button");

    scrollTo(120);
    expect(button()).toHaveAttribute("inert");
  });

  it("scrolls smoothly back to the top", async () => {
    reducedMotion(false);
    render(<BackToTop label="Back to top" />);
    scrollTo(1500);
    await userEvent.click(button());
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("jumps instantly when the visitor prefers reduced motion", async () => {
    reducedMotion(true);
    render(<BackToTop label="Back to top" />);
    scrollTo(1500);
    await userEvent.click(button());
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });

  it("moves keyboard focus to the start of the page, but leaves pointer clicks alone", async () => {
    reducedMotion(false);
    render(
      <>
        <SkipLink label="Skip to main content" />
        <main id={MAIN_CONTENT_ID} />
        <BackToTop label="Back to top" />
      </>,
    );
    scrollTo(1500);

    await userEvent.click(button());
    expect(screen.getByRole("link", { name: "Skip to main content" })).not.toHaveFocus();

    // Enter or Space on a focused button dispatches a click with detail 0.
    button().focus();
    fireEvent.click(button(), { detail: 0 });
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveFocus();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });
  });

  it("uses the localized label as its accessible name", () => {
    scrollTo(1500);
    for (const label of ["Kthehu në krye", "Back to top", "Zurück nach oben"]) {
      const { unmount } = render(<BackToTop label={label} />);
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
      unmount();
    }
  });
});
