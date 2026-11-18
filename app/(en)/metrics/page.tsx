import { MetricsPage } from "@/generated/en/components/catalog/metrics-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", { slug: "metrics", title: "Platform metrics", description: "Interactive charts for latency, conversion and cohort retention." });

export default function Page() {
  return <MetricsPage lang="en" />;
}
