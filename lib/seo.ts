import type { Metadata } from "next";
import { publishedOrigin as siteOrigin } from "@/lib/registry-origin";
import { entries } from "@/lib/catalog";
import { entries as englishEntries } from "@/generated/en/lib/catalog";

export type Locale = "en" | "ru";
export { siteOrigin };
export const catalogs = { en: englishEntries, ru: entries };
export const isPreview = process.env.VERCEL_ENV === "preview";

export function pagePath(lang: Locale, slug?: string) {
  const prefix = lang === "ru" ? "/ru" : "";
  if (slug === "messenger" || slug === "metrics") return prefix + "/" + slug;
  return slug ? prefix + "/components/" + slug : prefix || "/";
}

export function languages(slug?: string) {
  const en = siteOrigin + pagePath("en", slug);
  return { en, ru: siteOrigin + pagePath("ru", slug), "x-default": en };
}

export function pageMetadata(lang: Locale, item?: { title: string; slug: string; description: string }): Metadata {
  const en = lang === "en";
  const title = item ? item.title + (en ? " for React & Next.js | Takt" : " для React и Next.js | Takt") :
    en ? "Takt — Motion Components for React and Next.js" : "Takt — Motion-компоненты для React и Next.js";
  const description = item?.description ?? (en
    ? `Explore ${catalogs.en.length} interactive React components for Next.js and Tailwind CSS. Try live demos, inspect the source and install with shadcn or your coding agent.`
    : `Библиотека интерактивных компонентов для Next.js и Tailwind CSS. Попробуйте демо, изучите исходный код и установите нужный компонент через shadcn или своего ИИ-агента.`);
  const url = siteOrigin + pagePath(lang, item?.slug);
  const image = { url: siteOrigin + "/share/" + lang + ".png", width: 1200, height: 630,
    alt: en ? "Takt component library for React and Next.js" : "Библиотека компонентов Takt для React и Next.js" };
  return {
    metadataBase: new URL(siteOrigin), title, description,
    alternates: { canonical: url, languages: languages(item?.slug) },
    robots: { index: !isPreview, follow: true },
    openGraph: { title, description, url, type: "website", siteName: "Takt",
      locale: en ? "en_US" : "ru_RU", alternateLocale: en ? "ru_RU" : "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
