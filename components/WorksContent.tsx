"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { pick, planets, type Locale } from "@/lib/content";
import { DevelopmentWork, MotionWork, VisualWork } from "./WorkSections";
import { EditingWork, PortfolioStudy } from "./WorkNotes";

export function WorksContent({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const selected = planets.find(
    (planet) => planet.id === searchParams.get("category"),
  );
  const category = selected?.id || "all";
  const show = (id: string) => category === "all" || category === id;

  return (
    <main id="main" className="works-page">
      <header className="page-heading section-shell">
        <p className="eyebrow">
          {pick(locale, "THE WORK NOTEBOOK", "دفتر نمونه‌کارها")}
        </p>
        <h1>{pick(locale, "All works", "همه نمونه‌کارها")}</h1>
        <p>
          {pick(
            locale,
            "Different tools, the same curiosity. Choose a subject to explore.",
            "ابزارهای متفاوت، همان کنجکاوی؛ یک موضوع را انتخاب کنید.",
          )}
        </p>
        <nav
          className="work-filters"
          aria-label={pick(
            locale,
            "Filter works by subject",
            "فیلتر نمونه‌کارها بر اساس موضوع",
          )}
        >
          <Link
            href={`/${locale}/works`}
            scroll={false}
            aria-current={category === "all" ? "page" : undefined}
          >
            {pick(locale, "All", "همه")}
          </Link>
          {planets.map((planet) => (
            <Link
              key={planet.id}
              href={`/${locale}/works?category=${planet.id}`}
              scroll={false}
              prefetch={false}
              aria-current={category === planet.id ? "page" : undefined}
            >
              {pick(locale, planet.en, planet.fa)}
            </Link>
          ))}
        </nav>
        <p className="filter-summary" role="status">
          {pick(locale, "Showing: ", "نمایش: ")}
          {selected
            ? pick(locale, selected.en, selected.fa)
            : pick(locale, "all subjects", "همه موضوع‌ها")}
        </p>
      </header>
      {show("frontend") && <DevelopmentWork locale={locale} />}
      {(category === "all" ||
        ["backend", "database", "seo"].includes(category)) && (
        <PortfolioStudy locale={locale} category={category} />
      )}
      {show("visual") && <VisualWork locale={locale} />}
      {show("motion") && <MotionWork locale={locale} />}
      {show("editing") && <EditingWork locale={locale} />}
      <aside className="more-work section-shell">
        <p className="hand-note">
          {pick(locale, "More samples on GitHub", "نمونه‌های بیشتر در گیت‌هاب")}
        </p>
        <a
          className="text-link"
          href="https://github.com/Yasamin-E84"
          target="_blank"
          rel="noreferrer"
        >
          Yasamin-E84 ↗
        </a>
      </aside>
    </main>
  );
}
