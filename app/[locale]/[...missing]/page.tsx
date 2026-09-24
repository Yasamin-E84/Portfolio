import { notFound } from "next/navigation";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "fa" ? "صفحه خارج از مدار" : "Page outside the orbit",
    description:
      locale === "fa"
        ? "این صفحه پیدا نشد. پروژه‌های یاسمین سراقی را ببینید یا با او تماس بگیرید."
        : "This page could not be found. Explore Yasamin Soraghi’s projects or get in touch.",
  };
}
export default function Missing() {
  notFound();
}
