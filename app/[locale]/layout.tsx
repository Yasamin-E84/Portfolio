import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { DocumentLocale } from "@/components/DocumentLocale";
import { PageTurnTransition } from "@/components/PageTurnTransition";
import { PortfolioContentProvider } from "@/components/PortfolioContent";
import { isLocale } from "@/lib/content";
import { siteUrl } from "@/lib/content";
import { websiteGraph } from "@/seo-engine/entity";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fa" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const graph = websiteGraph(siteUrl, locale);
  return (
    <div
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      data-locale={locale}
      className="locale-root"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replaceAll("<", "\\u003c") }} />
      <DocumentLocale locale={locale} />
      <PageTurnTransition />
      <PortfolioContentProvider locale={locale}>{children}</PortfolioContentProvider>
    </div>
  );
}
