import { headers } from "next/headers";
import { copy } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = {
  title: "Page outside the orbit",
  description:
    "This page could not be found. Explore Yasamin Soraghi’s projects or get in touch.",
};
export default async function NotFound() {
  const h = await headers();
  const locale = h.get("x-portfolio-locale") === "fa" ? "fa" : "en",
    c = copy[locale];
  return (
    <>
      <Header locale={locale} />
      <main id="main" className="message-page section-shell">
        <div className="lost-planet" aria-hidden="true" />
        <p className="eyebrow">
          404 · {locale === "en" ? "SIGNAL LOST" : "خارج از مدار"}
        </p>
        <h1>{c.lostTitle}</h1>
        <p>{c.lostText}</p>
        <div className="hero-actions">
          <a className="button button-dark" href={`/${locale}`}>
            {c.back}
          </a>
          <a className="text-link" href={`/${locale}/works`}>
            {c.explore}
          </a>
          <a className="text-link" href={`/${locale}#contact`}>
            {c.contact}
          </a>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
