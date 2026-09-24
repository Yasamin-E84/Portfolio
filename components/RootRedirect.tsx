"use client";

import { useEffect } from "react";
import Link from "next/link";

export function RootRedirect() {
  useEffect(() => {
    let locale = "fa";
    try {
      locale = localStorage.getItem("ys-locale") === "en" ? "en" : "fa";
    } catch {}
    window.location.replace(
      `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${locale}`,
    );
  }, []);
  return (
    <main className="root-redirect">
      <p>در حال باز کردن پورتفولیو… / Opening portfolio…</p>
      <div>
        <Link href="/fa">فارسی</Link>
        <Link href="/en">English</Link>
      </div>
    </main>
  );
}
