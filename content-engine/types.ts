import { z } from "zod";

export const bilingualTextSchema = z.object({ en: z.string(), fa: z.string() });
export const faqSchema = z.object({ question: bilingualTextSchema, answer: bilingualTextSchema });
export const sourceSchema = z.object({ title: z.string().min(1).max(180), url: z.string().url() });

export const publicationSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(["article", "signature-update"]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  title: bilingualTextSchema,
  shortDescription: bilingualTextSchema,
  answer: bilingualTextSchema,
  content: bilingualTextSchema,
  examples: bilingualTextSchema,
  expertOpinion: bilingualTextSchema,
  coverImage: z.string().max(1000).default(""),
  category: z.enum(["AI", "Frontend", "Backend", "Security", "Tools", "Industry", "Career", "Projects"]),
  tags: z.array(z.string().min(1).max(40)).max(15),
  publishDate: z.string(),
  scheduledFor: z.string().default(""),
  featured: z.boolean(),
  seoTitle: bilingualTextSchema,
  seoDescription: bilingualTextSchema,
  socialCaption: bilingualTextSchema,
  schemaData: z.record(z.string(), z.unknown()).default({}),
  author: z.string().min(1).max(100),
  readingTime: z.number().int().min(1).max(120),
  status: z.enum(["draft", "scheduled", "published"]),
  faq: z.array(faqSchema).max(12),
  sources: z.array(sourceSchema).max(20),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export type Publication = z.infer<typeof publicationSchema>;
export type PublicationType = Publication["type"];
export type PublicationStatus = Publication["status"];

export function localizePublication(item: Publication, locale: "en" | "fa") {
  return {
    ...item,
    title: item.title[locale],
    shortDescription: item.shortDescription[locale],
    answer: item.answer[locale],
    content: item.content[locale],
    examples: item.examples[locale],
    expertOpinion: item.expertOpinion[locale],
    seoTitle: item.seoTitle[locale],
    seoDescription: item.seoDescription[locale],
    socialCaption: item.socialCaption[locale],
    faq: item.faq.map((entry) => ({ question: entry.question[locale], answer: entry.answer[locale] })),
  };
}

export function isPublicNow(item: Publication, now = Date.now()) {
  if (item.status === "published") return true;
  return item.status === "scheduled" && !!item.scheduledFor && Date.parse(item.scheduledFor) <= now;
}
