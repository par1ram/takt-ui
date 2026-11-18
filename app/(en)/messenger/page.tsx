import { MessengerPage } from "@/generated/en/components/catalog/messenger-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", { slug: "messenger", title: "Course Messenger", description: "A workspace for course channels, direct messages and threads." });

export default function Page() {
  return <MessengerPage lang="en" />;
}
