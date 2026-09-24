import { copy, pick, type Locale } from "@/lib/content";
export function AboutContent({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <section className="about-section section-shell" id="about">
      <div className="portrait-sheet">
        <span className="paper-tape" />
        <img
          src="/media/yasamin-portrait.webp"
          alt={c.name}
          width="700"
          height="933"
          loading="lazy"
        />
        <p className="hand-note">
          {pick(locale, "hello, it’s me :)", "سلام، این منم :)")}
        </p>
        <span className="portrait-star" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="about-copy">
        <p className="eyebrow">{c.aboutEyebrow}</p>
        <h2>{c.aboutTitle}</h2>
        <p>{c.aboutText}</p>
        <p>{c.aboutText2}</p>
        <a
          className="button button-outline"
          href="/cv/yasamin-soraghi.pdf"
          target="_blank"
          rel="noreferrer"
        >
          {c.cv} ↗
        </a>
      </div>
      <div className="timeline">
        <h3 className="hand-note">{c.experience}</h3>
        <div>
          <span>2026</span>
          <h4>{c.experienceTitle}</h4>
          <p>{c.experienceText}</p>
        </div>
        <div>
          <span>2024 —</span>
          <h4>{c.educationTitle}</h4>
          <p>{c.educationText}</p>
        </div>
        <div>
          <span>↗</span>
          <h4>{c.courses}</h4>
          <p>{c.coursesText}</p>
        </div>
      </div>
    </section>
  );
}
