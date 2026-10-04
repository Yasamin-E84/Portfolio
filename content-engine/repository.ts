import { getBoundDatabase, type SqlDatabase } from "@/lib/db";
import { defaultPublications } from "./default-content";
import { isPublicNow, publicationSchema, type Publication } from "./types";

type ListStatement = { all<T>(): Promise<{ results: T[] }> };
type Row = { data: string };

async function rows(db: SqlDatabase, sql: string, ...values: (string | number)[]) {
  return (await (db.prepare(sql).bind(...values) as unknown as ListStatement).all<Row>()).results;
}

function parse(items: Row[]) {
  return items.flatMap(({ data }) => {
    try { const result = publicationSchema.safeParse(JSON.parse(data)); return result.success ? [result.data] : []; }
    catch { return []; }
  });
}

export async function listPublications(options: { includeUnpublished?: boolean; type?: Publication["type"] } = {}) {
  // Build workers run pages concurrently; reading the local D1 emulator there can
  // lock SQLite and would make deploy output depend on a developer's local data.
  const buildTime = process.env.NEXT_PHASE === "phase-production-build" || process.env.NEXT_PUBLIC_STATIC_SITE === "1";
  const db = buildTime ? null : await getBoundDatabase();
  let items = defaultPublications;
  if (db) {
    try {
      const stored = parse(await rows(db, "SELECT data FROM publications ORDER BY updated_at DESC"));
      const tombstones = await rows(db, "SELECT json_object('id',id) AS data FROM publication_tombstones");
      const deleted = new Set(tombstones.flatMap(({data})=>{try{return [String(JSON.parse(data).id)]}catch{return []}}));
      const byId = new Map(defaultPublications.filter((item)=>!deleted.has(item.id)).map((item) => [item.id, item]));
      for (const item of stored) byId.set(item.id, item);
      items = [...byId.values()];
    } catch { /* The migration may not be installed during a preview build. */ }
  }
  return items
    .filter((item) => options.includeUnpublished || isPublicNow(item))
    .filter((item) => !options.type || item.type === options.type)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export async function getPublication(slug: string) {
  return (await listPublications()).find((item) => item.slug === slug) ?? null;
}
