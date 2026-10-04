import type { Locale } from "@/lib/content";
import type { Publication } from "@/content-engine/types";

export const yasaminEntity = {
  name: "Yasamin Soraghi",
  alternateName: "یاسمین سراقی",
  occupation: "Frontend Developer",
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  projects: ["Dastresi", "Foryxo Menu", "ReactKala"],
  topics: ["Frontend", "AI", "Web Development", "Technology"],
};

export function websiteGraph(origin: string, locale: Locale) {
  const personId = `${origin}/#yasamin`;
  const organizationId = `${origin}/#foryxo`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${origin}/#website`, url: origin, name: "Yasamin Soraghi — Technology Field Notes", inLanguage: ["en", "fa"], publisher: { "@id": personId } },
      { "@type": "Person", "@id": personId, name: yasaminEntity.name, alternateName: yasaminEntity.alternateName, jobTitle: yasaminEntity.occupation, knowsAbout: [...yasaminEntity.skills, ...yasaminEntity.topics], url: `${origin}/${locale}` },
      { "@type": "Organization", "@id": organizationId, name: "Foryxo Studio", founder: { "@id": personId }, url: `${origin}/${locale}` },
    ],
  };
}

export function articleGraph(item: Publication, locale: Locale, origin: string) {
  const localized = { title: item.title[locale], description: item.shortDescription[locale] };
  return {
    "@context": "https://schema.org", "@graph": [
      { "@type": item.type === "signature-update" ? "BlogPosting" : "Article", headline: localized.title, description: localized.description, datePublished: item.publishDate, dateModified: new Date(item.updatedAt * 1000).toISOString(), author: { "@id": `${origin}/#yasamin` }, mainEntityOfPage: `${origin}/${locale}/journal/${item.slug}`, image: item.coverImage ? [new URL(item.coverImage, origin).toString()] : undefined, keywords: item.tags.join(", "), inLanguage: locale },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: locale === "fa" ? "خانه" : "Home", item: `${origin}/${locale}` },
        { "@type": "ListItem", position: 2, name: locale === "fa" ? "دفتر فناوری" : "Field notes", item: `${origin}/${locale}/journal` },
        { "@type": "ListItem", position: 3, name: localized.title, item: `${origin}/${locale}/journal/${item.slug}` },
      ] },
      ...(item.faq.length ? [{ "@type": "FAQPage", mainEntity: item.faq.map((faq) => ({ "@type": "Question", name: faq.question[locale], acceptedAnswer: { "@type": "Answer", text: faq.answer[locale] } })) }] : []),
    ],
  };
}
