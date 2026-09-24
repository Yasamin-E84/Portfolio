import {
  CONTACT_LIMIT,
  RATE_WINDOW_SECONDS,
  type AnalyticsStore,
  type ContactInput,
  type ContactStore,
} from "./contact";
import { siteUrl } from "./content";

/** Minimal structural D1 boundary; deployment may supply generated CloudflareEnv. */
export interface SqlStatement {
  bind(...values: (string | number | null)[]): SqlStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface SqlDatabase {
  prepare(sql: string): SqlStatement;
}

export function normalizeTrustedOrigin(value: unknown): string {
  if (typeof value !== "string") return "";
  try {
    const url = new URL(value);
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
      url.username ||
      url.password ||
      (url.protocol !== "https:" && !(loopback && url.protocol === "http:"))
    )
      return "";
    return url.origin;
  } catch {
    return "";
  }
}

/** OpenNext can reconstruct an internal host/protocol, so trust deployment configuration only. */
export async function getTrustedOrigin(): Promise<string> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const configured: unknown = Reflect.get(env, "NEXT_PUBLIC_SITE_URL");
    if (configured !== undefined) return normalizeTrustedOrigin(configured);
  } catch {
    /* Plain Next development has no Worker context. */
  }
  return normalizeTrustedOrigin(
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : siteUrl,
  );
}

export const reserveContactSql = `INSERT INTO contact_rate_events (id, rate_key, created_at)
  SELECT ?, ?, ? WHERE (SELECT count(*) FROM contact_rate_events WHERE rate_key = ? AND created_at > ?) < ?
  RETURNING id`;

export const recordViewSql = `INSERT INTO analytics_daily (day, path, locale, views, minute_start, minute_views)
  VALUES (?, ?, ?, 1, ?, 1)
  ON CONFLICT(day, path, locale) DO UPDATE SET
    views = analytics_daily.views + 1,
    minute_views = CASE WHEN analytics_daily.minute_start <= ? THEN 1 ELSE analytics_daily.minute_views + 1 END,
    minute_start = CASE WHEN analytics_daily.minute_start <= ? THEN ? ELSE analytics_daily.minute_start END
  WHERE analytics_daily.views < 20000 AND (analytics_daily.minute_start <= ? OR analytics_daily.minute_views < 120)
  RETURNING views`;

export function createStore(db: SqlDatabase): ContactStore & AnalyticsStore {
  return {
    async reserveContact(key, now) {
      await db
        .prepare("DELETE FROM contact_rate_events WHERE created_at <= ?")
        .bind(now - RATE_WINDOW_SECONDS)
        .run();
      // One atomic SQL statement counts and inserts: parallel Workers cannot exceed the limit.
      const row = await db
        .prepare(reserveContactSql)
        .bind(
          crypto.randomUUID(),
          key,
          now,
          key,
          now - RATE_WINDOW_SECONDS,
          CONTACT_LIMIT,
        )
        .first();
      return row !== null;
    },
    async saveContact(id: string, input: ContactInput, now: number) {
      await db
        .prepare("DELETE FROM contact_messages WHERE created_at < ?")
        .bind(now - 90 * 86400)
        .run();
      await db
        .prepare(
          "INSERT INTO contact_messages (id, name, email, message, locale, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        )
        .bind(id, input.name, input.email, input.message, input.locale, now)
        .run();
    },
    async recordView(day, path, locale, now) {
      const cutoff = new Date((now - 365 * 86400) * 1000)
        .toISOString()
        .slice(0, 10);
      await db
        .prepare("DELETE FROM analytics_daily WHERE day < ?")
        .bind(cutoff)
        .run();
      const row = await db
        .prepare(recordViewSql)
        .bind(day, path, locale, now, now - 60, now - 60, now, now - 60)
        .first();
      return row !== null;
    },
  };
}

export async function getDatabaseServices() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    // Runtime validation keeps plain Next development honest when a binding is absent.
    const db: unknown = Reflect.get(env, "DB");
    if (
      !db ||
      typeof db !== "object" ||
      !("prepare" in db) ||
      typeof db.prepare !== "function"
    )
      return null;
    const configuredSalt: unknown = Reflect.get(env, "CONTACT_RATE_SALT");
    const salt = typeof configuredSalt === "string" ? configuredSalt : "";
    return { store: createStore(db as SqlDatabase), salt };
  } catch {
    return null;
  }
}
