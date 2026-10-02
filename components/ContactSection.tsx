"use client";
import { useState } from "react";
import { copy, type Locale } from "@/lib/content";
import { trackPortfolioEvent } from "@/lib/analytics-client";
import { Contact } from "./Contact";
export function ContactSection({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [copied,setCopied]=useState("");
  async function copyContact(value:string,target:string){
    try{await navigator.clipboard.writeText(value);setCopied(target);trackPortfolioEvent("contact_copy",target,locale);setTimeout(()=>setCopied(""),1800)}catch{}
  }
  return (
    <section className="contact-section section-shell" id="contact">
      <header className="section-heading">
        <p className="eyebrow">{c.contactEyebrow}</p>
        <h2>{c.contactTitle}</h2>
        <p>{c.contactIntro}</p>
      </header>
      <div className="contact-layout">
        <div className="contact-details">
          <a className="contact-email" href="mailto:foryxolabels@gmail.com" onClick={()=>trackPortfolioEvent("contact_click","email",locale)}>
            foryxolabels@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <button className="contact-copy" type="button" onClick={()=>copyContact("foryxolabels@gmail.com","email")}>
            {copied==="email"?(locale==="fa"?"کپی شد":"Copied"):(locale==="fa"?"کپی ایمیل":"Copy email")}
          </button>
          <p>{c.location}</p>
          <div className="contact-social">
            <a href="https://t.me/Foryxo" target="_blank" rel="noreferrer" onClick={()=>trackPortfolioEvent("contact_click","telegram",locale)}>
              Telegram ↗
            </a>
            <a
              href="https://wa.me/989109855546"
              target="_blank"
              rel="noreferrer"
              onClick={()=>trackPortfolioEvent("contact_click","whatsapp",locale)}
            >
              WhatsApp ↗
            </a>
            <a
              href="https://github.com/Yasamin-E84"
              target="_blank"
              rel="noreferrer"
              onClick={()=>trackPortfolioEvent("contact_click","github",locale)}
            >
              GitHub ↗
            </a>
            <a href="tel:+989109855546" dir="ltr" onClick={()=>trackPortfolioEvent("contact_click","phone",locale)}>
              +98 910 985 5546
            </a>
            <button className="contact-copy" type="button" onClick={()=>copyContact("+989109855546","phone")}>
              {copied==="phone"?(locale==="fa"?"کپی شد":"Copied"):(locale==="fa"?"کپی شماره":"Copy number")}
            </button>
          </div>
          <span className="contact-doodle" aria-hidden="true">
            ✧<br />↝
          </span>
        </div>
        <Contact locale={locale} />
      </div>
    </section>
  );
}
