import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AboutContent } from "@/components/AboutContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: pick(locale, "About me", "درباره من"),
    description: pick(
      locale,
      "Meet Yasamin Soraghi, a frontend-focused developer and visual creator in Tehran. Background, education, creative practice and CV.",
      "با یاسمین سراقی، توسعه‌دهنده فرانت‌اند و خالق آثار بصری در تهران آشنا شوید؛ مسیر یادگیری، تحصیلات، فعالیت خلاقانه و رزومه.",
    ),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", fa: "/fa/about" },
    },
  };
}
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <Header locale={locale} />
      <main id="main" className="about-page">
        <header className="page-heading section-shell">
          <p className="eyebrow">
            {pick(locale, "A PERSONAL NOTE", "یادداشتی شخصی")}
          </p>
          <h1>{pick(locale, "About me", "درباره من")}</h1>
          <p>
            {pick(
              locale,
              "A little of the person behind the planets.",
              "کمی درباره کسی که پشت این منظومه است.",
            )}
          </p>
        </header>
        <AboutContent locale={locale} />
        <div className="page-end-links section-shell">
          <Link className="button button-outline" href={`/${locale}/works`}>
            {pick(locale, "Explore my work", "دیدن نمونه‌کارها")} ↗
          </Link>
          <Link className="text-link" href={`/${locale}#contact`}>
            {pick(locale, "Get in touch", "گفت‌وگو کنیم")} ↗
          </Link>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
