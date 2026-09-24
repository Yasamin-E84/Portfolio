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
    title: locale === "fa" ? "شرایط استفاده" : "Terms of use",
    description:
      locale === "fa"
        ? "شرایط استفاده از پورتفولیو، آثار بصری، نمونه‌های آموزشی و فرم تماس یاسمین سراقی."
        : "Use of Yasamin Soraghi’s portfolio, creative work, educational samples and contact form.",
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { en: "/en/terms", fa: "/fa/terms" },
    },
  };
}
export default async function Terms({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = copy[locale];
  const sections =
    locale === "en"
      ? [
          [
            "About this site",
            "This personal portfolio presents development projects, learning studies and creative work by Yasamin Soraghi. Project status notes describe the scope of each sample; prototypes and educational reconstructions are not offered as production services.",
          ],
          [
            "Creative work and third-party materials",
            "Original work remains with its rights holders. Logos, product imagery, music, brands and other third-party material shown in educational studies remain the property of their respective owners. Their appearance does not imply endorsement or a client relationship. Public repository code is subject to the license, if any, in that repository. Please ask before reusing creative work.",
          ],
          [
            "Enquiries and working together",
            "Submitting a message is an enquiry. It does not establish a contract, book a service, guarantee a response time or confirm availability. Any project scope, delivery terms and fees would be agreed separately. Please use the form respectfully and do not send spam, malicious content or confidential material that is unnecessary for your enquiry.",
          ],
          [
            "Links and availability",
            "External project demos and social services are controlled separately and may change or become unavailable. I make reasonable efforts to keep this portfolio accurate, but cannot promise uninterrupted availability or that every learning sample is suitable for another purpose.",
          ],
          [
            "Contact",
            "For questions about the site or a concern about an included work, contact foryxolabels@gmail.com. Public professional location: Tehran, Iran.",
          ],
        ]
      : [
          [
            "درباره سایت",
            "این پورتفولیوی شخصی، پروژه‌های توسعه، تمرین‌های آموزشی و آثار بصری یاسمین سراقی را معرفی می‌کند. وضعیت درج‌شده، محدوده هر نمونه را روشن می‌کند؛ نمونه‌های اولیه و بازسازی‌های آموزشی به‌عنوان سرویس تجاری آماده ارائه نمی‌شوند.",
          ],
          [
            "آثار و محتوای متعلق به دیگران",
            "حقوق آثار برای صاحبان آن‌ها محفوظ است. نشان‌ها، تصاویر محصول، موسیقی، نام‌های تجاری و سایر محتوای دیگران در تمرین‌های آموزشی متعلق به صاحبان اصلی است. حضور آن‌ها به معنی تأیید یا رابطه مشتری نیست. کد مخازن عمومی تابع مجوز همان مخزن، در صورت وجود، است. لطفاً پیش از استفاده مجدد از آثار بصری اجازه بگیرید.",
          ],
          [
            "درخواست همکاری",
            "ارسال پیام صرفاً یک درخواست ارتباط است؛ قرارداد، رزرو خدمت، تضمین زمان پاسخ یا تأیید ظرفیت همکاری محسوب نمی‌شود. محدوده پروژه، شرایط تحویل و هزینه‌ها جداگانه توافق می‌شوند. لطفاً از فرم محترمانه استفاده کنید و هرزنامه، محتوای مخرب یا اطلاعات محرمانه غیرضروری نفرستید.",
          ],
          [
            "لینک‌ها و دسترس‌پذیری",
            "دموهای بیرونی و شبکه‌های اجتماعی جداگانه مدیریت می‌شوند و ممکن است تغییر کنند یا در دسترس نباشند. برای دقیق نگه‌داشتن پورتفولیو تلاش می‌کنم، اما دسترسی بدون وقفه یا مناسب‌بودن هر تمرین برای کاربرد دیگر را تضمین نمی‌کنم.",
          ],
          [
            "تماس",
            "برای پرسش درباره سایت یا اثری که نمایش داده شده، به foryxolabels@gmail.com ایمیل بزنید. موقعیت حرفه‌ای عمومی: تهران، ایران.",
          ],
        ];
  return (
    <>
      <Header locale={locale} />
      <main id="main" className="legal-main">
        <Link className="text-link" href={`/${locale}`}>
          ← {c.back}
        </Link>
        <h1>{c.terms}</h1>
        <p className="legal-date">
          {pick(locale, "Updated 23 September 2026", "به‌روزرسانی: ۱ مهر ۱۴۰۵")}
        </p>
        {sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </main>
      <Footer locale={locale} />
    </>
  );
}
