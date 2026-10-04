import { getCloudflareEnv, getBoundDatabase } from "@/lib/db";
import { publicationSchema } from "@/content-engine/types";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const env = await getCloudflareEnv();
  const secret = String(env?.AUTOMATION_WEBHOOK_SECRET || "");
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (secret.length < 32 || supplied !== secret) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getBoundDatabase();
  if (!db) return Response.json({ error: "Storage unavailable" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const candidates = Array.isArray(body?.items) ? body.items : [body];
  let generated = 0;
  const now = Math.floor(Date.now() / 1000);
  for (const candidate of candidates.slice(0, 20)) {
    const parsed = publicationSchema.safeParse({ ...candidate, status: "draft", featured: false, author: "Yasamin Soraghi", createdAt: candidate?.createdAt || now, updatedAt: now });
    if (!parsed.success) continue;
    const item = parsed.data;
    await db.prepare("INSERT INTO publications (id,slug,type,status,category,featured,publish_at,data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,type=excluded.type,status='draft',category=excluded.category,featured=0,data=excluded.data,updated_at=excluded.updated_at")
      .bind(item.id, item.slug, item.type, "draft", item.category, 0, null, JSON.stringify(item), item.createdAt, now).run();
    generated++;
  }
  await db.prepare("INSERT INTO automation_runs (id,workflow,status,generated_count,detail,created_at) VALUES (?,?,?,?,?,?)")
    .bind(crypto.randomUUID(), "daily-tech-news", generated ? "completed" : "failed", generated, generated ? "Drafts received for human review" : "No valid drafts received", now).run();
  revalidatePath("/sitemap.xml"); revalidatePath("/feed.xml");
  return Response.json({ ok: true, generated });
}
