"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { copy, type Locale } from "@/lib/content";
export function Contact({ locale }: { locale: Locale }) {
  const c = copy[locale],
    router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [fields, setFields] = useState<Record<string, string[]>>({});
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget,
      data = new FormData(form);
    setBusy(true);
    setError("");
    setFields({});
    if (process.env.NEXT_PUBLIC_STATIC_SITE === "1") {
      const subject = encodeURIComponent(
        `Portfolio message from ${String(data.get("name") || "")}`,
      );
      const body = encodeURIComponent(
        `${String(data.get("message") || "")}\n\nFrom: ${String(data.get("email") || "")}`,
      );
      window.location.href = `mailto:foryxolabels@gmail.com?subject=${subject}&body=${body}`;
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website") || "",
          locale,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(
          result.message ||
            (locale === "en"
              ? "Please try again or send an email."
              : "دوباره تلاش کنید یا ایمیل بفرستید."),
        );
        setFields(result.fieldErrors || {});
        return;
      }
      if (result.status === "saved") {
        form.reset();
        router.push(`/${locale}/thank-you`);
      }
    } catch {
      setError(
        locale === "en"
          ? "The connection was interrupted. Your message is still here; please retry or email me."
          : "ارتباط قطع شد. متن پیام شما حفظ شده؛ دوباره تلاش کنید یا ایمیل بفرستید.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="contact-form" onSubmit={submit} aria-busy={busy}>
      <div className="form-row">
        {(["name", "email"] as const).map((field) => (
          <div className="field" key={field}>
            <label htmlFor={field}>
              {field === "name" ? c.nameLabel : c.emailLabel}
            </label>
            <input
              id={field}
              name={field}
              type={field === "email" ? "email" : "text"}
              autoComplete={field === "email" ? "email" : "name"}
              required
              minLength={field === "name" ? 2 : undefined}
              maxLength={field === "name" ? 100 : 254}
              dir={field === "email" ? "ltr" : undefined}
              aria-invalid={!!fields[field]}
              aria-describedby={fields[field] ? `${field}-error` : undefined}
            />
            {fields[field] && (
              <p id={`${field}-error`} className="field-error">
                {fields[field][0]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="field">
        <label htmlFor="message">{c.messageLabel}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={20}
          maxLength={4000}
          aria-invalid={!!fields.message}
          aria-describedby={fields.message ? "message-error" : undefined}
        />
        {fields.message && (
          <p id="message-error" className="field-error">
            {fields.message[0]}
          </p>
        )}
      </div>
      <div className="honey" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-bottom">
        <p>
          {process.env.NEXT_PUBLIC_STATIC_SITE === "1"
            ? locale === "en"
              ? "This public preview opens your email app so the message can be sent directly. "
              : "این نسخه عمومی، برنامه ایمیل شما را برای ارسال مستقیم پیام باز می‌کند. "
            : c.formNote}{" "}
          <Link href={`/${locale}/privacy`}>{c.privacy}</Link>
        </p>
        <button className="button button-dark" disabled={busy} type="submit">
          {busy ? c.sending : c.send}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
