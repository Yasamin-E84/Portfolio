import { getBoundDatabase } from "./db";

const encoder = new TextEncoder();

function base64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function hashMobileToken(token: string) {
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(token))));
}

export function newMobileToken() {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function requireMobile(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9_-]{40,100})$/)?.[1];
  const db = await getBoundDatabase();
  if (!token || !db) return { response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  const now = Math.floor(Date.now() / 1000);
  const tokenHash = await hashMobileToken(token);
  const device = await db.prepare("SELECT id,device_name AS deviceName FROM admin_mobile_tokens WHERE token_hash=? AND revoked_at IS NULL AND expires_at>?").bind(tokenHash, now).first<{id:string;deviceName:string}>();
  if (!device) return { response: Response.json({ error: "Your app session expired. Sign in again." }, { status: 401 }) };
  await db.prepare("UPDATE admin_mobile_tokens SET last_seen=? WHERE id=?").bind(now, device.id).run();
  return { db, device, tokenHash };
}
