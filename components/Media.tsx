"use client";
import { useRef, useState } from "react";
import { copy, publicPath, type Locale } from "@/lib/content";
export function Video({
  file,
  title,
  note,
  locale,
  portrait = false,
}: {
  file: string;
  title: string;
  note: string;
  locale: Locale;
  portrait?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const c = copy[locale];
  return (
    <figure className={`video-sheet ${portrait ? "portrait-video" : ""}`}>
      <div className="video-frame">
        {playing ? (
          <video
            controls
            autoPlay
            playsInline
            preload="metadata"
            src={publicPath(`/media/video/${file}.mp4`)}
            poster={publicPath(`/media/video/${file}.webp`)}
            aria-label={title}
          ></video>
        ) : (
          <button
            className="video-poster"
            onClick={() => setPlaying(true)}
            aria-label={`${c.play}: ${title}`}
          >
            <img
              src={publicPath(`/media/video/${file}.webp`)}
              alt={title}
              width={portrait ? 405 : 720}
              height={portrait ? 720 : 405}
              loading="lazy"
            />
            <span className="play-button" aria-hidden="true">
              ▷
            </span>
            <span className="play-label">{c.play}</span>
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
}: {
  file: string;
  title: string;
  note: string;
  locale: Locale;
  wide?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const c = copy[locale];
  return (
    <figure className={`art-sheet ${wide ? "art-wide" : ""}`}>
      <button
        className="art-preview"
        onClick={() => dialog.current?.showModal()}
        aria-label={`${c.imageOpen}: ${title}`}
      >
        <img
          src={publicPath(`/media/${file}.webp`)}
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
      <dialog
        ref={dialog}
        className="art-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          autoFocus
          className="dialog-close"
          onClick={() => dialog.current?.close()}
          aria-label={c.close}
        >
          ×
        </button>
        <img src={publicPath(`/media/${file}.webp`)} alt={title} />
        <p>{title}</p>
      </dialog>
    </figure>
  );
}
