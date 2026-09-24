import { z } from "zod";

export type ContactLocale = "en" | "fa";
export const MAX_BODY_BYTES = 8192;
export const RATE_WINDOW_SECONDS = 15 * 60;
export const CONTACT_LIMIT = 5;

const copy = {
  en: {
    invalid: "Please check the highlighted fields.",
    name: "Enter your name (2–100 characters).",
    email: "Enter a valid email address (up to 254 characters).",
    message: "Write a message between 20 and 4,000 characters.",
    locale: "Choose English or Persian.",
    forbidden:
      "This request could not be accepted. Please use the form on this website.",
    malformed: "The request could not be read. Please try again.",
    tooLarge: "Your message is too large. Please shorten it.",
    limited: "You have sent several messages. Please try again in 15 minutes.",
    unavailable:
      "The form is temporarily unavailable. Please email foryxolabels@gmail.com.",
    saved: "Your message was saved privately for Yasamin to review. Thank you!",
  },
  fa: {
    invalid: "لطفاً فیلدهای مشخص‌شده را بررسی کنید.",
    name: "نام خود را بین ۲ تا ۱۰۰ نویسه وارد کنید.",
    email: "یک ایمیل معتبر با حداکثر ۲۵۴ نویسه وارد کنید.",
    message: "پیام خود را بین ۲۰ تا ۴۰۰۰ نویسه بنویسید.",
    locale: "زبان فارسی یا انگلیسی را انتخاب کنید.",
    forbidden:
      "این درخواست پذیرفته نشد. لطفاً از فرم همین وب‌سایت استفاده کنید.",
    malformed: "خواندن درخواست ممکن نشد. لطفاً دوباره تلاش کنید.",
    tooLarge: "حجم پیام بیش از حد مجاز است. لطفاً آن را کوتاه‌تر کنید.",
    limited: "چند پیام ارسال کرده‌اید. لطفاً ۱۵ دقیقه دیگر دوباره تلاش کنید.",
    unavailable:
      "فرم موقتاً در دسترس نیست. لطفاً به foryxolabels@gmail.com ایمیل بزنید.",
    saved: "پیام شما برای بررسی یاسمین به‌صورت خصوصی ذخیره شد. سپاسگزارم!",
  },
} as const;

export function contactSchema(locale: ContactLocale) {
  const t = copy[locale];
  return z
    .object({
      name: z.string({ error: t.name }).trim().min(2, t.name).max(100, t.name),
      email: z
        .string({ error: t.email })
        .trim()
        .max(254, t.email)
        .email(t.email),
      message: z
        .string({ error: t.message })
        .trim()
        .min(20, t.message)
        .max(4000, t.message),
      locale: z.enum(["en", "fa"], { error: t.locale }),
      website: z.string().max(200).optional().default(""),
    })
    .strict();
}
export type ContactInput = z.infer<ReturnType<typeof contactSchema>>;

export class RequestProblem extends Error {
  constructor(
    public status: number,
    public code: "forbidden" | "malformed" | "tooLarge",
  ) {
    super(code);
  }
}

export function requestLocale(request: Request): ContactLocale {
  return request.headers.get("accept-language")?.toLowerCase().startsWith("fa")
    ? "fa"
    : "en";
}

export function assertSameOrigin(
  request: Request,
  trustedOrigin = new URL(request.url).origin,
) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    !trustedOrigin ||
    origin !== trustedOrigin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new RequestProblem(403, "forbidden");
  }
}

/** Enforces the cap while streaming, including requests without Content-Length. */
export async function readLimitedJson(
  request: Request,
  limit = MAX_BODY_BYTES,
): Promise<unknown> {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    throw new RequestProblem(415, "malformed");
  }
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > limit)
    throw new RequestProblem(413, "tooLarge");
  if (!request.body) throw new RequestProblem(400, "malformed");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new RequestProblem(413, "tooLarge");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    if (error instanceof RequestProblem) throw error;
    throw new RequestProblem(400, "malformed");
  } finally {
    reader.releaseLock();
  }
}

export function jsonResponse(
  body: unknown,
  status = 200,
  headers: HeadersInit = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function hashRateKey(ip: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(salt),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(ip),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export interface ContactStore {
  reserveContact(key: string, now: number): Promise<boolean>;
  saveContact(id: string, input: ContactInput, now: number): Promise<void>;
}
export interface ContactServices {
  store: ContactStore;
  salt: string;
}

export async function handleContact(
  request: Request,
  resolveServices: () => Promise<ContactServices | null>,
  trustedOrigin?: string,
) {
  let locale = requestLocale(request);
  try {
    assertSameOrigin(request, trustedOrigin);
    const body = await readLimitedJson(request);
    if (
      body &&
      typeof body === "object" &&
      "locale" in body &&
      body.locale === "fa"
    )
      locale = "fa";
    const result = contactSchema(locale).safeParse(body);
    if (!result.success) {
      return jsonResponse(
        {
          success: false,
          code: "validation",
          message: copy[locale].invalid,
          fieldErrors: z.flattenError(result.error).fieldErrors,
        },
        422,
      );
    }
    if (result.data.website.trim()) {
      return jsonResponse(
        { success: false, code: "forbidden", message: copy[locale].forbidden },
        400,
      );
    }
    const services = await resolveServices();
    if (!services || services.salt.length < 32) {
      return jsonResponse(
        {
          success: false,
          code: "unavailable",
          message: copy[locale].unavailable,
        },
        503,
      );
    }
    // Cloudflare supplies this header at the trusted edge. Never trust X-Forwarded-For.
    // Missing edge identity shares one conservative bucket, instead of bypassing limits.
    const key = await hashRateKey(
      request.headers.get("cf-connecting-ip") || "unidentified-client",
      services.salt,
    );
    const now = Math.floor(Date.now() / 1000);
    if (!(await services.store.reserveContact(key, now))) {
      return jsonResponse(
        { success: false, code: "rate_limited", message: copy[locale].limited },
        429,
        { "Retry-After": String(RATE_WINDOW_SECONDS) },
      );
    }
    const id = crypto.randomUUID();
    await services.store.saveContact(id, result.data, now);
    return jsonResponse(
      { success: true, status: "saved", id, message: copy[locale].saved },
      201,
    );
  } catch (error) {
    if (error instanceof RequestProblem) {
      return jsonResponse(
        { success: false, code: error.code, message: copy[locale][error.code] },
        error.status,
      );
    }
    // Do not log message content, email, identifiers, or provider errors.
    return jsonResponse(
      {
        success: false,
        code: "unavailable",
        message: copy[locale].unavailable,
      },
      503,
    );
  }
}

export const analyticsSchema = z
  .object({
    consent: z.literal(true),
    locale: z.enum(["en", "fa"]),
    path: z.enum([
      "/en",
      "/fa",
      "/en/privacy",
      "/fa/privacy",
      "/en/works",
      "/fa/works",
      "/en/about",
      "/fa/about",
      "/en/terms",
      "/fa/terms",
      "/en/thank-you",
      "/fa/thank-you",
    ]),
  })
  .strict()
  .refine((data) => data.path.startsWith(`/${data.locale}`), {
    message: "Locale and path must match.",
  });

export interface AnalyticsStore {
  recordView(
    day: string,
    path: string,
    locale: string,
    now: number,
  ): Promise<boolean>;
}
export async function handleAnalytics(
  request: Request,
  resolveStore: () => Promise<AnalyticsStore | null>,
  trustedOrigin?: string,
) {
  try {
    assertSameOrigin(request, trustedOrigin);
    const parsed = analyticsSchema.safeParse(
      await readLimitedJson(request, 512),
    );
    if (!parsed.success)
      return jsonResponse({ success: false, code: "invalid_event" }, 400);
    const store = await resolveStore();
    if (!store)
      return jsonResponse({ success: false, code: "unavailable" }, 503);
    const now = Math.floor(Date.now() / 1000);
    const counted = await store.recordView(
      new Date(now * 1000).toISOString().slice(0, 10),
      parsed.data.path,
      parsed.data.locale,
      now,
    );
    return counted
      ? new Response(null, {
          status: 204,
          headers: { "Cache-Control": "no-store" },
        })
      : jsonResponse({ success: false, code: "rate_limited" }, 429, {
          "Retry-After": "60",
        });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        code: error instanceof RequestProblem ? error.code : "unavailable",
      },
      error instanceof RequestProblem ? error.status : 503,
    );
  }
}
