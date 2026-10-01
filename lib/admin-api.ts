import { getBoundDatabase, type SqlDatabase } from "./db";
import { readSession } from "./admin-auth";

export async function requireAdmin(request: Request) {
  const session = await readSession(request);
  if (!session) return { response: Response.json({ error:"Unauthorized" }, { status:401 }) };
  const db = await getBoundDatabase();
  if (!db) return { response: Response.json({ error:"Storage unavailable" }, { status:503 }) };
  return { session, db };
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function readJson<T>(request: Request, max = 500_000): Promise<T | null> {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > max) return null;
  const text = await request.text();
  if (text.length > max) return null;
  try { return JSON.parse(text) as T; } catch { return null; }
}

export async function recordAudit(db: SqlDatabase, action: string, detail = "") {
  await db.prepare("INSERT INTO admin_audit (id, action, detail, created_at) VALUES (?, ?, ?, ?)")
    .bind(crypto.randomUUID(), action, detail.slice(0,500), Math.floor(Date.now()/1000)).run();
}
