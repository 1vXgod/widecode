import { PagePlaceholder, placeholderMetadata } from "@/components/sections/page-placeholder";

export const metadata = placeholderMetadata("about");

export default function Page() {
  return <PagePlaceholder page="about" />;
}
