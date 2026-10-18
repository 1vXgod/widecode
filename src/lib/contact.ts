export type ContactConfig = {
  email?: string;
  /** International format, e.g. "+383 4X XXX XXX". */
  phone?: string;
  /** Free text shown as-is, e.g. a city. */
  location?: string;
};

export const socialPlatforms = ["instagram", "facebook", "linkedin", "github", "tiktok", "x"] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export type SocialConfig = Partial<Record<SocialPlatform, string>>;

export type ContactChannel =
  | { type: "email"; value: string; href: string }
  | { type: "phone"; value: string; href: string }
  | { type: "location"; value: string };

export type SocialLink = { platform: SocialPlatform; href: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s()-]{6,20}$/;

/** Returns only the contact channels that are actually configured and valid. */
export function getContactChannels(contact: ContactConfig): ContactChannel[] {
  const channels: ContactChannel[] = [];

  const email = contact.email?.trim();
  if (email && EMAIL_PATTERN.test(email)) {
    channels.push({ type: "email", value: email, href: `mailto:${email}` });
  }

  const phone = contact.phone?.trim();
  if (phone && PHONE_PATTERN.test(phone)) {
    channels.push({ type: "phone", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` });
  }

  const location = contact.location?.trim();
  if (location) {
    channels.push({ type: "location", value: location });
  }

  return channels;
}

/** Returns configured social links with absolute https URLs, in a stable order. */
export function getSocialLinks(social: SocialConfig): SocialLink[] {
  return socialPlatforms.flatMap((platform) => {
    const raw = social[platform]?.trim();
    if (!raw) return [];
    try {
      const url = new URL(raw);
      return url.protocol === "https:" ? [{ platform, href: url.href }] : [];
    } catch {
      return [];
    }
  });
}
