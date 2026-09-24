"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { copy, type Locale } from "@/lib/content";
function subscribe(cb: () => void) {
  window.addEventListener("ys-theme", cb);
  return () => window.removeEventListener("ys-theme", cb);
}
export function Header({
  locale,
  cosmic = false,
}: {
  locale: Locale;
  cosmic?: boolean;
}) {
  const c = copy[locale],
    pathname = usePathname();
  const theme = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme || "light",
    () => "light",
  );
  function toggle() {
    const t = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("ys-theme", t);
    } catch {}
    window.dispatchEvent(new Event("ys-theme"));
  }
  const other = locale === "en" ? "fa" : "en";
  function remember() {
    document.cookie = `ys-locale=${other};path=/;max-age=31536000;SameSite=Lax`;
    try {
      localStorage.setItem("ys-locale", other);
    } catch {}
  }
  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "en" ? "Skip to content" : "رفتن به محتوا"}
      </a>
      <header className={`site-header${cosmic ? " cosmic-header" : ""}`}>
        <Link className="identity" href={`/${locale}`} aria-label={c.name}>
          <img src="/media/ys-logo.png" width="46" height="46" alt="YS" />
          <span>
            Yasamin<span className="identity-surname"> Soraghi</span>
            <small>
              {locale === "en"
                ? "DEVELOPER & VISUAL CREATOR"
                : "توسعه‌دهنده و خالق آثار بصری"}
            </small>
          </span>
        </Link>
        <nav aria-label={locale === "en" ? "Main navigation" : "منوی اصلی"}>
          {[
            `/${locale}`,
            `/${locale}/works`,
            `/${locale}/about`,
            `/${locale}#contact`,
          ].map((href, i) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {c.nav[i]}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <a
            className="locale-switch"
            href={
              /^\/(en|fa)(\/|$)/.test(pathname)
                ? pathname.replace(/^\/(en|fa)/, `/${other}`)
                : `/${other}`
            }
            onClick={(event) => {
              remember();
              event.currentTarget.search = window.location.search;
              event.currentTarget.hash = window.location.hash;
            }}
            lang={other}
          >
            {other === "fa" ? "فا" : "EN"}
            <span aria-hidden="true"> ↗</span>
          </a>
          <button
            className="theme-switch"
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            onClick={toggle}
            aria-label={locale === "en" ? "Dark theme" : "تم تیره"}
          >
            <img
              className="theme-day"
              src="/media/theme/lightYasi.svg"
              alt=""
            />
            <img
              className="theme-night"
              src="/media/theme/darkYasi.svg"
              alt=""
            />
            <span className="theme-thumb">
              <img
                className="sun-icon"
                src="/media/theme/sunHandle.svg"
                alt=""
              />
              <img
                className="moon-icon"
                src="/media/theme/moonHandle.svg"
                alt=""
              />
            </span>
          </button>
        </div>
      </header>
    </>
  );
}
