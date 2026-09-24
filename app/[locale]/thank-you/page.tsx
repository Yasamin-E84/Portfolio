import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, copy } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "fa" ? "سپاس از پیام شما" : "Thank you",
    description:
      locale === "fa"
        ? "پیام تماس شما برای یاسمین سراقی ذخیره شد."
        : "Your contact message has been saved for Yasamin Soraghi.",
    robots: { index: false, follow: true },
  };
}
export default async function Thanks({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = copy[locale];
  return (
    <>
      <Header locale={locale} />
      <main className="message-page section-shell" id="main">
        <div className="lost-planet" aria-hidden="true" />
        <p className="eyebrow">
          {locale === "en" ? "MESSAGE RECEIVED" : "پیام دریافت شد"}
        </p>
        <h1>{c.thankTitle}</h1>
        <p>{c.thankText}</p>
        <div className="hero-actions">
          <Link className="button button-dark" href={`/${locale}`}>
            {c.back} ↗
          </Link>
          <a className="text-link" href="mailto:foryxolabels@gmail.com">
            Email ↗
          </a>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
