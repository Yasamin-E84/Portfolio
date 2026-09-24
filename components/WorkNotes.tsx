import { pick, type Locale } from "@/lib/content";

export function PortfolioStudy({
  locale,
  category,
}: {
  locale: Locale;
  category: string;
}) {
  const descriptions = {
    backend: [
      "A small, real contact endpoint with request validation, structured errors and abuse protection. My focus here is learning reliable server-side fundamentals.",
      "یک API تماس واقعی و کوچک با اعتبارسنجی درخواست، خطاهای ساختاریافته و محدودسازی سوءاستفاده؛ تمرکز من در این بخش تقویت مبانی قابل‌اتکای سمت سرور است.",
    ],
    database: [
      "Private contact-message storage with parameterized queries, a small schema, migrations and atomic rate limits. A practical database example inside this portfolio.",
      "ذخیره خصوصی پیام‌های تماس با کوئری‌های پارامتری، اسکیمای کوچک، مایگریشن و محدودیت اتمیک درخواست؛ نمونه‌ای کاربردی از پایگاه داده در همین پورتفولیو.",
    ],
    seo: [
      "Localized metadata, canonical and language-alternate links, semantic markup, sitemap, robots and compressed media. These are implemented in the website you are browsing.",
      "متادیتای دوزبانه، لینک کنونیکال و زبان‌های جایگزین، HTML معنایی، نقشه سایت، robots و رسانه‌های فشرده؛ این موارد در سایتی که می‌بینید پیاده‌سازی شده‌اند.",
    ],
    all: [
      "This portfolio connects a bilingual, interactive interface to a validated contact endpoint and a small private database. It is also a study in semantic structure and technical SEO.",
      "این پورتفولیو یک رابط تعاملی دوزبانه را به API تماس با اعتبارسنجی و پایگاه داده خصوصی کوچک متصل می‌کند؛ در کنار آن، تمرینی در ساختار معنایی و سئوی فنی است.",
    ],
  };
  const text =
    descriptions[category as keyof typeof descriptions] || descriptions.all;
  return (
    <section className="section-shell implementation-study">
      <article className="directory-note">
        <p className="eyebrow">
          NEXT.JS / {category === "all" ? "FULL STACK" : category.toUpperCase()}
        </p>
        <h2>{pick(locale, "The portfolio itself", "خودِ این پورتفولیو")}</h2>
        <p>{pick(locale, text[0], text[1])}</p>
        <div className="tech-chips">
          <span>Next.js</span>
          <span>TypeScript</span>
          <span>SQLite</span>
          <span>Zod</span>
        </div>
        <div className="project-links">
          <a
            className="text-link"
            href="https://github.com/Yasamin-E84/Portfolio"
            target="_blank"
            rel="noreferrer"
          >
            {pick(locale, "View the implementation", "دیدن پیاده‌سازی")} ↗
          </a>
          <a className="text-link" href={`/${locale}#contact`}>
            {pick(locale, "Try the contact form", "فرم تماس را ببینید")} ↗
          </a>
        </div>
      </article>
    </section>
  );
}
export function EditingWork({ locale }: { locale: Locale }) {
  return (
    <section className="section-shell editing-work">
      <header className="section-heading">
        <p className="eyebrow">CAPCUT / SOCIAL EDITING</p>
        <h2>{pick(locale, "Cut to the story.", "تدوین، برای روایت.")}</h2>
        <p>
          {pick(
            locale,
            "I edit Instagram content for CodeOceans and Dr. Soraghi: pacing, captions, transitions and short-form storytelling. You can see my editing work on their Instagram pages.",
            "برای صفحه‌های اینستاگرام CodeOceans و دکتر سراقی تدوین می‌کنم: ریتم، زیرنویس، ترنزیشن و روایت کوتاه. نمونه‌های تدوین من را می‌توانید در صفحه‌های اینستاگرام آن‌ها ببینید.",
          )}
        </p>
      </header>
      <div className="instagram-studies">
        <article className="directory-note">
          <h3>CodeOceans</h3>
          <p>
            {pick(
              locale,
              "Programming and educational short-form content.",
              "محتوای کوتاه آموزشی و برنامه‌نویسی.",
            )}
          </p>
          <a
            className="text-link"
            href="https://www.instagram.com/codeoceans/"
            target="_blank"
            rel="noreferrer"
          >
            @codeoceans ↗
          </a>
        </article>
        <article className="directory-note">
          <h3>{pick(locale, "Dr. Soraghi", "دکتر سراقی")}</h3>
          <p>
            {pick(
              locale,
              "Editing for the doctor’s Instagram page.",
              "تدوین برای صفحه اینستاگرام دکتر.",
            )}
          </p>
          <a
            className="text-link"
            href="https://www.instagram.com/drsoraghi/"
            target="_blank"
            rel="noreferrer"
          >
            @drsoraghi ↗
          </a>
        </article>
      </div>
    </section>
  );
}
