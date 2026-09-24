import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, copy, pick } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "fa" ? "حریم خصوصی" : "Privacy",
    description:
      locale === "fa"
        ? "نحوه استفاده از پیام‌های تماس، ترجیحات مرورگر و آمار بازدید در وب‌سایت یاسمین سراقی."
        : "How Yasamin Soraghi’s portfolio handles contact messages, browser preferences and optional page-view analytics.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { en: "/en/privacy", fa: "/fa/privacy" },
    },
  };
}
export default async function Privacy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = copy[locale];
  return (
    <>
      <Header locale={locale} />
      <main id="main" className="legal-main">
        <Link className="text-link" href={`/${locale}`}>
          ← {c.back}
        </Link>
        <h1>{c.privacy}</h1>
        <p className="legal-date">
          {pick(locale, "Updated 23 September 2026", "به‌روزرسانی: ۱ مهر ۱۴۰۵")}
        </p>
        <p>
          {pick(
            locale,
            "This is the personal portfolio of Yasamin Soraghi, based in Tehran, Iran. For privacy questions or a request to remove a message, email foryxolabels@gmail.com.",
            "این وب‌سایت پورتفولیوی شخصی یاسمین سراقی در تهران، ایران است. برای پرسش درباره حریم خصوصی یا درخواست حذف پیام، به foryxolabels@gmail.com ایمیل بزنید.",
          )}
        </p>
        <h2>
          {pick(
            locale,
            "Messages you choose to send",
            "پیام‌هایی که ارسال می‌کنید",
          )}
        </h2>
        <p>
          {pick(
            locale,
            "The contact form collects your name, email address, message and selected language to let me read and respond to your enquiry. Messages are stored in a private database, not displayed publicly. A successful form response confirms storage; it does not claim that an email was delivered. Please do not send sensitive personal, medical or financial information.",
            "فرم تماس نام، ایمیل، متن پیام و زبان انتخابی شما را برای مطالعه و پاسخ به درخواستتان دریافت می‌کند. پیام‌ها در پایگاه داده خصوصی ذخیره می‌شوند و نمایش عمومی ندارند. پاسخ موفق فرم به معنی ذخیره پیام است، نه تأیید تحویل ایمیل. لطفاً اطلاعات حساس شخصی، پزشکی یا مالی ارسال نکنید.",
          )}
        </p>
        <p>
          {pick(
            locale,
            "Messages older than 90 days are removed when the next message is saved. If the site receives no new messages, older records may remain until that cleanup or a requested deletion. Any correspondence you send directly by email is handled separately in that email service.",
            "پیام‌های قدیمی‌تر از ۹۰ روز هنگام ذخیره پیام بعدی حذف می‌شوند. اگر پیام جدیدی نرسد، رکوردهای قدیمی ممکن است تا اجرای پاک‌سازی یا درخواست حذف باقی بمانند. مکاتباتی که مستقیم با ایمیل می‌فرستید، جداگانه در سرویس ایمیل مدیریت می‌شوند.",
          )}
        </p>
        <h2>
          {pick(
            locale,
            "Essential preferences and abuse prevention",
            "ترجیحات ضروری و پیشگیری از سوءاستفاده",
          )}
        </h2>
        <p>
          {pick(
            locale,
            "Your browser stores your theme, language and analytics choice locally. A first-party language cookie remembers the selected language for up to one year; session storage avoids repeating the solar intro in the same tab. The contact endpoint temporarily stores a salted hash of your network address to limit repeated submissions. Raw IP addresses are not saved in the contact database. Rate-limit records expire after 15 minutes and are removed during the next contact attempt.",
            "مرورگر شما تم، زبان و انتخاب آمارگیری را به‌صورت محلی نگه می‌دارد. یک کوکی خود سایت زبان را تا یک سال به خاطر می‌سپارد و حافظه نشست از تکرار انیمیشن آغازین در همان تب جلوگیری می‌کند. API تماس برای محدود کردن ارسال مکرر، هش نمک‌دار آدرس شبکه را موقتاً ذخیره می‌کند. IP خام در پایگاه داده تماس ذخیره نمی‌شود. رکوردهای محدودسازی پس از ۱۵ دقیقه منقضی و در تلاش بعدی تماس حذف می‌شوند.",
          )}
        </p>
        <h2>
          {pick(
            locale,
            "Optional, minimal analytics",
            "آمارگیری اختیاری و محدود",
          )}
        </h2>
        <p>
          {pick(
            locale,
            "Analytics stays off unless you choose “Allow analytics.” When enabled, the site increments a daily count for the page path and language. It does not assign visitor IDs or store names, referrers, IP addresses, or your contact message in analytics. Counts older than 365 days are removed on the next analytics event. Use “Cookie preferences” in the footer to change your choice at any time; choosing “Essential only” stops future page-view events.",
            "آمارگیری تا انتخاب «اجازه آمارگیری» خاموش است. پس از اجازه، شمارنده روزانه مسیر صفحه و زبان افزایش می‌یابد. شناسه بازدیدکننده ساخته نمی‌شود و نام، ارجاع‌دهنده، IP یا متن پیام شما در آمار ذخیره نمی‌شود. شمارنده‌های قدیمی‌تر از ۳۶۵ روز در رخداد بعدی پاک می‌شوند. هر زمان می‌توانید از «تنظیمات کوکی» در پایین صفحه انتخابتان را تغییر دهید؛ «فقط موارد ضروری» ثبت بازدیدهای بعدی را متوقف می‌کند.",
          )}
        </p>
        <h2>
          {pick(
            locale,
            "Hosting and external links",
            "میزبانی و لینک‌های بیرونی",
          )}
        </h2>
        <p>
          {pick(
            locale,
            "The site runs on Cloudflare infrastructure. Hosting providers process requests and may keep operational or security logs under their own policies. Fonts, artwork and videos are served from this site. Following GitHub, Instagram, Telegram, WhatsApp or project-demo links takes you to services with their own privacy practices.",
            "سایت روی زیرساخت Cloudflare میزبانی می‌شود. میزبان‌ها درخواست‌ها را پردازش می‌کنند و ممکن است طبق سیاست خود گزارش‌های عملیاتی یا امنیتی نگه دارند. فونت، تصاویر و ویدئوها از خود سایت ارائه می‌شوند. با ورود به GitHub، اینستاگرام، تلگرام، واتس‌اپ یا دموی پروژه‌ها، سیاست حریم خصوصی همان سرویس‌ها اعمال می‌شود.",
          )}
        </p>
        <h2>{pick(locale, "Your choices", "انتخاب‌های شما")}</h2>
        <p>
          {pick(
            locale,
            "You can use the portfolio without analytics, clear saved preferences in your browser, contact me without the form, or request access to or deletion of a message you sent. I may need enough information to identify your message before acting on a request. This notice may change as the portfolio changes.",
            "می‌توانید بدون آمارگیری از سایت استفاده کنید، تنظیمات ذخیره‌شده مرورگر را پاک کنید، بدون فرم با من تماس بگیرید یا دسترسی و حذف پیام خود را درخواست کنید. برای رسیدگی به درخواست ممکن است اطلاعات کافی برای شناسایی پیام لازم باشد. این اطلاعیه ممکن است هم‌زمان با تغییر سایت به‌روزرسانی شود.",
          )}
        </p>
      </main>
      <Footer locale={locale} />
    </>
  );
}
