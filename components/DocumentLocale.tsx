"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/content";

export function DocumentLocale({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);
  return null;
}
