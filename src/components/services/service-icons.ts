import { Building2, CodeXml, Monitor, ShoppingBag, type LucideIcon } from "lucide-react";
import type { ServiceId } from "@/config/services";

/** One icon per service, shared by the home page, services page and about page. */
export const serviceIcons: Record<ServiceId, LucideIcon> = {
  presentation: Monitor,
  business: Building2,
  ecommerce: ShoppingBag,
  platform: CodeXml,
};
