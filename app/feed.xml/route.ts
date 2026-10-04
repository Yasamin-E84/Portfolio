import { listPublications } from "@/content-engine/repository";
import { siteUrl } from "@/lib/content";

export const dynamic = "force-static";
const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
export async function GET() {
  const items = await listPublications();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Yasamin Soraghi — Technology Field Notes</title><link>${siteUrl}/en/journal</link><description>Frontend, AI, technology and project notes by Yasamin Soraghi.</description><language>en</language>${items.map(item=>`<item><title>${escapeXml(item.title.en)}</title><link>${siteUrl}/en/journal/${item.slug}</link><guid>${siteUrl}/en/journal/${item.slug}</guid><pubDate>${new Date(item.publishDate).toUTCString()}</pubDate><description>${escapeXml(item.shortDescription.en)}</description><category>${item.category}</category></item>`).join("")}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
