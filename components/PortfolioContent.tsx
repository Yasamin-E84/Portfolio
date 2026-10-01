"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultPortfolioConfig, portfolioConfigSchema, type PortfolioConfig } from "@/lib/portfolio-config";
import type { Locale } from "@/lib/content";

const PortfolioContext = createContext(defaultPortfolioConfig);

export function PortfolioContentProvider({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const [content, setContent] = useState<PortfolioConfig>(defaultPortfolioConfig);
  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_CONTENT_API || "/api/content";
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal, mode: "cors" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((value) => { const parsed = portfolioConfigSchema.safeParse(value); if (parsed.success) setContent(parsed.data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    document.title = content.settings.seoTitle[locale];
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", content.settings.seoDescription[locale]);
  }, [content, locale]);
  return <PortfolioContext.Provider value={content}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioContent() { return useContext(PortfolioContext); }
