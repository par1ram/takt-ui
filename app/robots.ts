import type { MetadataRoute } from "next";
import { isPreview, siteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return isPreview ? { rules: { userAgent: "*", disallow: "/" } } : {
    rules: { userAgent: "*", allow: "/" },
    sitemap: siteOrigin + "/sitemap.xml",
  };
}
