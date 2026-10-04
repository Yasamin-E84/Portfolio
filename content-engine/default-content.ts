import type { Publication } from "./types";

const now = 1790985600;
export const defaultPublications: Publication[] = [
  {
    id: "welcome-to-the-field-notes", type: "signature-update", slug: "welcome-to-the-field-notes",
    title: { en: "The portfolio is becoming a field notebook", fa: "پورتفولیو در حال تبدیل شدن به دفتر پژوهش است" },
    shortDescription: { en: "A new publication layer for project notes, frontend practice and carefully sourced technology updates.", fa: "لایه‌ای تازه برای یادداشت‌های پروژه، تجربه‌های فرانت‌اند و خبرهای دقیق و منبع‌دار فناوری." },
    answer: { en: "Yasamin’s portfolio now includes a bilingual technology journal alongside its development and visual work.", fa: "پورتفولیوی یاسمین حالا در کنار نمونه‌کارهای توسعه و طراحی، یک مجله فناوری دوزبانه هم دارد." },
    content: { en: "This space records what I build, what I learn and the decisions behind the interface. It will grow through useful case studies, concise tutorials and selected technology updates that matter to working developers.", fa: "این فضا چیزهایی را که می‌سازم، یاد می‌گیرم و تصمیم‌هایی را که پشت رابط‌ها می‌گیرم ثبت می‌کند. این دفتر با مطالعه‌های موردی کاربردی، آموزش‌های کوتاه و خبرهای منتخب فناوری برای توسعه‌دهندگان رشد خواهد کرد." },
    examples: { en: "Expect project launches, architecture notes, performance lessons and practical React or Next.js patterns.", fa: "از معرفی پروژه‌ها و یادداشت‌های معماری تا درس‌های عملکرد و الگوهای کاربردی React و Next.js را اینجا خواهید دید." },
    expertOpinion: { en: "A portfolio is stronger when it shows how decisions are made, not only the final screen. This journal makes that thinking visible.", fa: "پورتفولیو زمانی قوی‌تر است که شیوه تصمیم‌گیری را هم نشان دهد، نه فقط تصویر نهایی را. این مجله آن روند فکری را قابل مشاهده می‌کند." },
    coverImage: "/og.png", category: "Career", tags: ["Portfolio", "Frontend", "Learning"], publishDate: "2026-10-03", scheduledFor: "", featured: true,
    seoTitle: { en: "Yasamin Soraghi’s frontend field notes", fa: "دفتر یادداشت‌های فرانت‌اند یاسمین سراقی" },
    seoDescription: { en: "Yasamin Soraghi introduces a bilingual journal for frontend case studies, technology notes and project updates.", fa: "معرفی مجله دوزبانه یاسمین سراقی برای مطالعه‌های موردی فرانت‌اند، یادداشت‌های فناوری و به‌روزرسانی پروژه‌ها." },
    socialCaption: { en: "My portfolio is becoming a field notebook: projects, frontend lessons and technology notes in English and Persian.", fa: "پورتفولیوی من در حال تبدیل شدن به یک دفتر پژوهش است؛ پروژه‌ها، درس‌های فرانت‌اند و یادداشت‌های فناوری به فارسی و انگلیسی." },
    schemaData: {}, author: "Yasamin Soraghi", readingTime: 2, status: "published",
    faq: [{ question: { en: "What will be published here?", fa: "چه مطالبی اینجا منتشر می‌شود؟" }, answer: { en: "Project case studies, frontend guides, selected technology news and major updates from Yasamin.", fa: "مطالعه‌های موردی پروژه، راهنماهای فرانت‌اند، خبرهای منتخب فناوری و به‌روزرسانی‌های مهم یاسمین." } }],
    sources: [], createdAt: now, updatedAt: now,
  },
  {
    id: "react-performance-principles", type: "article", slug: "react-performance-principles",
    title: { en: "React performance starts with architecture", fa: "عملکرد React از معماری شروع می‌شود" },
    shortDescription: { en: "A practical checklist for making React interfaces faster without premature optimization.", fa: "چک‌لیستی کاربردی برای سریع‌تر کردن رابط‌های React بدون بهینه‌سازی زودهنگام." },
    answer: { en: "The best React performance work starts by measuring real bottlenecks, keeping state close to where it is used, and reducing unnecessary client-side JavaScript.", fa: "بهترین مسیر بهبود عملکرد React با اندازه‌گیری گلوگاه واقعی، نزدیک نگه داشتن state به محل مصرف و کاهش جاوااسکریپت غیرضروری سمت کاربر آغاز می‌شود." },
    content: { en: "Begin with the user-visible delay: loading, interaction or rendering. Use the browser profiler and Core Web Vitals before changing code. Split pages by responsibility, prefer server-rendered output for static content, and make client components earn their bundle cost. Memoization is useful after measurement; it is not a substitute for a clear data flow.", fa: "از تأخیری شروع کنید که کاربر می‌بیند: بارگذاری، تعامل یا رندر. پیش از تغییر کد از profiler مرورگر و Core Web Vitals استفاده کنید. صفحه‌ها را بر اساس مسئولیت تقسیم کنید، برای محتوای ثابت خروجی سرور را ترجیح دهید و فقط کامپوننت‌هایی را client کنید که واقعاً به تعامل نیاز دارند. memoization پس از اندازه‌گیری مفید است، اما جای جریان داده روشن را نمی‌گیرد." },
    examples: { en: "Move a search query into the smallest interactive component, lazy-load a media-heavy gallery, and use stable list keys. Recheck the same user journey after each change.", fa: "عبارت جست‌وجو را در کوچک‌ترین کامپوننت تعاملی نگه دارید، گالری سنگین را lazy-load کنید و برای فهرست‌ها key پایدار به کار ببرید. پس از هر تغییر همان مسیر کاربر را دوباره اندازه بگیرید." },
    expertOpinion: { en: "Fast interfaces usually come from fewer responsibilities per component and less work shipped to the browser. A profiler should settle optimization debates.", fa: "رابط‌های سریع معمولاً حاصل مسئولیت کمتر در هر کامپوننت و کار کمتر در مرورگرند. اختلاف نظر درباره بهینه‌سازی را باید profiler حل کند." },
    coverImage: "/media/projects/reactkala.webp", category: "Frontend", tags: ["React", "Performance", "Architecture"], publishDate: "2026-10-03", scheduledFor: "", featured: true,
    seoTitle: { en: "React performance practices: an architecture-first guide", fa: "روش‌های بهبود عملکرد React با رویکرد معماری" },
    seoDescription: { en: "A practical React performance guide covering measurement, state placement, client JavaScript and focused optimization.", fa: "راهنمای کاربردی عملکرد React درباره اندازه‌گیری، جای‌گذاری state، جاوااسکریپت سمت کاربر و بهینه‌سازی هدفمند." },
    socialCaption: { en: "React performance begins before memoization. I wrote an architecture-first checklist for measuring and fixing the work users actually feel.", fa: "عملکرد React پیش از memoization آغاز می‌شود. این چک‌لیست با معماری و اندازه‌گیری کاری شروع می‌کند که کاربر واقعاً حس می‌کند." },
    schemaData: {}, author: "Yasamin Soraghi", readingTime: 5, status: "published",
    faq: [
      { question: { en: "Should every React component use memo?", fa: "آیا همه کامپوننت‌های React باید memo شوند؟" }, answer: { en: "No. Measure first and use memoization where repeated rendering is demonstrably expensive.", fa: "خیر. ابتدا اندازه‌گیری کنید و فقط جایی از memoization استفاده کنید که رندر تکراری واقعاً پرهزینه است." } },
      { question: { en: "What should I optimize first?", fa: "اول چه چیزی را بهینه کنم؟" }, answer: { en: "Optimize the slowest user-visible journey identified by field data or a browser profile.", fa: "کندترین مسیر قابل مشاهده برای کاربر را که با داده واقعی یا profiler مشخص شده است بهینه کنید." } },
    ],
    sources: [
      { title: "React documentation — Performance", url: "https://react.dev/learn/render-and-commit" },
      { title: "web.dev — Core Web Vitals", url: "https://web.dev/articles/vitals" },
    ], createdAt: now, updatedAt: now,
  },
];
