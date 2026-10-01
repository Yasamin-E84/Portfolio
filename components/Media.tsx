"use client";

import { copy, publicPath, type Locale } from "@/lib/content";

export function Video({
  file,
  title,
  note,
  locale,
  portrait = false,
  onOpen,
  poster,
}: {
  file: string;
  title: string;
  note: string;
  locale: Locale;
  portrait?: boolean;
  onOpen?: () => void;
  poster?: string;
}) {
  const c = copy[locale];
  return (
    <figure className={`video-sheet ${portrait ? "portrait-video" : ""}`}>
      <div className="video-frame">
        <button
          type="button"
          className="video-poster-trigger"
          onClick={onOpen}
          aria-label={`${c.imageOpen}: ${title}`}
        >
          <img src={poster || publicPath(`/media/video/${file}.webp`)} alt="" loading="lazy" />
          <span className="video-poster-play" aria-hidden="true">▶</span>
          <small>{locale === "fa" ? "نمایش و پخش" : "open & play"}</small>
        </button>
        {onOpen && (
          <button
            type="button"
            className="folio-open"
            onClick={onOpen}
            aria-label={`${c.imageOpen}: ${title}`}
          >
            <span aria-hidden="true">↗</span>
            {locale === "fa" ? "ورق‌زدن پروژه‌ها" : "open folio"}
          </button>
        )}
      </div>
      <figcaption>
        <strong>{title}</strong>
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}

export function Artwork({
  file,
  title,
  note,
  locale,
  wide = false,
  onOpen,
  src,
}: {
  file: string;
  title: string;
  note: string;
  locale: Locale;
  wide?: boolean;
  onOpen: () => void;
  src?: string;
}) {
  const c = copy[locale];
  return (
    <figure className={`art-sheet ${wide ? "art-wide" : ""}`}>
      <button
        type="button"
        className="art-preview"
        onClick={onOpen}
        aria-label={`${c.imageOpen}: ${title}`}
      >
        <img
          src={src || publicPath(`/media/${file}.webp`)}
          alt={title}
          loading="lazy"
          width="700"
          height="700"
        />
        <span aria-hidden="true">↗</span>
      </button>
      <figcaption>
        <strong>{title}</strong>
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}
