import { getBoundDatabase, getCloudflareEnv } from "./db";

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

export async function secureTokenEqual(left: string, right: string) {
  if (!left || !right) return false;
  const [a, b] = await Promise.all([hashMobileToken(left), hashMobileToken(right)]);
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index++) mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return mismatch === 0;
}

export async function requireMobile(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9_-]{40,100})$/)?.[1];
  const db = await getBoundDatabase();
  if (!token || !db) return { response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  const env = await getCloudflareEnv();
  const appKey = typeof env?.MOBILE_APP_KEY === "string" ? env.MOBILE_APP_KEY : "";
  if (appKey && await secureTokenEqual(token, appKey)) {
    return { db, device: { id: "portfolio-alerts-apk", deviceName: "Yasamin's Android phone" }, tokenHash: await hashMobileToken(token) };
  }
  const now = Math.floor(Date.now() / 1000);
  const tokenHash = await hashMobileToken(token);
  const device = await db.prepare("SELECT id,device_name AS deviceName FROM admin_mobile_tokens WHERE token_hash=? AND revoked_at IS NULL AND expires_at>?").bind(tokenHash, now).first<{id:string;deviceName:string}>();
  if (!device) return { response: Response.json({ error: "Your app session expired. Sign in again." }, { status: 401 }) };
  await db.prepare("UPDATE admin_mobile_tokens SET last_seen=? WHERE id=?").bind(now, device.id).run();
  return { db, device, tokenHash };
}
