import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["en", "fa"].flatMap((locale) =>
    ["", "/works", "/about", "/privacy", "/terms"].map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path ? 0.3 : 1,
      alternates: {
        languages: { en: `${siteUrl}/en${path}`, fa: `${siteUrl}/fa${path}` },
      },
    })),
  );
}
