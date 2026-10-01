import { z } from "zod";

const bilingual = z.object({ en: z.string().max(5000), fa: z.string().max(5000) });
const url = z.string().max(1000);
export const portfolioConfigSchema = z.object({
  profile: z.object({
    name: bilingual,
    role: bilingual,
    eyebrow: bilingual,
    headline: bilingual,
    headlineAccent: bilingual,
    intro: bilingual,
    availability: bilingual,
    location: bilingual,
    email: z.string().email().max(254),
    resumeUrl: url,
    portraitUrl: url,
  }),
  about: z.object({ title: bilingual, body: bilingual, body2: bilingual }),
  projects: z.array(z.object({
    id: z.string().min(1).max(80), name: z.string().max(120), imageUrl: url,
    repoUrl: url, liveUrl: url, summary: bilingual, description: bilingual,
    status: bilingual, role: bilingual, result: bilingual,
    tags: z.array(z.string().max(40)).max(15), featured: z.boolean(), visible: z.boolean(),
  })).max(50),
  artworks: z.array(z.object({
    id: z.string().min(1).max(80), imageUrl: url, title: bilingual, note: bilingual,
    category: z.string().max(80), visible: z.boolean(),
  })).max(100),
  motion: z.array(z.object({
    id: z.string().min(1).max(80), videoUrl: url, posterUrl: url, title: bilingual,
    note: bilingual, portrait: z.boolean(), visible: z.boolean(),
  })).max(100),
  settings: z.object({
    openToWork: z.boolean(), githubUrl: url, linkedinUrl: url, instagramUrl: url,
    seoTitle: bilingual, seoDescription: bilingual,
  }),
});

export type PortfolioConfig = z.infer<typeof portfolioConfigSchema>;
export function isPortfolioConfig(value: unknown): value is PortfolioConfig {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PortfolioConfig>;
  return !!item.profile && !!item.about && !!item.settings &&
    Array.isArray(item.projects) && item.projects.length <= 50 &&
    Array.isArray(item.artworks) && item.artworks.length <= 100 &&
    Array.isArray(item.motion) && item.motion.length <= 100 &&
    typeof item.profile.email === "string" && item.profile.email.length <= 254 &&
    typeof item.settings.openToWork === "boolean";
}
const b = (en: string, fa: string) => ({ en, fa });
const media = (path: string) => `/media/${path}`;

export const defaultPortfolioConfig: PortfolioConfig = {
  profile: {
    name: b("Yasamin Soraghi", "یاسمین سراقی"),
    role: b("Frontend Developer & Visual Creator", "توسعه‌دهنده فرانت‌اند و خالق آثار بصری"),
    eyebrow: b("A DEVELOPER’S MIND. AN ARTIST’S NOTEBOOK.", "ذهن یک توسعه‌دهنده؛ دفتر یک هنرمند"),
    headline: b("Built with logic.", "ساخته‌شده با منطق."),
    headlineAccent: b("Made with feeling.", "شکل‌گرفته با احساس."),
    intro: b("I build thoughtful React interfaces and visual stories, with growing full-stack experience.", "من رابط‌های فکرشده React و روایت‌های بصری می‌سازم و تجربه فول‌استک خودم را گسترش می‌دهم."),
    availability: b("Open to frontend internships, junior roles and selected freelance work.", "آماده همکاری در کارآموزی و موقعیت‌های جونیور فرانت‌اند و پروژه‌های منتخب فریلنسری."),
    location: b("Tehran, Iran · Remote friendly", "تهران، ایران · آماده همکاری ریموت"),
    email: "yasaminsoraghi84@gmail.com",
    resumeUrl: media("../cv/yasamin-soraghi.pdf"),
    portraitUrl: media("yasamin-portrait.webp"),
  },
  about: {
    title: b("Curiosity connects the dots.", "کنجکاوی، نقطه‌ها را به هم وصل می‌کند."),
    body: b("I’m Yasamin, a computer engineering student in Tehran. I started with HTML and CSS, then followed the questions into React, Next.js and server-side development.", "من یاسمینم، دانشجوی مهندسی کامپیوتر در تهران. از HTML و CSS شروع کردم و سؤال‌ها را تا React، Next.js و توسعه سمت سرور دنبال کردم."),
    body2: b("I care about accessible interfaces, clear systems and the visual details that make digital work memorable.", "برای رابط‌های دسترس‌پذیر، سیستم‌های روشن و جزئیات بصری‌ای که یک تجربه دیجیتال را ماندگار می‌کنند ارزش قائلم."),
  },
  projects: [
    { id:"reactkala", name:"ReactKala", imageUrl:media("projects/reactkala.webp"), repoUrl:"https://github.com/Yasamin-E84/ReactKala", liveUrl:"", summary:b("A storefront, built component by component.","یک فروشگاه؛ کامپوننت به کامپوننت."), description:b("Reusable product sections, API-fed carousels, mobile navigation and a map-based address picker, connected with React Context and a local mock API.","بخش‌های محصول قابل‌استفاده مجدد، اسلایدرهای متصل به API، منوی موبایل و انتخاب آدرس روی نقشه با React Context و API آزمایشی محلی."), status:b("In progress · local mock API","در حال توسعه · API آزمایشی محلی"), role:b("Frontend development","توسعه فرانت‌اند"), result:b("Reusable commerce UI system","سیستم رابط فروشگاهی قابل‌استفاده مجدد"), tags:["React","Tailwind","REST API"], featured:true, visible:true },
    { id:"digikala", name:"Digikala / API", imageUrl:media("projects/digikala.webp"), repoUrl:"https://github.com/Yasamin-E84/Digikala-API-Responsive", liveUrl:"https://yasamin-e84.github.io/Digikala-API-Responsive/", summary:b("From data to a responsive interface.","از داده تا رابطی واکنش‌گرا."), description:b("A responsive Persian interface with modular JavaScript, fetched JSON and reusable DOM rendering.","رابط فارسی واکنش‌گرا با جاوااسکریپت ماژولار، دریافت JSON و ساخت اجزای DOM."), status:b("Interface study · live demo","تمرین رابط کاربری · دموی آنلاین"), role:b("Frontend development","توسعه فرانت‌اند"), result:b("Responsive data-driven storefront","فروشگاه واکنش‌گرا و داده‌محور"), tags:["JavaScript","Tailwind","JSON"], featured:false, visible:true },
    { id:"golestan", name:"Golestan", imageUrl:media("projects/golestan.webp"), repoUrl:"https://github.com/Yasamin-E84/Golestan", liveUrl:"https://yasamin-e84.github.io/Golestan/", summary:b("A familiar brand, reconstructed in React.","بازسازی یک برند آشنا با React."), description:b("Reusable components and responsive RTL layouts for a Persian brand-page reconstruction.","کامپوننت‌های قابل‌استفاده مجدد و چیدمان راست‌به‌چپ واکنش‌گرا برای بازسازی صفحه یک برند ایرانی."), status:b("Educational interface study","تمرین آموزشی رابط کاربری"), role:b("Frontend development","توسعه فرانت‌اند"), result:b("Reusable RTL component system","سیستم کامپوننت راست‌به‌چپ"), tags:["React","Tailwind","RTL"], featured:false, visible:true },
  ],
  artworks: [
    ["illustrator-final","A world of my own","جهانی از آنِ من","Illustrator · final course project","ایلاستریتور · پروژه نهایی دوره","Illustrator"],
    ["vector-fox","In good company","همراهی کوچک","Illustrator · vector study","ایلاستریتور · تمرین وکتور","Illustrator"],
    ["photoshop-cloud","Somewhere between worlds","جایی میان جهان‌ها","Photoshop · compositing study","فتوشاپ · تمرین ترکیب تصویر","Photoshop"],
    ["vector-dragon","A little imagination","کمی خیال","Illustrator · character study","ایلاستریتور · تمرین شخصیت","Illustrator"],
    ["photoshop-type-portrait","A portrait in words","چهره‌ای از واژه‌ها","Photoshop · typographic portrait","فتوشاپ · پرتره تایپوگرافیک","Photoshop"],
    ["vector-mandala","Finding a rhythm","پیدا کردن ریتم","Illustrator · pattern study","ایلاستریتور · تمرین الگو","Illustrator"],
    ["photoshop-rwby-war","Move forward","حرکت رو به جلو","Photoshop · cinematic poster","فتوشاپ · پوستر سینمایی","Photoshop"],
    ["photoshop-retouch","Portrait retouch","رتوش پرتره","Photoshop · beauty retouch","فتوشاپ · رتوش چهره","Photoshop"],
    ["photoshop-dance","Just feel mighty","پوستر حرکت","Photoshop · campaign banner","فتوشاپ · بنر تبلیغاتی","Photoshop"],
    ["illustrator-blend","World Graphics Day","روز جهانی گرافیک","Illustrator · Persian poster","ایلاستریتور · پوستر فارسی","Illustrator"],
    ["illustrator-knife","Ink and edge","جوهر و لبه","Illustrator · emblem study","ایلاستریتور · تمرین نشان","Illustrator"],
    ["illustrator-rocket","Launch study","تمرین پرتاب","Illustrator · ink illustration","ایلاستریتور · تصویرسازی جوهری","Illustrator"],
    ["logo-glam-touch","Glam Touch","Glam Touch","Illustrator · logo and sign mockup","ایلاستریتور · لوگو و ماکاپ تابلو","Branding"],
  ].map(([id,en,fa,nEn,nFa,category]) => ({ id, imageUrl:media(`${id}.webp`), title:b(en,fa), note:b(nEn,nFa), category, visible:true })),
  motion: [
    ["social-network","Social Network","Social Network","After Effects · 8 sec · motion study","افتر افکتس · ۸ ثانیه · تمرین موشن",false],
    ["digikala","Digikala","Digikala","After Effects · promotional motion","افتر افکتس · موشن تبلیغاتی",false],
    ["bank-mellat","Bank Mellat","بانک ملت","After Effects · logo motion","افتر افکتس · لوگوموشن",true],
    ["pepsi","Pepsi","Pepsi","After Effects · brand animation","افتر افکتس · انیمیشن برند",true],
    ["sam-freeze","Sam Freeze","Sam Freeze","After Effects · freeze-frame study","افتر افکتس · تمرین فریز فریم",false],
    ["walkman","Walkman","Walkman","After Effects · product animation","افتر افکتس · انیمیشن محصول",true],
    ["snapp-food","Snapp Food","Snapp Food","After Effects · brand study","افتر افکتس · تمرین برند",false],
    ["watch","Watch","Watch","After Effects · product animation","افتر افکتس · انیمیشن محصول",false],
    ["milky-way","Milky Way","Milky Way","After Effects · visual experiment","افتر افکتس · تجربه بصری",false],
  ].map(([id,en,fa,nEn,nFa,portrait]) => ({ id:id as string, videoUrl:media(`video/${id}.mp4`), posterUrl:media(`video/${id}.webp`), title:b(en as string,fa as string), note:b(nEn as string,nFa as string), portrait:portrait as boolean, visible:true })),
  settings: {
    openToWork:true,
    githubUrl:"https://github.com/Yasamin-E84",
    linkedinUrl:"",
    instagramUrl:"",
    seoTitle:b("Yasamin Soraghi — Frontend Developer & Visual Creator","یاسمین سراقی — توسعه‌دهنده فرانت‌اند و خالق آثار بصری"),
    seoDescription:b("React and Next.js projects, visual design, motion and video editing by Yasamin Soraghi.","پروژه‌های React و Next.js، طراحی بصری، موشن و تدوین یاسمین سراقی."),
  },
};

export function resolvePortfolioUrl(value: string, basePath = "") {
  if (!value || /^(https?:|data:|blob:)/.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${basePath}${normalized}`;
}
