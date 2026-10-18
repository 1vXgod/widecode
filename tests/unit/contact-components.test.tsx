import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactList } from "@/components/layout/contact-list";
import { SocialLinks } from "@/components/layout/social-links";
import { getDictionary } from "@/content";
import { getContactChannels, getSocialLinks } from "@/lib/contact";

const dict = getDictionary("sq");

describe("ContactList", () => {
  it("renders nothing when no channels are configured", () => {
    const { container } = render(<ContactList channels={[]} labels={dict.contact.labels} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders working mailto and tel links with accessible labels", () => {
    const channels = getContactChannels({ email: "info@example.com", phone: "+383 44 000 000", location: "Prishtinë" });
    render(<ContactList channels={channels} labels={dict.contact.labels} />);

    expect(screen.getByRole("link", { name: "Email: info@example.com" })).toHaveAttribute(
      "href",
      "mailto:info@example.com",
    );
    expect(screen.getByRole("link", { name: "Telefoni: +383 44 000 000" })).toHaveAttribute("href", "tel:+38344000000");
    expect(screen.getByText("Prishtinë")).toBeInTheDocument();
  });
});

describe("SocialLinks", () => {
  const props = {
    labels: dict.social,
    navLabel: dict.a11y.socialNavLabel,
    newTabLabel: dict.a11y.opensInNewTab,
  };

  it("renders nothing when no profiles are configured", () => {
    const { container } = render(<SocialLinks links={[]} {...props} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders safe external links announced as opening in a new tab", () => {
    const links = getSocialLinks({ instagram: "https://www.instagram.com/example" });
    render(<SocialLinks links={links} {...props} />);

    const nav = screen.getByRole("navigation", { name: "Rrjetet sociale" });
    expect(nav).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Instagram (hapet në skedë të re)" });
    expect(link).toHaveAttribute("href", "https://www.instagram.com/example");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
