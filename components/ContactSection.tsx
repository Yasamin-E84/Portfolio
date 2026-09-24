import { copy, type Locale } from "@/lib/content";
import { Contact } from "./Contact";
export function ContactSection({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <section className="contact-section section-shell" id="contact">
      <header className="section-heading">
        <p className="eyebrow">{c.contactEyebrow}</p>
        <h2>{c.contactTitle}</h2>
        <p>{c.contactIntro}</p>
      </header>
      <div className="contact-layout">
        <div className="contact-details">
          <a className="contact-email" href="mailto:foryxolabels@gmail.com">
            foryxolabels@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <p>{c.location}</p>
          <div className="contact-social">
            <a href="https://t.me/Foryxo" target="_blank" rel="noreferrer">
              Telegram ↗
            </a>
            <a
              href="https://wa.me/989109855546"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp ↗
            </a>
            <a
              href="https://github.com/Yasamin-E84"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a href="tel:+989109855546" dir="ltr">
              +98 910 985 5546
            </a>
          </div>
          <span className="contact-doodle" aria-hidden="true">
            ✧<br />↝
          </span>
        </div>
        <Contact locale={locale} />
      </div>
    </section>
  );
}
