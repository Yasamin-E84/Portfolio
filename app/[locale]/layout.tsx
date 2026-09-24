import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { DocumentLocale } from "@/components/DocumentLocale";
import { isLocale } from "@/lib/content";

export const dynamicParams = false;

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
  return (
    <div
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      data-locale={locale}
      className="locale-root"
    >
      <DocumentLocale locale={locale} />
      {children}
    </div>
  );
}
