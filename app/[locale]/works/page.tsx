import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale, pick } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WorksContent } from "@/components/WorksContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: pick(locale, "All works", "همه نمونه‌کارها"),
    description: pick(
      locale,
      "Explore Yasamin Soraghi’s web development, illustration, Photoshop, motion graphics and video editing. Filter work by subject.",
      "نمونه‌کارهای توسعه وب، تصویرسازی، فتوشاپ، موشن گرافیک و تدوین ویدئوی یاسمین سراقی را بر اساس موضوع ببینید.",
    ),
    alternates: {
      canonical: `/${locale}/works`,
      languages: { en: "/en/works", fa: "/fa/works" },
    },
  };
}
export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <Header locale={locale} />
      <Suspense fallback={<main id="main" className="works-page" />}>
        <WorksContent locale={locale} />
      </Suspense>
      <Footer locale={locale} />
    </>
  );
}
