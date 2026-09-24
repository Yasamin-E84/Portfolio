import { copy, pick, publicPath, type Locale } from "@/lib/content";
import { Artwork, Video } from "./Media";
import { ThemeSwitch } from "./Header";
const projects = [
  {
    name: "ReactKala",
    image: "reactkala",
    repo: "ReactKala",
    tags: ["React", "Tailwind", "REST API"],
    en: "A storefront, built component by component.",
    fa: "یک فروشگاه؛ کامپوننت به کامپوننت.",
    enText:
      "My React storefront study: reusable product sections, API-fed carousels, mobile navigation, and a map-based address picker. React Context connects the interface; JSON Server provides the local mock data.",
    faText:
      "تمرین فروشگاه React من: بخش‌های محصول قابل‌استفاده مجدد، اسلایدرهای متصل به API، منوی موبایل و انتخاب آدرس روی نقشه. مدیریت وضعیت با Context و داده‌های آزمایشی محلی با JSON Server.",
    statusEn: "In progress · local mock API",
    statusFa: "در حال توسعه · API آزمایشی محلی",
    featured: true,
  },
  {
    name: "Digikala / API",
    image: "digikala",
    repo: "Digikala-API-Responsive",
    live: "https://yasamin-e84.github.io/Digikala-API-Responsive/",
    tags: ["JavaScript", "Tailwind", "JSON"],
    en: "From data to a responsive interface.",
    fa: "از داده تا رابطی واکنش‌گرا.",
    enText:
      "I built the responsive Persian interface with modular JavaScript, fetched JSON and reusable DOM rendering. A study in data consumption and layouts across screen sizes.",
    faText:
      "پیاده‌سازی رابط فارسی واکنش‌گرا با جاوااسکریپت ماژولار، دریافت JSON و ساخت اجزای DOM؛ تمرینی در مصرف داده و چیدمان در اندازه‌های مختلف.",
    statusEn: "Interface study · live demo",
    statusFa: "تمرین رابط کاربری · دموی آنلاین",
  },
  {
    name: "Golestan",
    image: "golestan",
    repo: "Golestan",
    live: "https://yasamin-e84.github.io/Golestan/",
    tags: ["React", "Tailwind", "RTL"],
    en: "A familiar brand, reconstructed in React.",
    fa: "بازسازی یک برند آشنا با React.",
    enText:
      "Reusable components and responsive RTL layouts for a Persian brand-page reconstruction. An educational visual study, with some promotional links intentionally left as placeholders.",
    faText:
      "کامپوننت‌های قابل‌استفاده مجدد و چیدمان راست‌به‌چپ واکنش‌گرا برای بازسازی صفحه یک برند ایرانی؛ پروژه آموزشی بصری با برخی لینک‌های تبلیغاتی نمایشی.",
    statusEn: "Educational interface study",
    statusFa: "تمرین آموزشی رابط کاربری",
  },
];
export function DevelopmentWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <section className="work-section section-shell" id="projects">
      <header className="section-heading">
        <p className="eyebrow">{c.workEyebrow}</p>
        <h2>{c.workTitle}</h2>
        <p>{c.workIntro}</p>
      </header>
      <div className="project-notebook">
        {projects.map((p, index) => (
          <article
            className={`project-sheet ${p.featured ? "featured-project" : ""}`}
            key={p.repo}
          >
            <a
              className="project-preview"
              href={p.live || `https://github.com/Yasamin-E84/${p.repo}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`${p.name} — ${p.live ? c.demo : c.source}`}
            >
              <span className="paper-tape" />
              <img
                src={publicPath(`/media/projects/${p.image}.webp`)}
                alt={`${p.name} — ${pick(locale, "interface preview", "پیش‌نمایش رابط کاربری")}`}
                width="1200"
                height="833"
                loading="lazy"
              />
              <span className="preview-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <div className="project-notes">
              <span className="project-counter">
                {String(index + 1).padStart(2, "0")} / DEVELOPMENT
              </span>
              <h3>{p.name}</h3>
              <h4>{pick(locale, p.en, p.fa)}</h4>
              <p>{pick(locale, p.enText, p.faText)}</p>
              <div className="tech-chips">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <p className="project-status">
                {pick(locale, p.statusEn, p.statusFa)}
              </p>
              <div className="project-links">
                <a
                  className="text-link"
                  href={`https://github.com/Yasamin-E84/${p.repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.source} ↗
                </a>
                {p.live && (
                  <a
                    className="text-link"
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.demo} ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="margin-project">
        <span className="hand-note">
          {pick(locale, "also on my desk", "روی میز کار من")}
        </span>
        <div>
          <h3>Foryxo Menu</h3>
          <p>
            {pick(
              locale,
              "A separate full-stack digital-menu project built with Next.js and a database. Explore its public interface on GitHub Pages and its source on the Foryxo account.",
              "پروژه مستقل منوی دیجیتال فول‌استک با Next.js و پایگاه داده. رابط عمومی آن در GitHub Pages و کد پروژه در حساب Foryxo در دسترس است.",
            )}
          </p>
          <a
            className="text-link"
            href="https://github.com/Foryxo/foryxo-menu"
            target="_blank"
            rel="noreferrer"
          >
            {c.source} ↗
          </a>
        </div>
      </aside>
      <aside className="theme-study" aria-labelledby="theme-study-title">
        <div>
          <p className="eyebrow">INTERACTION STUDY / UI DETAIL</p>
          <h3 id="theme-study-title">
            {pick(
              locale,
              "Day and night, drawn into one control.",
              "روز و شب، در یک کنترل طراحی‌شده.",
            )}
          </h3>
          <p>
            {pick(
              locale,
              "A larger working edition of this portfolio’s own theme switch. It uses the exact same artwork, motion and saved preference as the control in the header.",
              "نسخه بزرگ و فعالِ کلید تغییر تم همین پورتفولیو؛ با همان تصویرسازی، حرکت و ذخیره انتخابی که در سربرگ استفاده شده است.",
            )}
          </p>
        </div>
        <div className="theme-study-control">
          <span className="hand-note">
            {pick(locale, "try the switch", "کلید را امتحان کنید")}
          </span>
          <ThemeSwitch locale={locale} large />
        </div>
      </aside>
    </section>
  );
}
export function VisualWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <section className="visual-section section-shell" id="visual">
      <header className="section-heading">
        <p className="eyebrow">{c.visualEyebrow}</p>
        <h2>{c.visualTitle}</h2>
        <p>{c.visualIntro}</p>
      </header>
      <div className="art-layout">
        <Artwork
          file="illustrator-final"
          title={pick(locale, "A world of my own", "جهانی از آنِ من")}
          note={pick(
            locale,
            "Illustrator · final course project",
            "ایلاستریتور · پروژه نهایی دوره",
          )}
          locale={locale}
          wide
        />
        <div className="art-side">
          <div className="art-annotation">
            <span>✳</span>
            <p className="hand-note">
              {pick(
                locale,
                "Different tools.\nThe same curiosity.",
                "ابزارهای متفاوت؛\nهمان کنجکاوی.",
              )}
            </p>
          </div>
          <Artwork
            file="vector-fox"
            title={pick(locale, "In good company", "همراهی کوچک")}
            note={pick(
              locale,
              "Illustrator · vector study",
              "ایلاستریتور · تمرین وکتور",
            )}
            locale={locale}
          />
          <Artwork
            file="photoshop-cloud"
            title={pick(
              locale,
              "Somewhere between worlds",
              "جایی میان جهان‌ها",
            )}
            note={pick(
              locale,
              "Photoshop · compositing study",
              "فتوشاپ · تمرین ترکیب تصویر",
            )}
            locale={locale}
          />
        </div>
      </div>
      <div className="art-strip">
        <Artwork
          file="vector-dragon"
          title={pick(locale, "A little imagination", "کمی خیال")}
          note={pick(
            locale,
            "Illustrator · character study",
            "ایلاستریتور · تمرین شخصیت",
          )}
          locale={locale}
        />
        <Artwork
          file="photoshop-type-portrait"
          title={pick(locale, "A portrait in words", "چهره‌ای از واژه‌ها")}
          note={pick(
            locale,
            "Photoshop · typographic portrait",
            "فتوشاپ · پرتره تایپوگرافیک",
          )}
          locale={locale}
        />
        <Artwork
          file="vector-mandala"
          title={pick(locale, "Finding a rhythm", "پیدا کردن ریتم")}
          note={pick(
            locale,
            "Illustrator · pattern study",
            "ایلاستریتور · تمرین الگو",
          )}
          locale={locale}
        />
      </div>
      <div className="art-strip art-strip-more">
        <Artwork
          file="photoshop-rwby-war"
          title={pick(locale, "Move forward", "حرکت رو به جلو")}
          note={pick(
            locale,
            "Photoshop · cinematic poster",
            "فتوشاپ · پوستر سینمایی",
          )}
          locale={locale}
        />
        <Artwork
          file="photoshop-retouch"
          title={pick(locale, "Portrait retouch", "رتوش پرتره")}
          note={pick(
            locale,
            "Photoshop · beauty retouch",
            "فتوشاپ · رتوش چهره",
          )}
          locale={locale}
        />
        <Artwork
          file="photoshop-dance"
          title={pick(locale, "Just feel mighty", "پوستر حرکت")}
          note={pick(
            locale,
            "Photoshop · campaign banner",
            "فتوشاپ · بنر تبلیغاتی",
          )}
          locale={locale}
        />
        <Artwork
          file="illustrator-blend"
          title={pick(locale, "World Graphics Day", "روز جهانی گرافیک")}
          note={pick(
            locale,
            "Illustrator · Persian poster",
            "ایلاستریتور · پوستر فارسی",
          )}
          locale={locale}
        />
        <Artwork
          file="illustrator-knife"
          title={pick(locale, "Ink and edge", "جوهر و لبه")}
          note={pick(
            locale,
            "Illustrator · emblem study",
            "ایلاستریتور · تمرین نشان",
          )}
          locale={locale}
        />
        <Artwork
          file="illustrator-rocket"
          title={pick(locale, "Launch study", "تمرین پرتاب")}
          note={pick(
            locale,
            "Illustrator · ink illustration",
            "ایلاستریتور · تصویرسازی جوهری",
          )}
          locale={locale}
        />
        <Artwork
          file="logo-glam-touch"
          title="Glam Touch"
          note={pick(
            locale,
            "Illustrator · logo and sign mockup",
            "ایلاستریتور · لوگو و ماکاپ تابلو",
          )}
          locale={locale}
        />
      </div>
    </section>
  );
}
export function MotionWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <section className="motion-section" id="motion">
      <div className="section-shell">
        <header className="section-heading">
          <p className="eyebrow">{c.motionEyebrow}</p>
          <h2>{c.motionTitle}</h2>
          <p>{c.motionIntro}</p>
        </header>
        <div className="motion-grid">
          <Video
            file="social-network"
            title="Social Network"
            note={pick(
              locale,
              "After Effects · 8 sec · motion study",
              "افتر افکتس · ۸ ثانیه · تمرین موشن",
            )}
            locale={locale}
          />
          <Video
            file="digikala"
            title="Digikala"
            note={pick(
              locale,
              "After Effects · promotional motion",
              "افتر افکتس · موشن تبلیغاتی",
            )}
            locale={locale}
          />
          <Video
            file="bank-mellat"
            title={pick(locale, "Bank Mellat", "بانک ملت")}
            note={pick(
              locale,
              "After Effects · logo motion",
              "افتر افکتس · لوگوموشن",
            )}
            locale={locale}
            portrait
          />
          <Video
            file="pepsi"
            title="Pepsi"
            note={pick(
              locale,
              "After Effects · brand animation",
              "افتر افکتس · انیمیشن برند",
            )}
            locale={locale}
            portrait
          />
          <Video
            file="sam-freeze"
            title="Sam Freeze"
            note={pick(
              locale,
              "After Effects · freeze-frame study",
              "افتر افکتس · تمرین فریز فریم",
            )}
            locale={locale}
          />
          <Video
            file="walkman"
            title="Walkman"
            note={pick(
              locale,
              "After Effects · product animation",
              "افتر افکتس · انیمیشن محصول",
            )}
            locale={locale}
            portrait
          />
          <Video
            file="snapp-food"
            title="Snapp Food"
            note={pick(
              locale,
              "After Effects · 16 sec · brand study",
              "افتر افکتس · ۱۶ ثانیه · تمرین برند",
            )}
            locale={locale}
          />
          <Video
            file="watch"
            title="Watch"
            note={pick(
              locale,
              "After Effects · 30 sec · product animation",
              "افتر افکتس · ۳۰ ثانیه · انیمیشن محصول",
            )}
            locale={locale}
          />
          <Video
            file="milky-way"
            title="Milky Way"
            note={pick(
              locale,
              "After Effects · 30 sec · visual experiment",
              "افتر افکتس · ۳۰ ثانیه · تجربه بصری",
            )}
            locale={locale}
          />
        </div>
        <p className="attribution-note">
          {pick(
            locale,
            "Personal learning studies. Featured brands retain their respective trademarks; these are not presented as commissioned campaigns.",
            "تمرین‌های شخصی و آموزشی. نام‌ها و نشان‌های تجاری متعلق به صاحبانشان هستند؛ این آثار به‌عنوان کمپین سفارش‌داده‌شده معرفی نمی‌شوند.",
          )}
        </p>
      </div>
    </section>
  );
}
