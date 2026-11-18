import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SiteLayout } from "@/components/site-layout";

export const metadata: Metadata = pageMetadata("en");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="en">{children}</SiteLayout>;
}
