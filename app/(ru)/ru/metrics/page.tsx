import { MetricsPage } from "@/components/catalog/metrics-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("ru", { slug: "metrics", title: "Метрики платформы", description: "Интерактивные графики задержки, конверсии и удержания." });

export default function Page() {
  return <MetricsPage lang="ru" />;
}
