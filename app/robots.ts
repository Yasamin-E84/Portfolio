import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/en/thank-you", "/fa/thank-you"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
