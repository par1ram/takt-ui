import type { MetadataRoute } from "next";
import { catalogs, languages, pagePath, siteOrigin } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = [undefined, "messenger", "metrics", ...catalogs.en.map((item) => item.slug)];
  return slugs.flatMap((slug) => (["en", "ru"] as const).map((lang) => ({
    url: siteOrigin + pagePath(lang, slug),
    alternates: { languages: languages(slug) },
  })));
}
