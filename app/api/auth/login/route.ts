import { adminCredentials, createSession, sessionCookie, verifyPassword } from "@/lib/admin-auth";
import { getBoundDatabase } from "@/lib/db";
import { readJson, sameOrigin } from "@/lib/admin-api";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error:"Invalid request" }, { status:403 });
  const input = await readJson<{email?:string,password?:string}>(request, 20_000);
  const email = input?.email?.trim().toLowerCase() || "";
  const password = input?.password || "";
  const db = await getBoundDatabase();
  if (!db) return Response.json({ error:"Login is not configured" }, { status:503 });
  const forwarded = request.headers.get("cf-connecting-ip") || "unknown";
  const ipHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(forwarded)))).map(x=>x.toString(16).padStart(2,"0")).join("");
  const now = Math.floor(Date.now()/1000), cutoff = now - 900;
  await db.prepare("DELETE FROM admin_login_attempts WHERE created_at < ?").bind(cutoff).run();
  const attempts = await db.prepare("SELECT count(*) AS count FROM admin_login_attempts WHERE ip_hash = ? AND created_at >= ?").bind(ipHash, cutoff).first<{count:number}>();
  if ((attempts?.count || 0) >= 5) return Response.json({ error:"Too many attempts. Try again later." }, { status:429, headers:{"Retry-After":"900"} });
  const credentials = await adminCredentials();
  const valid = email === credentials.email && password.length <= 256 && await verifyPassword(password, credentials.passwordHash);
  if (!valid) {
    await db.prepare("INSERT INTO admin_login_attempts (id, ip_hash, created_at) VALUES (?, ?, ?)").bind(crypto.randomUUID(), ipHash, now).run();
    return Response.json({ error:"Email or password is incorrect" }, { status:401 });
  }
  await db.prepare("DELETE FROM admin_login_attempts WHERE ip_hash = ?").bind(ipHash).run();
  const token = await createSession(credentials.email);
  return Response.json({ ok:true }, { headers:{ "Set-Cookie":sessionCookie(token, request), "Cache-Control":"no-store" } });
}
