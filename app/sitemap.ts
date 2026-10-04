import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";
import { listPublications } from "@/content-engine/repository";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await listPublications();
  const pages = ["en", "fa"].flatMap((locale) =>
    ["", "/works", "/journal", "/about", "/privacy", "/terms"].map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path ? 0.3 : 1,
      alternates: {
        languages: { en: `${siteUrl}/en${path}`, fa: `${siteUrl}/fa${path}` },
      },
    }))
  );
  const articles = ["en", "fa"].flatMap((locale) => entries.map((entry) => ({
    url: `${siteUrl}/${locale}/journal/${entry.slug}`,
    lastModified: new Date(entry.updatedAt * 1000),
    changeFrequency: "weekly" as const,
    priority: entry.featured ? 0.8 : 0.65,
    alternates: { languages: { en: `${siteUrl}/en/journal/${entry.slug}`, fa: `${siteUrl}/fa/journal/${entry.slug}` } },
  })));
  return [...pages, ...articles];
}
