import Link from "next/link";
import { copy, type Locale } from "@/lib/content";
import { CookiePreferences, Consent } from "./Consent";
export function Footer({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <>
      <footer className="site-footer">
        <div>
          <span className="footer-signature">Yasamin.</span>
          <p>{c.footer}</p>
        </div>
        <div className="footer-links">
          <Link href={`/${locale}/privacy`}>{c.privacy}</Link>
          <Link href={`/${locale}/terms`}>{c.terms}</Link>
          <CookiePreferences locale={locale} />
          <span>
            © {new Date().getFullYear()} {c.rights}
          </span>
        </div>
      </footer>
      <div className="mobile-cta">
        <a href={`/${locale}#contact`}>
          {c.contact}
          <span aria-hidden="true">↗</span>
        </a>
        <a href="/cv/yasamin-soraghi.pdf" target="_blank" rel="noreferrer">
          {locale === "en" ? "CV ↗" : "رزومه ↗"}
        </a>
      </div>
      <Consent locale={locale} />
    </>
  );
}
