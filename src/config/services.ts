import type { PackageId } from "@/config/pricing";
import { routes } from "@/config/routes";

/**
 * Services offered, in display order. Text lives in src/content/<locale>,
 * keyed by ServiceId. `packages` lists the pricing packages that fit the
 * service; their quote links pre-select that package on the contact page.
 */
export const serviceIds = ["presentation", "business", "ecommerce", "platform"] as const;

export type ServiceId = (typeof serviceIds)[number];

export type Service = {
  id: ServiceId;
  /** Section id on the services page, used for deep links. */
  anchor: string;
  packages: readonly PackageId[];
};

export const services: readonly Service[] = [
  { id: "presentation", anchor: "uebfaqe-prezantuese", packages: ["starter"] },
  { id: "business", anchor: "uebfaqe-biznesi", packages: ["business", "professional"] },
  { id: "ecommerce", anchor: "dyqane-online", packages: ["ecommerce"] },
  { id: "platform", anchor: "platforma-me-porosi", packages: ["custom"] },
];

export function getService(id: ServiceId): Service {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service "${id}"`);
  return service;
}

/** Deep link to a service's section on the services page. */
export function serviceHref(id: ServiceId): string {
  return `${routes.services}#${getService(id).anchor}`;
}
