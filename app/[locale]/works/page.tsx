import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, planets } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  DevelopmentWork,
  VisualWork,
  MotionWork,
} from "@/components/WorkSections";
import { PortfolioStudy, EditingWork } from "@/components/WorkNotes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: pick(locale, "All works", "همه نمونه‌کارها"),
    description: pick(
      locale,
      "Explore Yasamin Soraghi’s web development, illustration, Photoshop, motion graphics and video editing. Filter work by subject.",
      "نمونه‌کارهای توسعه وب، تصویرسازی، فتوشاپ، موشن گرافیک و تدوین ویدئوی یاسمن سراقی را بر اساس موضوع ببینید.",
    ),
    alternates: {
      canonical: `/${locale}/works`,
      languages: { en: "/en/works", fa: "/fa/works" },
    },
  };
}
export default async function WorksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const selected = planets.find((p) => p.id === query.category);
  const category = selected?.id || "all";
  const show = (id: string) => category === "all" || category === id;
  return (
    <>
      <Header locale={locale} />
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
            {planets.map((p) => (
              <Link
                key={p.id}
                href={`/${locale}/works?category=${p.id}`}
                scroll={false}
                prefetch={false}
                aria-current={category === p.id ? "page" : undefined}
              >
                {pick(locale, p.en, p.fa)}
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
            {pick(
              locale,
              "More samples on GitHub",
              "نمونه‌های بیشتر در گیت‌هاب",
            )}
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
      <Footer locale={locale} />
    </>
  );
}
