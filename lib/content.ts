export type Locale = "en" | "fa";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const publicPath = (path: string) =>
  `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const isLocale = (value: string): value is Locale =>
  value === "en" || value === "fa";
export const pick = (locale: Locale, en: string, fa: string) =>
  locale === "fa" ? fa : en;
export const planets = [
  {
    id: "frontend",
    en: "Frontend",
    fa: "فرانت‌اند",
    color: "#91bce4",
    tag: ["React", "Next.js", "TypeScript", "Tailwind", "TanStack Query"],
    enText:
      "Interfaces built with care. Responsive layouts, reusable components, API integration and a place for both Persian and English.",
    faText:
      "رابط‌هایی با توجه به جزئیات؛ چیدمان واکنش‌گرا، کامپوننت‌های قابل‌استفاده مجدد، اتصال به API و پشتیبانی از فارسی و انگلیسی.",
    levelEn: "My main practice",
    levelFa: "حوزه اصلی فعالیت من",
    target: "projects",
  },
  {
    id: "backend",
    en: "Backend",
    fa: "بک‌اند",
    color: "#c39cdc",
    tag: ["Node.js", "Express", "REST APIs", "Validation"],
    enText:
      "Growing beyond the interface: server-side logic, validated requests and clear error handling. This portfolio includes a real contact endpoint.",
    faText:
      "در حال گسترش مهارت‌هایم فراتر از رابط کاربری: منطق سمت سرور، اعتبارسنجی درخواست‌ها و مدیریت خطا. فرم تماس این سایت به یک API واقعی متصل است.",
    levelEn: "Building my foundation",
    levelFa: "در حال تقویت پایه‌ها",
    target: "contact",
  },
  {
    id: "database",
    en: "Database",
    fa: "پایگاه داده",
    color: "#a2c9a3",
    tag: ["MongoDB", "Mongoose", "CRUD", "SQLite"],
    enText:
      "Learning to model and connect data, from schemas and CRUD to the small database behind this portfolio’s contact system.",
    faText:
      "مدل‌سازی و اتصال داده‌ها؛ از آشنایی با اسکیما و عملیات CRUD تا پایگاه داده کوچک سیستم تماس این پورتفولیو.",
    levelEn: "Practical fundamentals",
    levelFa: "مبانی کاربردی",
    target: "projects",
  },
  {
    id: "seo",
    en: "SEO",
    fa: "سئو",
    color: "#e5ae73",
    tag: ["Metadata", "Semantic HTML", "Sitemaps", "Performance"],
    enText:
      "Making good work discoverable with clear content structure, localized metadata, accessible markup and thoughtfully sized images.",
    faText:
      "کمک به دیده‌شدن کار خوب با ساختار محتوای روشن، متادیتای دوزبانه، HTML معنایی، دسترس‌پذیری و تصاویر بهینه.",
    levelEn: "Technical SEO in practice",
    levelFa: "سئوی فنی در عمل",
    target: "projects",
  },
  {
    id: "visual",
    en: "Photoshop + Illustrator",
    fa: "فتوشاپ + ایلاستریتور",
    color: "#db90b0",
    tag: ["Compositing", "Vector art", "Retouching", "Illustration"],
    enText:
      "A second way of thinking. Vector illustrations, photo compositions and visual studies made in Photoshop and Illustrator.",
    faText:
      "راهی دیگر برای فکر کردن؛ تصویرسازی وکتور، ترکیب تصاویر و تمرین‌های بصری در فتوشاپ و ایلاستریتور.",
    levelEn: "The visual side of my work",
    levelFa: "بخش بصری کارهای من",
    target: "visual",
  },
  {
    id: "motion",
    en: "Motion Graphics",
    fa: "موشن گرافیک",
    color: "#9d96d9",
    tag: ["After Effects", "Keyframes", "Masking", "Composition"],
    enText:
      "Giving images a sense of time. Product animations, short promotional studies and motion experiments in After Effects.",
    faText:
      "جان‌دادن به تصویر در گذر زمان؛ انیمیشن محصول، تمرین‌های تبلیغاتی کوتاه و تجربه‌های موشن در افتر افکتس.",
    levelEn: "Selected motion studies",
    levelFa: "منتخب تمرین‌های موشن",
    target: "motion",
  },
  {
    id: "editing",
    en: "Video Editing",
    fa: "تدوین ویدئو",
    color: "#77c8cc",
    tag: ["CapCut", "Reels", "Captions", "Pacing"],
    enText:
      "Short-form stories shaped through rhythm, captions and transitions. Social content editing for CodeOceans and Dr. Soraghi.",
    faText:
      "داستان‌های کوتاه با ریتم، زیرنویس و ترنزیشن؛ تدوین محتوای شبکه‌های اجتماعی برای CodeOceans و دکتر سراقی.",
    levelEn: "Social & short-form",
    levelFa: "محتوای کوتاه و اجتماعی",
    target: "editing",
  },
] as const;
export const copy = {
  en: {
    name: "Yasamin Soraghi",
    role: "Full-stack Developer & Visual Creator",
    nav: ["My universe", "All works", "About me", "Say hello"],
    eyebrow: "A DEVELOPER’S MIND. AN ARTIST’S NOTEBOOK.",
    title: "Built with logic.",
    title2: "Made with feeling.",
    intro:
      "I’m Yasamin, a frontend-focused developer exploring the space between thoughtful interfaces and visual storytelling.",
    explore: "Explore my work",
    contact: "Let’s talk",
    solarNote: "Seven worlds. One curious mind.",
    solarHint: "Choose a planet to explore",
    pause: "Pause orbit",
    resume: "Resume orbit",
    workEyebrow: "01 / THE WORKBENCH",
    workTitle: "Ideas, brought into the world.",
    workIntro:
      "A few pages from my development notebook. Real projects, experiments, and things I learned along the way.",
    source: "Source code",
    demo: "View project",
    visualEyebrow: "02 / THE SKETCHBOOK",
    visualTitle: "Away from the code editor.",
    visualIntro:
      "Illustration, composites and experiments in seeing. Selected work in Photoshop and Illustrator.",
    motionEyebrow: "03 / IN MOTION",
    motionTitle: "A still image is just the beginning.",
    motionIntro:
      "Selected After Effects studies. Press play to see the work; videos load only when you choose one.",
    editingTitle: "Cut to the story.",
    editingIntro:
      "Social edits for CodeOceans and Dr. Soraghi. My role: video editing, pacing and captions.",
    aboutEyebrow: "04 / A NOTE ABOUT ME",
    aboutTitle: "Curiosity connects the dots.",
    aboutText:
      "I’m Yasamin, a computer engineering student in Tehran. I started with HTML and CSS, and kept following the questions: how does a component work, what happens on the server, how can an interface feel better?",
    aboutText2:
      "Today my strongest focus is frontend development with React. I’m building my Next.js and backend foundations alongside a creative practice in illustration, motion and video. I like work that gives equal attention to how something works and how it feels.",
    cv: "View / download CV",
    experience: "Along the way",
    experienceTitle: "Frontend development internship",
    experienceText: "Tarzank · 2026 — React, Next.js and TanStack Query.",
    educationTitle: "B.Sc. Computer Engineering",
    educationText: "Science and Research Branch · 2024–present",
    courses: "Learning, continuously",
    coursesText:
      "React, Next.js, server-side development with Node.js, UI/UX and Web Design I–III. Tehran Institute of Technology courses include UI/UX (95/100) and web design (100/100), as recorded in my CV.",
    contactEyebrow: "05 / AN OPEN PAGE",
    contactTitle: "What are you imagining?",
    contactIntro:
      "Have a project, an interesting idea, or just a question? I’d like to hear it.",
    location: "Based in Tehran, Iran",
    nameLabel: "Your name",
    emailLabel: "Your email",
    messageLabel: "A little about your idea",
    send: "Send message",
    sending: "Sending…",
    formNote:
      "Your message is saved privately for Yasamin. Prefer email? Use the address alongside the form.",
    privacy: "Privacy",
    terms: "Terms",
    cookieSettings: "Cookie preferences",
    footer: "Made with code, curiosity, and a few pencil marks.",
    rights: "Yasamin Soraghi",
    back: "Back to my universe",
    thankTitle: "A new connection.",
    thankText:
      "Your message was saved successfully. Thank you for taking the time to write. You can also reach me directly by email.",
    lostTitle: "A little outside the orbit.",
    lostText:
      "This page seems to have drifted away. Let’s find something worth exploring.",
    cookieTitle: "A small note on privacy",
    cookieText:
      "I use local storage to remember your theme and language. With your permission, I also count page views without visitor IDs. Your choice is yours.",
    accept: "Allow analytics",
    reject: "Essential only",
    close: "Close",
    viewWork: "Explore this work",
    active: "Active planet",
    imageOpen: "View artwork",
    play: "Play video",
    stop: "Close video",
  },
  fa: {
    name: "یاسمین سراقی",
    role: "توسعه‌دهنده فول‌استک و خالق آثار بصری",
    nav: ["جهان من", "همه کارها", "درباره من", "گفت‌وگو کنیم"],
    eyebrow: "ذهن یک توسعه‌دهنده؛ دفتر یک هنرمند",
    title: "ساخته‌شده با منطق.",
    title2: "شکل‌گرفته با احساس.",
    intro:
      "من یاسمینم؛ توسعه‌دهنده‌ای با تمرکز بر فرانت‌اند که میان رابط‌های فکرشده و روایت بصری، مسیر خودش را پیدا می‌کند.",
    explore: "دیدن کارهای من",
    contact: "گفت‌وگو کنیم",
    solarNote: "هفت جهان؛ یک ذهن کنجکاو.",
    solarHint: "یک سیاره را برای آشنایی بیشتر انتخاب کنید",
    pause: "توقف گردش",
    resume: "ادامه گردش",
    workEyebrow: "۰۱ / میز کار",
    workTitle: "ایده‌هایی که شکل گرفته‌اند.",
    workIntro:
      "چند صفحه از دفتر توسعه من؛ پروژه‌های واقعی، تجربه‌ها و چیزهایی که در مسیر یاد گرفته‌ام.",
    source: "کد پروژه",
    demo: "دیدن پروژه",
    visualEyebrow: "۰۲ / دفتر طراحی",
    visualTitle: "بیرون از ویرایشگر کد.",
    visualIntro:
      "تصویرسازی، ترکیب تصاویر و تمرین‌هایی برای بهتر دیدن؛ منتخب کارهای فتوشاپ و ایلاستریتور.",
    motionEyebrow: "۰۳ / در حرکت",
    motionTitle: "یک تصویر ثابت، فقط آغاز ماجراست.",
    motionIntro:
      "منتخب تمرین‌های افتر افکتس. ویدئوها فقط پس از انتخاب شما بارگذاری می‌شوند.",
    editingTitle: "روایت، در چند برش.",
    editingIntro:
      "تدوین محتوای اجتماعی برای CodeOceans و دکتر سراقی؛ نقش من: تدوین ویدئو، تنظیم ریتم و زیرنویس.",
    aboutEyebrow: "۰۴ / یادداشتی درباره من",
    aboutTitle: "کنجکاوی، نقطه‌ها را به هم وصل می‌کند.",
    aboutText:
      "من یاسمینم، دانشجوی مهندسی کامپیوتر در تهران. از HTML و CSS شروع کردم و سؤال‌ها را دنبال کردم: یک کامپوننت چطور کار می‌کند؟ در سرور چه می‌گذرد؟ چطور یک رابط کاربری حس بهتری می‌دهد؟",
    aboutText2:
      "امروز تمرکز اصلی‌ام توسعه فرانت‌اند با React است. در کنار تصویرسازی، موشن و تدوین، مهارت‌های Next.js و بک‌اند را تقویت می‌کنم. دوست دارم هم به نحوه کارکردن یک محصول توجه کنم و هم به حسی که منتقل می‌کند.",
    cv: "مشاهده / دانلود رزومه",
    experience: "در طول مسیر",
    experienceTitle: "کارآموزی توسعه فرانت‌اند",
    experienceText: "تارزنک · ۱۴۰۵ — کار با React، Next.js و TanStack Query.",
    educationTitle: "کارشناسی مهندسی کامپیوتر",
    educationText: "واحد علوم و تحقیقات · از ۱۴۰۳ تاکنون",
    courses: "یادگیری، پیوسته",
    coursesText:
      "React، Next.js، توسعه سمت سرور با Node.js، UI/UX و طراحی وب ۱ تا ۳. مطابق رزومه: دوره UI/UX مجتمع فنی تهران با نمره ۹۵ و طراحی وب با نمره ۱۰۰.",
    contactEyebrow: "۰۵ / یک صفحه باز",
    contactTitle: "چه چیزی در ذهن دارید؟",
    contactIntro:
      "پروژه‌ای دارید، ایده‌ای جالب یا فقط یک سؤال؟ خوشحال می‌شوم بشنوم.",
    location: "تهران، ایران",
    nameLabel: "نام شما",
    emailLabel: "ایمیل شما",
    messageLabel: "کمی درباره ایده‌تان",
    send: "ارسال پیام",
    sending: "در حال ارسال…",
    formNote:
      "پیام شما به‌صورت خصوصی برای یاسمین ذخیره می‌شود. برای ارتباط مستقیم می‌توانید از ایمیل کنار فرم استفاده کنید.",
    privacy: "حریم خصوصی",
    terms: "شرایط استفاده",
    cookieSettings: "تنظیمات کوکی",
    footer: "ساخته‌شده با کد، کنجکاوی و چند خط مداد.",
    rights: "یاسمین سراقی",
    back: "بازگشت به جهان من",
    thankTitle: "آغاز یک ارتباط.",
    thankText:
      "پیام شما با موفقیت ذخیره شد. ممنون که وقت گذاشتید و نوشتید. از طریق ایمیل هم می‌توانید مستقیم با من در ارتباط باشید.",
    lostTitle: "کمی خارج از مدار.",
    lostText:
      "انگار این صفحه از مدارش خارج شده است. بیایید مسیر تازه‌ای پیدا کنیم.",
    cookieTitle: "یادداشتی درباره حریم خصوصی",
    cookieText:
      "برای به‌خاطر سپردن زبان و تم از حافظه محلی مرورگر استفاده می‌کنم. با اجازه شما، تعداد بازدید صفحات را هم بدون شناسه بازدیدکننده می‌شمارم. انتخاب با شماست.",
    accept: "اجازه آمارگیری",
    reject: "فقط موارد ضروری",
    close: "بستن",
    viewWork: "دیدن این کارها",
    active: "سیاره فعال",
    imageOpen: "مشاهده اثر",
    play: "پخش ویدئو",
    stop: "بستن ویدئو",
  },
} as const;
