"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { copy, type Locale } from "@/lib/content";
export function Consent({ locale }: { locale: Locale }) {
  const [choice, setChoice] = useState<string | null | undefined>(undefined),
    [open, setOpen] = useState(false),
    pathname = usePathname(),
    c = copy[locale];
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("ys-analytics");
        setChoice(saved);
        setOpen(!saved);
      } catch {
        setChoice(null);
        setOpen(true);
      }
    }, 2000);
    function show() {
      setOpen(true);
    }
    window.addEventListener("ys-consent", show);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("ys-consent", show);
    };
  }, []);
  useEffect(() => {
    if (
      choice !== "yes" ||
      !/^\/(en|fa)(\/(works|about|privacy|terms|thank-you))?$/.test(pathname)
    )
      return;
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent: true, locale, path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [choice, locale, pathname]);
  function choose(value: string) {
    try {
      localStorage.setItem("ys-analytics", value);
    } catch {}
    setChoice(value);
    setOpen(false);
  }
  if (!open) return null;
  return (
    <aside className="cookie-note" aria-labelledby="cookie-title">
      <span className="paper-pin" aria-hidden="true" />
      <button
        className="cookie-close"
        onClick={() => {
          if (choice) setOpen(false);
          else choose("no");
        }}
        aria-label={c.close}
      >
        ×
      </button>
      <h2 id="cookie-title">{c.cookieTitle}</h2>
      <p>
        {c.cookieText} <Link href={`/${locale}/privacy`}>{c.privacy}</Link>
      </p>
      <div>
        <button onClick={() => choose("yes")} className="small-button">
          {c.accept}
        </button>
        <button onClick={() => choose("no")} className="text-button">
          {c.reject}
        </button>
      </div>
    </aside>
  );
}
export function CookiePreferences({ locale }: { locale: Locale }) {
  return (
    <button
      className="text-button"
      onClick={() => window.dispatchEvent(new Event("ys-consent"))}
    >
      {copy[locale].cookieSettings}
    </button>
  );
}
