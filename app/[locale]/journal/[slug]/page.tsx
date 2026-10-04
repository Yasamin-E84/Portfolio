import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { defaultPublications } from "@/content-engine/default-content";
import { getPublication } from "@/content-engine/repository";
import { isLocale, pick, publicPath, siteUrl } from "@/lib/content";
import { articleGraph } from "@/seo-engine/entity";

export function generateStaticParams() { return ["en","fa"].flatMap((locale)=>defaultPublications.map(({slug})=>({locale,slug}))); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; if (!isLocale(locale)) return {};
  const item = await getPublication(slug); if (!item) return {};
  const canonical = `/${locale}/journal/${item.slug}`;
  return { title: item.seoTitle[locale], description: item.seoDescription[locale], keywords: item.tags, authors: [{ name: item.author, url: `${siteUrl}/${locale}/about` }], alternates: { canonical, languages: { en: `/en/journal/${item.slug}`, fa: `/fa/journal/${item.slug}`, "x-default": `/en/journal/${item.slug}` } }, robots: { index: true, follow: true }, openGraph: { type: "article", title: item.seoTitle[locale], description: item.seoDescription[locale], url: `${siteUrl}${canonical}`, publishedTime: item.publishDate, authors: [item.author], tags: item.tags, images: [item.coverImage || "/og.png"] }, twitter: { card: "summary_large_image", title: item.seoTitle[locale], description: item.seoDescription[locale], images: [item.coverImage || "/og.png"] } };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; if (!isLocale(locale)) notFound();
  const item = await getPublication(slug); if (!item) notFound();
  const graph = articleGraph(item, locale, siteUrl);
  return <><Header locale={locale}/><main id="main" className="article-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replaceAll("<","\\u003c")}}/>
    <nav className="article-breadcrumb section-shell" aria-label="Breadcrumb"><Link href={`/${locale}`}>{pick(locale,"Home","خانه")}</Link><span>/</span><Link href={`/${locale}/journal`}>{pick(locale,"Field notes","دفتر فناوری")}</Link><span>/</span><span>{item.category}</span></nav>
    <article className="article-sheet section-shell"><header><span className="journal-type">{item.type === "signature-update" ? pick(locale,"Signature update","به‌روزرسانی یاسمین") : item.category}</span><h1>{item.title[locale]}</h1><p>{item.shortDescription[locale]}</p><div><time dateTime={item.publishDate}>{new Intl.DateTimeFormat(locale,{dateStyle:"long"}).format(new Date(item.publishDate))}</time><span>{item.readingTime} {pick(locale,"min read","دقیقه مطالعه")}</span><span>{item.author}</span></div></header>
      {item.coverImage && <div className="article-cover"><Image src={item.coverImage.startsWith("http")?item.coverImage:publicPath(item.coverImage)} fill sizes="(max-width: 900px) 100vw, 900px" alt="" priority/></div>}
      <section className="article-answer"><p className="hand-note">{pick(locale,"The short answer","پاسخ کوتاه")}</p><p>{item.answer[locale]}</p></section>
      <ArticleSection title={pick(locale,"Detailed explanation","توضیح کامل")} text={item.content[locale]}/><ArticleSection title={pick(locale,"Examples","مثال‌ها")} text={item.examples[locale]}/><ArticleSection title={pick(locale,"Developer perspective","دیدگاه توسعه‌دهنده")} text={item.expertOpinion[locale]}/>
      {!!item.sources.length && <section className="article-sources"><h2>{pick(locale,"Sources","منابع")}</h2><ol>{item.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></li>)}</ol></section>}
      {!!item.faq.length && <section className="article-faq"><h2>{pick(locale,"Frequently asked questions","پرسش‌های پرتکرار")}</h2>{item.faq.map((faq,index)=><details key={index}><summary>{faq.question[locale]}</summary><p>{faq.answer[locale]}</p></details>)}</section>}
      <footer className="article-tags">{item.tags.map(tag=><span key={tag}>#{tag}</span>)}</footer>
    </article><div className="page-end-links section-shell"><Link className="button button-outline" href={`/${locale}/journal`}>{pick(locale,"Back to all notes","بازگشت به یادداشت‌ها")} ↗</Link><Link className="text-link" href={`/${locale}#contact`}>{pick(locale,"Work with me","همکاری با من")} ↗</Link></div>
  </main><Footer locale={locale}/></>;
}
function ArticleSection({title,text}:{title:string;text:string}) { return <section className="article-section"><h2>{title}</h2>{text.split(/\n{2,}/).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>; }
