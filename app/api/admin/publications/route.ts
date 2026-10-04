import { requireAdmin, readJson, recordAudit, sameOrigin } from "@/lib/admin-api";
import { publicationSchema, type Publication } from "@/content-engine/types";
import { revalidatePath } from "next/cache";

type ListStatement = { all<T>(): Promise<{ results: T[] }> };
type Row = { data: string };

function parse(rows: Row[]) {
  return rows.flatMap((row) => {
    try { const result = publicationSchema.safeParse(JSON.parse(row.data)); return result.success ? [result.data] : []; }
    catch { return []; }
  });
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request); if (auth.response) return auth.response;
  try {
    const result = await (auth.db.prepare("SELECT data FROM publications ORDER BY updated_at DESC") as unknown as ListStatement).all<Row>();
    const deleted = await (auth.db.prepare("SELECT id FROM publication_tombstones") as unknown as ListStatement).all<{id:string}>();
    return Response.json({ items: parse(result.results), deletedDefaultIds: deleted.results.map((row)=>row.id) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ items: [], migrationRequired: true }, { headers: { "Cache-Control": "no-store" } }); }
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request" }, { status: 403 });
  const auth = await requireAdmin(request); if (auth.response) return auth.response;
  const input = await readJson<unknown>(request, 250_000);
  const parsed = publicationSchema.safeParse(input);
  if (!parsed.success) return Response.json({ error: "Some publication fields are invalid", issues: parsed.error.issues.slice(0, 5) }, { status: 400 });
  const item = parsed.data;
  const now = Math.floor(Date.now() / 1000);
  const publishAt = item.scheduledFor ? Math.floor(Date.parse(item.scheduledFor) / 1000) : item.publishDate ? Math.floor(Date.parse(item.publishDate) / 1000) : null;
  try {
    await auth.db.prepare("INSERT INTO publications (id,slug,type,status,category,featured,publish_at,data,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,type=excluded.type,status=excluded.status,category=excluded.category,featured=excluded.featured,publish_at=excluded.publish_at,data=excluded.data,updated_at=excluded.updated_at")
      .bind(item.id, item.slug, item.type, item.status, item.category, item.featured ? 1 : 0, publishAt, JSON.stringify({ ...item, updatedAt: now }), item.createdAt || now, now).run();
    await auth.db.prepare("DELETE FROM publication_tombstones WHERE id=?").bind(item.id).run();
    revalidatePublicationRoutes(item.slug);
    await recordAudit(auth.db, "publication.update", `${item.type}:${item.slug}:${item.status}`);
    return Response.json({ ok: true, updatedAt: now });
  } catch (error) {
    const message = error instanceof Error && /unique/i.test(error.message) ? "That slug is already in use" : "The publication could not be saved";
    return Response.json({ error: message }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request" }, { status: 403 });
  const auth = await requireAdmin(request); if (auth.response) return auth.response;
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return Response.json({ error: "Invalid entry" }, { status: 400 });
  await auth.db.prepare("DELETE FROM publications WHERE id=?").bind(id).run();
  await auth.db.prepare("INSERT OR REPLACE INTO publication_tombstones (id,deleted_at) VALUES (?,?)").bind(id,Math.floor(Date.now()/1000)).run();
  revalidatePublicationRoutes();
  await recordAudit(auth.db, "publication.delete", id);
  return Response.json({ ok: true });
}

function revalidatePublicationRoutes(slug?:string){for(const locale of ["en","fa"]){revalidatePath(`/${locale}/journal`);if(slug)revalidatePath(`/${locale}/journal/${slug}`)}revalidatePath("/sitemap.xml");revalidatePath("/feed.xml")}
