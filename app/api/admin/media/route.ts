import { requireAdmin, recordAudit, sameOrigin } from "@/lib/admin-api";
import { getMediaBucket } from "@/lib/media-storage";
import { getBoundDatabase } from "@/lib/db";

const limits = {
  image: 15 * 1024 * 1024,
  video: 95 * 1024 * 1024,
  file: 95 * 1024 * 1024,
} as const;
const d1ImageLimit = 1_500_000;

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

  const original = (request.headers.get("x-file-name") || "upload").slice(0, 180);
  const base = original.replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "upload";
  const date = new Date();
  const key = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${kind}/${crypto.randomUUID()}-${base}.${mimeExtensions[type]}`;
  const disposition = kind === "file" ? `attachment; filename="${base}.${mimeExtensions[type]}"` : "inline";

  try {
    let savedKey = key;
    if (bucket) {
      await bucket.put(key, request.body, {
        httpMetadata: {
          contentType: type,
          contentDisposition: disposition,
          cacheControl: "public, max-age=31536000, immutable",
        },
        customMetadata: { originalName: original, uploadedBy: auth.session.email },
      });
    } else {
      if (kind !== "image") return Response.json({ error: "Large file storage needs Cloudflare R2. Images can be uploaded now; paste a hosted URL for videos or files." }, { status: 503 });
      if (size > d1ImageLimit) return Response.json({ error: "This image is still too large. Choose an image under 1.5 MB; the admin normally optimizes it automatically." }, { status: 413 });
      const db = await getBoundDatabase();
      if (!db) return Response.json({ error: "Image storage is temporarily unavailable" }, { status: 503 });
      const bytes = await request.arrayBuffer();
      if (bytes.byteLength !== size || bytes.byteLength > d1ImageLimit) return Response.json({ error: "The uploaded image size could not be verified" }, { status: 400 });
      savedKey = `d1/${crypto.randomUUID()}-${base}.${mimeExtensions[type]}`;
      await db.prepare("INSERT INTO portfolio_media (key,name,content_type,size,bytes,created_at) VALUES (?,?,?,?,?,?)")
        .bind(savedKey, original, type, bytes.byteLength, new Uint8Array(bytes), Math.floor(Date.now() / 1000)).run();
    }
    await recordAudit(auth.db, "media.upload", `${kind}:${savedKey}`);
    return Response.json({
      ok: true,
      key: savedKey,
      url: new URL(`/api/media/${savedKey}`, request.url).toString(),
      name: original,
      size,
      type,
    }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(JSON.stringify({ event: "media_upload_failed", message: error instanceof Error ? error.message : "unknown" }));
    return Response.json({ error: "The upload could not be saved" }, { status: 503 });
  }
}
