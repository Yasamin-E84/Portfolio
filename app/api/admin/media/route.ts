import { requireAdmin, recordAudit, sameOrigin } from "@/lib/admin-api";
import { getMediaBucket } from "@/lib/media-storage";

const limits = {
  image: 15 * 1024 * 1024,
  video: 95 * 1024 * 1024,
  file: 95 * 1024 * 1024,
} as const;

const mimeExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "application/pdf": "pdf",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
};

function allowed(type: string, kind: keyof typeof limits) {
  if (kind === "image") return type.startsWith("image/");
  if (kind === "video") return type === "video/mp4" || type === "video/webm";
  return type === "application/pdf" || type === "application/zip" || type === "application/x-zip-compressed";
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request" }, { status: 403 });
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const kindHeader = request.headers.get("x-media-kind");
  const kind = kindHeader === "image" || kindHeader === "video" || kindHeader === "file" ? kindHeader : null;
  const type = request.headers.get("content-type")?.split(";")[0].toLowerCase() || "";
  const size = Number(request.headers.get("x-file-size") || request.headers.get("content-length"));
  if (!kind || !allowed(type, kind) || !mimeExtensions[type]) return Response.json({ error: "Choose a supported file type" }, { status: 415 });
  if (!Number.isFinite(size) || size <= 0 || size > limits[kind]) return Response.json({ error: `The file must be smaller than ${Math.floor(limits[kind] / 1024 / 1024)} MB` }, { status: 413 });
  if (!request.body) return Response.json({ error: "The file is empty" }, { status: 400 });

  const bucket = await getMediaBucket();
  if (!bucket) return Response.json({ error: "Media storage is not enabled yet" }, { status: 503 });

  const original = (request.headers.get("x-file-name") || "upload").slice(0, 180);
  const base = original.replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "upload";
  const date = new Date();
  const key = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${kind}/${crypto.randomUUID()}-${base}.${mimeExtensions[type]}`;
  const disposition = kind === "file" ? `attachment; filename="${base}.${mimeExtensions[type]}"` : "inline";

  try {
    await bucket.put(key, request.body, {
      httpMetadata: {
        contentType: type,
        contentDisposition: disposition,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: { originalName: original, uploadedBy: auth.session.email },
    });
    await recordAudit(auth.db, "media.upload", `${kind}:${key}`);
    return Response.json({
      ok: true,
      key,
      url: new URL(`/api/media/${key}`, request.url).toString(),
      name: original,
      size,
      type,
    }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(JSON.stringify({ event: "media_upload_failed", message: error instanceof Error ? error.message : "unknown" }));
    return Response.json({ error: "The upload could not be saved" }, { status: 503 });
  }
}
