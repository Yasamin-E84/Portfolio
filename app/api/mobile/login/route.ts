import { adminCredentials, verifyPassword } from "@/lib/admin-auth";
import { readJson, recordAudit } from "@/lib/admin-api";
import { getBoundDatabase } from "@/lib/db";
import { hashMobileToken, newMobileToken } from "@/lib/mobile-auth";

export async function POST(request: Request) {
  const input = await readJson<{email?:string;password?:string;deviceName?:string}>(request, 20_000);
  const email = input?.email?.trim().toLowerCase() || "";
  const password = input?.password || "";
  const deviceName = input?.deviceName?.trim().slice(0, 80) || "Android phone";
  const db = await getBoundDatabase();
  if (!db) return Response.json({ error: "Login is not configured" }, { status: 503 });
  const forwarded = request.headers.get("cf-connecting-ip") || "unknown";
  const ipHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(forwarded)))).map(x=>x.toString(16).padStart(2,"0")).join("");
  const now = Math.floor(Date.now()/1000), cutoff = now - 900;
  await db.prepare("DELETE FROM admin_login_attempts WHERE created_at < ?").bind(cutoff).run();
  const attempts = await db.prepare("SELECT count(*) AS count FROM admin_login_attempts WHERE ip_hash=? AND created_at>=?").bind(ipHash, cutoff).first<{count:number}>();
  if ((attempts?.count || 0) >= 5) return Response.json({ error:"Too many attempts. Try again later." }, { status:429, headers:{"Retry-After":"900"} });
  const credentials = await adminCredentials();
  const valid = email === credentials.email && password.length <= 256 && await verifyPassword(password, credentials.passwordHash);
  if (!valid) {
    await db.prepare("INSERT INTO admin_login_attempts (id,ip_hash,created_at) VALUES (?,?,?)").bind(crypto.randomUUID(),ipHash,now).run();
    return Response.json({ error:"Email or password is incorrect" }, { status:401 });
  }
  await db.prepare("DELETE FROM admin_login_attempts WHERE ip_hash=?").bind(ipHash).run();
  await db.prepare("DELETE FROM admin_mobile_tokens WHERE expires_at<? OR revoked_at IS NOT NULL").bind(now).run();
  const token = newMobileToken();
  const expiresAt = now + 90 * 86400;
  await db.prepare("INSERT INTO admin_mobile_tokens (id,token_hash,device_name,created_at,last_seen,expires_at,revoked_at) VALUES (?,?,?,?,?,?,NULL)").bind(crypto.randomUUID(),await hashMobileToken(token),deviceName,now,now,expiresAt).run();
  await recordAudit(db,"mobile.login",deviceName);
  return Response.json({ token, expiresAt, serverTime:now }, { headers:{"Cache-Control":"no-store"} });
}
