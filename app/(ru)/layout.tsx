import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";

const title = "Takt — библиотека motion-компонентов";
const description = "Интерактивные компоненты для React, Tailwind CSS и Motion. Установка через shadcn или ИИ-агента.";
export const metadata: Metadata = {
  title, description,
  openGraph: { title, description, type: "website", locale: "ru_RU" },
  twitter: { card: "summary", title, description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="ru">{children}</SiteLayout>;
}
