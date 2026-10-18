import { Mail, MapPin, Phone } from "lucide-react";
import type { ContactChannel } from "@/lib/contact";
import { cn } from "@/lib/cn";

const icons = {
  email: Mail,
  phone: Phone,
  location: MapPin,
} as const;

type ContactListProps = {
  channels: ContactChannel[];
  labels: Record<ContactChannel["type"], string>;
  className?: string;
};

/** Renders only configured contact channels; renders nothing when none exist. */
export function ContactList({ channels, labels, className }: ContactListProps) {
  if (channels.length === 0) return null;

  return (
    <ul className={cn("grid gap-3", className)}>
      {channels.map((channel) => {
        const Icon = icons[channel.type];
        const content = (
          <>
            <Icon aria-hidden="true" className="size-4 shrink-0 text-accent-text" />
            <span className="sr-only">{labels[channel.type]}:</span>{" "}
            <span>{channel.value}</span>
          </>
        );
        return (
          <li key={channel.type} className="text-sm">
            {"href" in channel ? (
              <a
                href={channel.href}
                className="inline-flex items-center gap-2.5 rounded-sm text-fg-muted transition-colors hover:text-fg"
              >
                {content}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2.5 text-fg-muted">{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
