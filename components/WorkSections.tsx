"use client";

import { useState } from "react";
import { copy, pick, publicPath, type Locale } from "@/lib/content";
import { Artwork, Video } from "./Media";
import {
  ProjectModal,
  imageGalleryItem,
  type GalleryItem,
} from "./ProjectModal";
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
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const projectGallery: GalleryItem[] = projects.map((project) => ({
    kind: "image",
    src: publicPath(`/media/projects/${project.image}.webp`),
    title: project.name,
    note: pick(locale, project.en, project.fa),
    description: pick(locale, project.enText, project.faText),
    tags: project.tags,
    links: [
      {
        label: c.source,
        href: `https://github.com/Yasamin-E84/${project.repo}`,
      },
      ...(project.live ? [{ label: c.demo, href: project.live }] : []),
    ],
  }));
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
            <button
              type="button"
              className="project-preview"
              onClick={() => setActiveProject(index)}
              aria-label={`${c.imageOpen}: ${p.name}`}
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
            </button>
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
      {activeProject !== null && (
        <ProjectModal
          items={projectGallery}
          activeIndex={activeProject}
          setActiveIndex={setActiveProject}
          onClose={() => setActiveProject(null)}
          locale={locale}
        />
      )}
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
function visualGallery(locale: Locale): GalleryItem[] {
  return [
    imageGalleryItem(
      "illustrator-final",
      pick(locale, "A world of my own", "جهانی از آنِ من"),
      pick(
        locale,
        "Illustrator · final course project",
        "ایلاستریتور · پروژه نهایی دوره",
      ),
    ),
    imageGalleryItem(
      "vector-fox",
      pick(locale, "In good company", "همراهی کوچک"),
      pick(locale, "Illustrator · vector study", "ایلاستریتور · تمرین وکتور"),
    ),
    imageGalleryItem(
      "photoshop-cloud",
      pick(locale, "Somewhere between worlds", "جایی میان جهان‌ها"),
      pick(
        locale,
        "Photoshop · compositing study",
        "فتوشاپ · تمرین ترکیب تصویر",
      ),
    ),
    imageGalleryItem(
      "vector-dragon",
      pick(locale, "A little imagination", "کمی خیال"),
      pick(
        locale,
        "Illustrator · character study",
        "ایلاستریتور · تمرین شخصیت",
      ),
    ),
    imageGalleryItem(
      "photoshop-type-portrait",
      pick(locale, "A portrait in words", "چهره‌ای از واژه‌ها"),
      pick(
        locale,
        "Photoshop · typographic portrait",
        "فتوشاپ · پرتره تایپوگرافیک",
      ),
    ),
    imageGalleryItem(
      "vector-mandala",
      pick(locale, "Finding a rhythm", "پیدا کردن ریتم"),
      pick(locale, "Illustrator · pattern study", "ایلاستریتور · تمرین الگو"),
    ),
    imageGalleryItem(
      "photoshop-rwby-war",
      pick(locale, "Move forward", "حرکت رو به جلو"),
      pick(locale, "Photoshop · cinematic poster", "فتوشاپ · پوستر سینمایی"),
    ),
    imageGalleryItem(
      "photoshop-retouch",
      pick(locale, "Portrait retouch", "رتوش پرتره"),
      pick(locale, "Photoshop · beauty retouch", "فتوشاپ · رتوش چهره"),
    ),
    imageGalleryItem(
      "photoshop-dance",
      pick(locale, "Just feel mighty", "پوستر حرکت"),
      pick(locale, "Photoshop · campaign banner", "فتوشاپ · بنر تبلیغاتی"),
    ),
    imageGalleryItem(
      "illustrator-blend",
      pick(locale, "World Graphics Day", "روز جهانی گرافیک"),
      pick(locale, "Illustrator · Persian poster", "ایلاستریتور · پوستر فارسی"),
    ),
    imageGalleryItem(
      "illustrator-knife",
      pick(locale, "Ink and edge", "جوهر و لبه"),
      pick(locale, "Illustrator · emblem study", "ایلاستریتور · تمرین نشان"),
    ),
    imageGalleryItem(
      "illustrator-rocket",
      pick(locale, "Launch study", "تمرین پرتاب"),
      pick(
        locale,
        "Illustrator · ink illustration",
        "ایلاستریتور · تصویرسازی جوهری",
      ),
    ),
    imageGalleryItem(
      "logo-glam-touch",
      "Glam Touch",
      pick(
        locale,
        "Illustrator · logo and sign mockup",
        "ایلاستریتور · لوگو و ماکاپ تابلو",
      ),
    ),
  ];
}

export function VisualWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [activeArtwork, setActiveArtwork] = useState<number | null>(null);
  const gallery = visualGallery(locale);
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
          onOpen={() => setActiveArtwork(0)}
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
            onOpen={() => setActiveArtwork(1)}
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
            onOpen={() => setActiveArtwork(2)}
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
          onOpen={() => setActiveArtwork(3)}
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
          onOpen={() => setActiveArtwork(4)}
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
          onOpen={() => setActiveArtwork(5)}
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
          onOpen={() => setActiveArtwork(6)}
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
          onOpen={() => setActiveArtwork(7)}
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
          onOpen={() => setActiveArtwork(8)}
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
          onOpen={() => setActiveArtwork(9)}
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
          onOpen={() => setActiveArtwork(10)}
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
          onOpen={() => setActiveArtwork(11)}
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
          onOpen={() => setActiveArtwork(12)}
        />
      </div>
      {activeArtwork !== null && (
        <ProjectModal
          items={gallery}
          activeIndex={activeArtwork}
          setActiveIndex={setActiveArtwork}
          onClose={() => setActiveArtwork(null)}
          locale={locale}
        />
      )}
    </section>
  );
}
function motionGallery(locale: Locale): GalleryItem[] {
  const items = [
    [
      "social-network",
      "Social Network",
      "After Effects · 8 sec · motion study",
      "افتر افکتس · ۸ ثانیه · تمرین موشن",
      false,
    ],
    [
      "digikala",
      "Digikala",
      "After Effects · promotional motion",
      "افتر افکتس · موشن تبلیغاتی",
      false,
    ],
    [
      "bank-mellat",
      pick(locale, "Bank Mellat", "بانک ملت"),
      "After Effects · logo motion",
      "افتر افکتس · لوگوموشن",
      true,
    ],
    [
      "pepsi",
      "Pepsi",
      "After Effects · brand animation",
      "افتر افکتس · انیمیشن برند",
      true,
    ],
    [
      "sam-freeze",
      "Sam Freeze",
      "After Effects · freeze-frame study",
      "افتر افکتس · تمرین فریز فریم",
      false,
    ],
    [
      "walkman",
      "Walkman",
      "After Effects · product animation",
      "افتر افکتس · انیمیشن محصول",
      true,
    ],
    [
      "snapp-food",
      "Snapp Food",
      "After Effects · 16 sec · brand study",
      "افتر افکتس · ۱۶ ثانیه · تمرین برند",
      false,
    ],
    [
      "watch",
      "Watch",
      "After Effects · 30 sec · product animation",
      "افتر افکتس · ۳۰ ثانیه · انیمیشن محصول",
      false,
    ],
    [
      "milky-way",
      "Milky Way",
      "After Effects · 30 sec · visual experiment",
      "افتر افکتس · ۳۰ ثانیه · تجربه بصری",
      false,
    ],
  ] as const;
  return items.map(([file, title, en, fa, portrait]) => ({
    kind: "video" as const,
    src: publicPath(`/media/video/${file}.mp4`),
    poster: publicPath(`/media/video/${file}.webp`),
    title,
    note: pick(locale, en, fa),
    portrait,
  }));
}

export function MotionWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [activeMotion, setActiveMotion] = useState<number | null>(null);
  const gallery = motionGallery(locale);
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
            onOpen={() => setActiveMotion(0)}
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
            onOpen={() => setActiveMotion(1)}
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
            onOpen={() => setActiveMotion(2)}
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
            onOpen={() => setActiveMotion(3)}
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
            onOpen={() => setActiveMotion(4)}
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
            onOpen={() => setActiveMotion(5)}
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
            onOpen={() => setActiveMotion(6)}
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
            onOpen={() => setActiveMotion(7)}
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
            onOpen={() => setActiveMotion(8)}
          />
        </div>
        {activeMotion !== null && (
          <ProjectModal
            items={gallery}
            activeIndex={activeMotion}
            setActiveIndex={setActiveMotion}
            onClose={() => setActiveMotion(null)}
            locale={locale}
          />
        )}
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
