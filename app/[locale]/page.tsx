import { notFound } from "next/navigation";
import { isLocale, copy, siteUrl } from "@/lib/content";
import { Home } from "@/components/Home";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = copy[locale];
  return {
    title: c.role,
    description: c.intro,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fa: "/fa", "x-default": "/en" },
    },
    openGraph: {
      title: c.name + " — " + c.role,
      description: c.intro,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: `${siteUrl}/${locale}`,
      images: ["/og.png"],
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Home locale={locale} />;
}
