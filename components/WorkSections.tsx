"use client";

import { useState } from "react";
import { copy, pick, type Locale } from "@/lib/content";
import { Artwork, Video } from "./Media";
import {
  ProjectModal,
  type GalleryItem,
} from "./ProjectModal";
import { ThemeSwitch } from "./Header";
import { usePortfolioContent } from "./PortfolioContent";
import { resolvePortfolioUrl } from "@/lib/portfolio-config";
export function DevelopmentWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const managed = usePortfolioContent();
  const managedProjects = managed.projects.filter((project) => project.visible);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const projectGallery: GalleryItem[] = managedProjects.map((project) => ({
    kind: project.liveUrl ? "website" : "image",
    src: resolvePortfolioUrl(project.imageUrl, process.env.NEXT_PUBLIC_BASE_PATH || ""),
    liveUrl: project.liveUrl,
    title: project.name,
    note: project.summary[locale],
    description: `${project.description[locale]}\n\n${pick(locale,"Role","نقش")}: ${project.role[locale]} · ${pick(locale,"Result","نتیجه")}: ${project.result[locale]}`,
    tags: project.tags,
    links: [
      {
        label: c.source,
        href: project.repoUrl,
      },
      ...(project.liveUrl ? [{ label: c.demo, href: project.liveUrl }] : []),
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
        {managedProjects.map((p, index) => (
          <article
            className={`project-sheet ${p.featured ? "featured-project" : ""}`}
            key={p.id}
          >
            <button
              type="button"
              className="project-preview"
              onClick={() => setActiveProject(index)}
              aria-label={`${c.imageOpen}: ${p.name}`}
            >
              <span className="paper-tape" />
              <img
                src={resolvePortfolioUrl(p.imageUrl, process.env.NEXT_PUBLIC_BASE_PATH || "")}
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
              <h4>{p.summary[locale]}</h4>
              <p>{p.description[locale]}</p>
              <dl className="project-impact"><div><dt>{pick(locale,"Role","نقش")}</dt><dd>{p.role[locale]}</dd></div><div><dt>{pick(locale,"Result","نتیجه")}</dt><dd>{p.result[locale]}</dd></div></dl>
              <div className="tech-chips">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <p className="project-status">
                {p.status[locale]}
              </p>
              <div className="project-links">
                <a
                  className="text-link"
                  href={p.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.source} ↗
                </a>
                {p.liveUrl && (
                  <a
                    className="text-link"
                    href={p.liveUrl}
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
export function VisualWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const managed = usePortfolioContent();
  const works = managed.artworks.filter((item) => item.visible);
  const [activeArtwork, setActiveArtwork] = useState<number | null>(null);
  const gallery: GalleryItem[] = works.map((item) => ({
    kind: "image", src: resolvePortfolioUrl(item.imageUrl, process.env.NEXT_PUBLIC_BASE_PATH || ""),
    title: item.title[locale], note: item.note[locale], tags: [item.category],
  }));
  const card = (item: (typeof works)[number], index: number, wide = false) => <Artwork
    key={item.id} file={item.id} src={resolvePortfolioUrl(item.imageUrl, process.env.NEXT_PUBLIC_BASE_PATH || "")}
    title={item.title[locale]} note={item.note[locale]} locale={locale} wide={wide}
    onOpen={() => setActiveArtwork(index)} />;
  return <section className="visual-section section-shell" id="visual">
    <header className="section-heading"><p className="eyebrow">{c.visualEyebrow}</p><h2>{c.visualTitle}</h2><p>{c.visualIntro}</p></header>
    {works.length > 0 && <div className="art-layout">{card(works[0],0,true)}<div className="art-side"><div className="art-annotation"><span>✳</span><p className="hand-note">{pick(locale,"Different tools.\nThe same curiosity.","ابزارهای متفاوت؛\nهمان کنجکاوی.")}</p></div>{works.slice(1,3).map((item,index)=>card(item,index+1))}</div></div>}
    <div className="art-strip art-strip-more">{works.slice(3).map((item,index)=>card(item,index+3))}</div>
    {activeArtwork !== null && <ProjectModal items={gallery} activeIndex={activeArtwork} setActiveIndex={setActiveArtwork} onClose={()=>setActiveArtwork(null)} locale={locale}/>}
  </section>;
}
export function MotionWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const managed = usePortfolioContent();
  const works = managed.motion.filter((item) => item.visible);
  const [activeMotion, setActiveMotion] = useState<number | null>(null);
  const gallery: GalleryItem[] = works.map((item) => ({ kind:"video", src:resolvePortfolioUrl(item.videoUrl, process.env.NEXT_PUBLIC_BASE_PATH || ""), poster:resolvePortfolioUrl(item.posterUrl, process.env.NEXT_PUBLIC_BASE_PATH || ""), title:item.title[locale], note:item.note[locale], portrait:item.portrait }));
  return <section className="motion-section" id="motion"><div className="section-shell">
    <header className="section-heading"><p className="eyebrow">{c.motionEyebrow}</p><h2>{c.motionTitle}</h2><p>{c.motionIntro}</p></header>
    <div className="motion-grid">{works.map((item,index)=><Video key={item.id} file={item.id} poster={resolvePortfolioUrl(item.posterUrl, process.env.NEXT_PUBLIC_BASE_PATH || "")} title={item.title[locale]} note={item.note[locale]} locale={locale} portrait={item.portrait} onOpen={()=>setActiveMotion(index)}/>)}</div>
    {activeMotion !== null && <ProjectModal items={gallery} activeIndex={activeMotion} setActiveIndex={setActiveMotion} onClose={()=>setActiveMotion(null)} locale={locale}/>}
    <p className="attribution-note">{pick(locale,"Personal learning studies. Featured brands retain their respective trademarks; these are not presented as commissioned campaigns.","تمرین‌های شخصی و آموزشی. نام‌ها و نشان‌های تجاری متعلق به صاحبانشان هستند؛ این آثار به‌عنوان کمپین سفارش‌داده‌شده معرفی نمی‌شوند.")}</p>
  </div></section>;
}
