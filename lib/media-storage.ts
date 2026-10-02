import { getCloudflareEnv } from "@/lib/db";

export interface MediaObject {
  readonly body?: ReadableStream<Uint8Array>;
  readonly size: number;
  readonly httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

export interface MediaBucket {
  put(
    key: string,
    value: ReadableStream<Uint8Array>,
    options: {
      httpMetadata: {
        contentType: string;
        contentDisposition: string;
        cacheControl: string;
      };
      customMetadata: Record<string, string>;
    },
  ): Promise<MediaObject | null>;
  get(key: string, options?: { range?: { offset: number; length: number } }): Promise<MediaObject | null>;
  head(key: string): Promise<MediaObject | null>;
}

export async function getMediaBucket() {
  const env = await getCloudflareEnv();
  const candidate = env?.MEDIA as MediaBucket | undefined;
  return candidate && typeof candidate.put === "function" && typeof candidate.get === "function" ? candidate : undefined;
}
