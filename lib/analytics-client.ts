import type { Locale } from "./content";

export type PortfolioEvent = "page_view" | "project_view" | "artwork_view" | "video_view" | "contact_click" | "contact_copy";

function endpoint() {
  return process.env.NEXT_PUBLIC_STATIC_SITE === "1" && process.env.NEXT_PUBLIC_ADMIN_ORIGIN
    ? `${process.env.NEXT_PUBLIC_ADMIN_ORIGIN}/api/analytics`
    : "/api/analytics";
}

function sessionId() {
  try {
    const current = sessionStorage.getItem("ys-analytics-session");
    if (current) return current;
    const next = crypto.randomUUID();
    sessionStorage.setItem("ys-analytics-session", next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

function normalizedPath() {
  const path = window.location.pathname.replace(/^\/Portfolio(?=\/)/, "").replace(/\/$/, "");
  return path || "/en";
}

export function trackPortfolioEvent(event: PortfolioEvent, target: string, locale: Locale) {
  try {
    if (localStorage.getItem("ys-analytics") !== "yes") return;
    void fetch(endpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent: true, locale, path: normalizedPath(), event, target: target.slice(0, 120), sessionId: sessionId() }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
