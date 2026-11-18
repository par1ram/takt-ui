import { MessengerPage } from "@/components/catalog/messenger-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("ru", { slug: "messenger", title: "Мессенджер курса", description: "Рабочее пространство с каналами, личными сообщениями и тредами." });

export default function Page() {
  return <MessengerPage lang="ru" />;
}
