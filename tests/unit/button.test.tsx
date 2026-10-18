import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/button";

describe("Button", () => {
  it("defaults to type=button so it never submits forms by accident", () => {
    render(<Button>Dërgo</Button>);
    expect(screen.getByRole("button", { name: "Dërgo" })).toHaveAttribute("type", "button");
  });

  it("allows an explicit submit type", () => {
    render(<Button type="submit">Dërgo</Button>);
    expect(screen.getByRole("button", { name: "Dërgo" })).toHaveAttribute("type", "submit");
  });

  it("renders ButtonLink as a real link", () => {
    render(<ButtonLink href="/kontakt">Kërko ofertë</ButtonLink>);
    expect(screen.getByRole("link", { name: "Kërko ofertë" })).toHaveAttribute("href", "/kontakt");
  });

  it("applies variant and size classes, letting overrides win", () => {
    const classes = buttonClasses({ variant: "secondary", size: "lg", className: "h-14" });
    expect(classes).toContain("border-border-strong");
    expect(classes).toContain("h-14");
    expect(classes).not.toContain("h-12");
  });
});
