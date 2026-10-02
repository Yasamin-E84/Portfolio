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
import { trackPortfolioEvent } from "@/lib/analytics-client";

function projectPreviewSource(project: { imageUrl: string; desktopImageUrl?: string; mobileImageUrl?: string }, mode: "desktop" | "mobile") {
  return mode === "mobile"
    ? project.mobileImageUrl || project.desktopImageUrl || project.imageUrl
    : project.desktopImageUrl || project.imageUrl;
}

function ProjectDevicePreview({ project, locale }: {
  project: { name: string; imageUrl: string; desktopImageUrl?: string; mobileImageUrl?: string; liveUrl: string };
  locale: Locale;
}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const desktop = resolvePortfolioUrl(projectPreviewSource(project, "desktop"), basePath);
  const mobile = resolvePortfolioUrl(projectPreviewSource(project, "mobile"), basePath);
  let host = pick(locale, "local build", "پروژه محلی");
  if (project.liveUrl) {
    try { host = new URL(project.liveUrl).hostname; } catch { host = pick(locale, "live preview", "پیش‌نمایش آنلاین"); }
  }
  const fallback = <span className="device-placeholder"><b>{project.name}</b><small>{pick(locale, "Preview coming soon", "پیش‌نمایش به‌زودی")}</small></span>;
  return <span className="project-device-stage">
    <span className="desktop-device" aria-hidden="true">
      <span className="desktop-device-bar"><i/><i/><i/><small>{host}</small></span>
      <span className="desktop-device-screen">{desktop ? <img src={desktop} alt="" loading="lazy"/> : fallback}</span>
      <span className="desktop-device-foot"/>
    </span>
    <span className="mobile-device" aria-hidden="true">
      <span className="mobile-device-speaker"/>
      <span className="mobile-device-screen">{mobile ? <img src={mobile} alt="" loading="lazy"/> : fallback}</span>
      <span className="mobile-device-home"/>
    </span>
    <span className="sr-only">{`${project.name} — ${pick(locale, "interface preview", "پیش‌نمایش رابط کاربری")}`}</span>
  </span>;
}
export function DevelopmentWork({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const managed = usePortfolioContent();
  const managedProjects = managed.projects.filter((project) => project.visible);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const projectGallery: GalleryItem[] = managedProjects.map((project) => ({
    kind: project.liveUrl ? "website" : "image",
    src: resolvePortfolioUrl(projectPreviewSource(project, "desktop"), process.env.NEXT_PUBLIC_BASE_PATH || ""),
    liveUrl: project.liveUrl,
    title: project.name,
    note: project.summary[locale],
    description: `${project.description[locale]}\n\n${pick(locale,"Role","نقش")}: ${project.role[locale]} · ${pick(locale,"Result","نتیجه")}: ${project.result[locale]}`,
    tags: project.tags,
    links: [
      ...(project.repoUrl ? [{
        label: c.source,
        href: project.repoUrl,
      }] : []),
      ...(project.liveUrl ? [{ label: c.demo, href: project.liveUrl }] : []),
      ...(project.assetUrl ? [{ label: pick(locale,"Download project","دریافت پروژه"), href: project.assetUrl }] : []),
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
              onClick={() => {setActiveProject(index);trackPortfolioEvent("project_view",p.id,locale)}}
              aria-label={`${c.imageOpen}: ${p.name}`}
            >
              <span className="paper-tape" />
              <ProjectDevicePreview project={p} locale={locale}/>
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
                {p.repoUrl && <a
                  className="text-link"
                  href={p.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.source} ↗
                </a>}
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
                {p.assetUrl && <a className="text-link" href={p.assetUrl} target="_blank" rel="noreferrer">{pick(locale,"Download project","دریافت پروژه")} ↗</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {activeProject !== null && (
        <ProjectModal
          items={projectGallery}
          activeIndex={activeProject}
          setActiveIndex={(index)=>{setActiveProject(index);trackPortfolioEvent("project_view",managedProjects[index]?.id||"unknown",locale)}}
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
    onOpen={() => {setActiveArtwork(index);trackPortfolioEvent("artwork_view",item.id,locale)}} />;
  return <section className="visual-section section-shell" id="visual">
    <header className="section-heading"><p className="eyebrow">{c.visualEyebrow}</p><h2>{c.visualTitle}</h2><p>{c.visualIntro}</p></header>
    {works.length > 0 && <div className="art-layout">{card(works[0],0,true)}<div className="art-side"><div className="art-annotation"><span>✳</span><p className="hand-note">{pick(locale,"Different tools.\nThe same curiosity.","ابزارهای متفاوت؛\nهمان کنجکاوی.")}</p></div>{works.slice(1,3).map((item,index)=>card(item,index+1))}</div></div>}
    <div className="art-strip art-strip-more">{works.slice(3).map((item,index)=>card(item,index+3))}</div>
    {activeArtwork !== null && <ProjectModal items={gallery} activeIndex={activeArtwork} setActiveIndex={(index)=>{setActiveArtwork(index);trackPortfolioEvent("artwork_view",works[index]?.id||"unknown",locale)}} onClose={()=>setActiveArtwork(null)} locale={locale}/>}
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
    <div className="motion-grid">{works.map((item,index)=><Video key={item.id} file={item.id} poster={resolvePortfolioUrl(item.posterUrl, process.env.NEXT_PUBLIC_BASE_PATH || "")} title={item.title[locale]} note={item.note[locale]} locale={locale} portrait={item.portrait} onOpen={()=>{setActiveMotion(index);trackPortfolioEvent("video_view",item.id,locale)}}/>)}</div>
    {activeMotion !== null && <ProjectModal items={gallery} activeIndex={activeMotion} setActiveIndex={(index)=>{setActiveMotion(index);trackPortfolioEvent("video_view",works[index]?.id||"unknown",locale)}} onClose={()=>setActiveMotion(null)} locale={locale}/>}
    <p className="attribution-note">{pick(locale,"Personal learning studies. Featured brands retain their respective trademarks; these are not presented as commissioned campaigns.","تمرین‌های شخصی و آموزشی. نام‌ها و نشان‌های تجاری متعلق به صاحبانشان هستند؛ این آثار به‌عنوان کمپین سفارش‌داده‌شده معرفی نمی‌شوند.")}</p>
  </div></section>;
}
