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

export async function GET(request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const store = await getMediaBucket();
  if (!store) return new Response("Media storage is unavailable", { status: 503 });
  const key = safeKey((await params).key);
  if (!key) return new Response("Not found", { status: 404 });

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

export async function HEAD(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const store = await getMediaBucket();
  const key = safeKey((await params).key);
  if (!store || !key) return new Response(null, { status: 404 });
  const object = await store.head(key);
  if (!object) return new Response(null, { status: 404 });
  const headers = responseHeaders(object);
  headers.set("content-length", String(object.size));
  return new Response(null, { headers });
}
