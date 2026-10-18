import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { MobileMenu } from "@/components/layout/mobile-menu";

vi.mock("next/navigation", () => ({
  usePathname: () => "/cmimet",
}));

// Plain anchor so clicks don't require a mounted Next.js router.
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        event.preventDefault();
        props.onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

const labels = {
  open: "Hap menynë",
  close: "Mbyll menynë",
  title: "Menyja",
  nav: "Navigimi kryesor",
  home: "WideCode — ballina",
};

function renderMenu() {
  render(
    <MobileMenu
      items={[
        { href: "/sherbimet", label: "Shërbimet" },
        { href: "/cmimet", label: "Çmimet" },
      ]}
      cta={{ href: "/kontakt", label: "Kërko ofertë" }}
      labels={labels}
    />,
  );
  const trigger = screen.getByRole("button", { name: labels.open });
  const dialog = document.querySelector("dialog");
  if (!dialog) throw new Error("dialog not rendered");
  return { trigger, dialog };
}

describe("MobileMenu", () => {
  it("starts closed with a labelled, collapsed trigger", () => {
    const { trigger, dialog } = renderMenu();
    expect(dialog).not.toHaveAttribute("open");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
  });

  it("opens and closes with the buttons, returning focus to the trigger", async () => {
    const user = userEvent.setup();
    const { trigger, dialog } = renderMenu();

    await user.click(trigger);
    expect(dialog).toHaveAttribute("open");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: labels.close }));
    expect(dialog).not.toHaveAttribute("open");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes when a navigation link is chosen", async () => {
    const user = userEvent.setup();
    const { trigger, dialog } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole("link", { name: "Shërbimet" }));
    expect(dialog).not.toHaveAttribute("open");
  });

  it("renders optional extra content inside the menu only when provided", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <MobileMenu items={[]} cta={{ href: "/kontakt", label: "Merr një ofertë" }} labels={labels} />,
    );
    expect(screen.queryByTestId("menu-extra")).not.toBeInTheDocument();

    rerender(
      <MobileMenu
        items={[]}
        cta={{ href: "/kontakt", label: "Merr një ofertë" }}
        labels={labels}
        extra={<p data-testid="menu-extra">Kontakt</p>}
      />,
    );
    await user.click(screen.getByRole("button", { name: labels.open }));
    expect(screen.getByTestId("menu-extra")).toBeInTheDocument();
  });

  it("marks the current page", async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();
    await user.click(trigger);

    expect(screen.getByRole("link", { name: "Çmimet" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Shërbimet" })).not.toHaveAttribute("aria-current");
  });
});
