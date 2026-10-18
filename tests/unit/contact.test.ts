import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { getContactChannels, getSocialLinks } from "@/lib/contact";

describe("getContactChannels", () => {
  it("returns nothing when nothing is configured", () => {
    expect(getContactChannels({})).toEqual([]);
    expect(getContactChannels({ email: "  ", phone: "", location: " " })).toEqual([]);
  });

  it("builds mailto and tel links for valid values", () => {
    expect(getContactChannels({ email: "info@example.com", phone: "+383 44 000 000", location: "Prishtinë" })).toEqual([
      { type: "email", value: "info@example.com", href: "mailto:info@example.com" },
      { type: "phone", value: "+383 44 000 000", href: "tel:+38344000000" },
      { type: "location", value: "Prishtinë" },
    ]);
  });

  it("drops malformed email and phone values instead of rendering broken links", () => {
    expect(getContactChannels({ email: "not-an-email", phone: "call us" })).toEqual([]);
  });
});

describe("getSocialLinks", () => {
  it("returns nothing when nothing is configured", () => {
    expect(getSocialLinks({})).toEqual([]);
  });

  it("keeps only absolute https URLs, in platform order", () => {
    expect(
      getSocialLinks({
        linkedin: "https://www.linkedin.com/company/example",
        instagram: "https://www.instagram.com/example",
        facebook: "http://facebook.com/insecure",
        github: "github.com/no-protocol",
        x: "   ",
      }),
    ).toEqual([
      { platform: "instagram", href: "https://www.instagram.com/example" },
      { platform: "linkedin", href: "https://www.linkedin.com/company/example" },
    ]);
  });
});

describe("site configuration", () => {
  it("does not ship invented contact details or social URLs", () => {
    // Update this test deliberately when real, confirmed details are added.
    expect(getContactChannels(siteConfig.contact)).toEqual([]);
    expect(getSocialLinks(siteConfig.social)).toEqual([]);
  });
});
