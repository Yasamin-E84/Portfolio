import { getCloudflareEnv } from "./db";

const enc = new TextEncoder();
const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const fromB64 = (value: string) => Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/")), c => c.charCodeAt(0));

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name:"HMAC", hash:"SHA-256" }, false, ["sign"]);
  return b64(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(value))));
}

function safeEqual(a: string, b: string) {
  const aa = enc.encode(a), bb = enc.encode(b); let diff = aa.length ^ bb.length;
  const length = Math.max(aa.length, bb.length);
  for (let i=0;i<length;i++) diff |= (aa[i % aa.length] || 0) ^ (bb[i % bb.length] || 0);
  return diff === 0;
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, roundsRaw, saltRaw, expected] = encoded.split(":");
  if (algorithm === "sha256" && roundsRaw && !saltRaw) {
    const digest = b64(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(password))));
    return safeEqual(digest, roundsRaw);
  }
  const rounds = Number(roundsRaw);
  if (algorithm !== "pbkdf2" || !Number.isInteger(rounds) || rounds < 210_000 || !saltRaw || !expected) return false;
  const material = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name:"PBKDF2", hash:"SHA-256", salt:fromB64(saltRaw), iterations:rounds }, material, 256);
  return safeEqual(b64(new Uint8Array(bits)), expected);
}

export async function createSession(email: string) {
  const env = await getCloudflareEnv();
  const secret = String(env?.SESSION_SECRET || "");
  if (secret.length < 32) throw new Error("Session secret is unavailable");
  const payload = b64(enc.encode(JSON.stringify({ email, exp: Math.floor(Date.now()/1000) + 60*60*8 })));
  return `${payload}.${await hmac(payload, secret)}`;
}

export async function readSession(request: Request) {
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)ys_admin=([^;]+)/)?.[1];
  if (!cookie) return null;
  const [payload, signature] = cookie.split(".");
  const env = await getCloudflareEnv();
  const secret = String(env?.SESSION_SECRET || "");
  if (!payload || !signature || secret.length < 32 || !safeEqual(await hmac(payload, secret), signature)) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64(payload))) as {email:string;exp:number};
    return data.exp > Date.now()/1000 ? data : null;
  } catch { return null; }
}

export async function adminCredentials() {
  const env = await getCloudflareEnv();
  return { email:String(env?.ADMIN_EMAIL || "").toLowerCase(), passwordHash:String(env?.ADMIN_PASSWORD_HASH || "") };
}

export function sessionCookie(value: string, request: Request, maxAge = 60*60*8) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `ys_admin=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}
