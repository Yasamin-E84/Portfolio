import { copy, pick, type Locale } from "@/lib/content";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Solar } from "./Solar";
import { NotebookStudy } from "./NotebookStudy";
import { ContactSection } from "./ContactSection";
export function Home({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <>
      <Header locale={locale} cosmic />
      <main id="main">
        {" "}
        <section className="hero" id="universe">
          <h1 className="sr-only">
            {c.name} —{" "}
            {pick(
              locale,
              "Developer & Visual Creator: seven worlds of work",
              "توسعه‌دهنده و خالق آثار بصری: هفت جهان کاری",
            )}
          </h1>
          <Solar locale={locale} />
          <a className="cosmic-explore" href="#notebook">
            {pick(locale, "Open the notebook", "دفتر را ورق بزن")}{" "}
            <span aria-hidden="true">↓</span>
          </a>
        </section>
        <section className="notebook-introduction" id="notebook">
          <div className="hero-top">
            <div className="hero-copy">
              <p className="eyebrow">{c.eyebrow}</p>
              <h2>
                {c.title}
                <br />
                <em>{c.title2}</em>
              </h2>
              <p className="hero-intro">{c.intro}</p>
              <div className="hero-actions">
                <a className="button button-dark" href={`/${locale}/works`}>
                  {c.explore}
                  <span aria-hidden="true">↘</span>
                </a>
                <a className="text-link" href={`/${locale}/about`}>
                  {c.nav[2]} ↗
                </a>
              </div>
            </div>
            <div className="hero-margin-note" aria-hidden="true">
              <NotebookStudy />
              <span>01 — 07</span>
              <i>code · create · connect</i>
              <svg viewBox="0 0 110 65">
                <path d="M2 4 Q 100 0 82 57 M70 47 L82 58 L93 47" />
              </svg>
            </div>
          </div>
        </section>
        <div className="notebook-directory section-shell">
          <a className="directory-note" href={`/${locale}/works`}>
            <span className="hand-note">01</span>
            <h2>{pick(locale, "The work notebook", "دفتر نمونه‌کارها")}</h2>
            <p>
              {pick(
                locale,
                "Browse development, illustration, motion and editing by subject.",
                "نمونه‌کارهای توسعه وب، تصویرسازی، موشن و تدوین را بر اساس موضوع ببینید.",
              )}
            </p>
            <span aria-hidden="true">↗</span>
          </a>
          <a className="directory-note" href={`/${locale}/about`}>
            <span className="hand-note">02</span>
            <h2>{c.nav[2]}</h2>
            <p>
              {pick(
                locale,
                "My background, the tools I work with, and what I am learning next.",
                "مسیر من، ابزارهایی که با آن‌ها کار می‌کنم و چیزهایی که یاد می‌گیرم.",
              )}
            </p>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ContactSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
