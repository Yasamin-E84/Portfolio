import { getBoundDatabase } from "@/lib/db";
import { getMediaBucket, type MediaObject } from "@/lib/media-storage";

function safeKey(parts: string[]) {
  const key = parts.join("/");
  return key.length <= 900 && parts.every(part => part && part !== "." && part !== "..") ? key : "";
}

function responseHeaders(object: MediaObject) {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-content-type-options", "nosniff");
  return headers;
}

type DatabaseMedia = {
  bytes: ArrayBuffer | Uint8Array | number[];
  contentType: string;
  size: number;
};

async function getDatabaseMedia(key: string) {
  const db = await getBoundDatabase();
  return db?.prepare("SELECT bytes,content_type AS contentType,size FROM portfolio_media WHERE key=?")
    .bind(key).first<DatabaseMedia>() || null;
}

function mediaBytes(value: DatabaseMedia["bytes"]) {
  if (value instanceof Uint8Array) return Uint8Array.from(value);
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  return Uint8Array.from(value);
}

function databaseHeaders(media: DatabaseMedia) {
  return new Headers({
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=31536000, immutable",
    "content-type": media.contentType,
    "x-content-type-options": "nosniff",
  });
}

function databaseResponse(request: Request, media: DatabaseMedia, head = false) {
  const bytes = mediaBytes(media.bytes);
  const headers = databaseHeaders(media);
  const match = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (match && !head) {
    const start = match[1] ? Number(match[1]) : Math.max(0, bytes.length - Number(match[2] || 0));
    let end = match[2] && match[1] ? Number(match[2]) : bytes.length - 1;
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || start >= bytes.length) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${bytes.length}` } });
    }
    end = Math.min(end, bytes.length - 1);
    const range = Uint8Array.from(bytes.slice(start, end + 1));
    headers.set("content-range", `bytes ${start}-${end}/${bytes.length}`);
    headers.set("content-length", String(range.length));
    return new Response(range.buffer, { status: 206, headers });
  }
  headers.set("content-length", String(bytes.length));
  return new Response(head ? null : bytes.buffer, { headers });
}

export async function GET(request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = safeKey((await params).key);
  if (!key) return new Response("Not found", { status: 404 });

  if (key.startsWith("d1/")) {
    const media = await getDatabaseMedia(key);
    return media ? databaseResponse(request, media) : new Response("Not found", { status: 404 });
  }

  const store = await getMediaBucket();
  if (!store) return new Response("Not found", { status: 404 });
  const head = await store.head(key);
  if (!head) return new Response("Not found", { status: 404 });
  const range = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (range) {
    const start = range[1] ? Number(range[1]) : Math.max(0, head.size - Number(range[2] || 0));
    let end = range[2] && range[1] ? Number(range[2]) : head.size - 1;
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || start >= head.size) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${head.size}` } });
    end = Math.min(end, head.size - 1);
    const object = await store.get(key, { range: { offset: start, length: end - start + 1 } });
    if (!object || !("body" in object)) return new Response("Not found", { status: 404 });
    const headers = responseHeaders(object);
    headers.set("content-range", `bytes ${start}-${end}/${head.size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(object.body, { status: 206, headers });
  }

  const object = await store.get(key);
  if (!object || !("body" in object)) return new Response("Not found", { status: 404 });
  const headers = responseHeaders(object);
  headers.set("content-length", String(object.size));
  return new Response(object.body, { headers });
}

export async function HEAD(request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = safeKey((await params).key);
  if (!key) return new Response(null, { status: 404 });
  if (key.startsWith("d1/")) {
    const media = await getDatabaseMedia(key);
    return media ? databaseResponse(request, media, true) : new Response(null, { status: 404 });
  }
  const store = await getMediaBucket();
  if (!store) return new Response(null, { status: 404 });
  const object = await store.head(key);
  if (!object) return new Response(null, { status: 404 });
  const headers = responseHeaders(object);
  headers.set("content-length", String(object.size));
  return new Response(null, { headers });
}
