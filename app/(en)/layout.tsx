import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";

const title = "Takt — Motion components for Next.js";
const description = "Explore, install and adapt 84 motion components for React and Tailwind CSS with shadcn or your coding agent.";
export const metadata: Metadata = {
  title, description,
  openGraph: { title, description, type: "website", locale: "en_US" },
  twitter: { card: "summary", title, description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="en">{children}</SiteLayout>;
}
