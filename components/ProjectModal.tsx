"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { pick, publicPath, type Locale } from "@/lib/content";

export type GalleryLink = {
  label: string;
  href: string;
};

export type GalleryItem = {
  title: string;
  note: string;
  description?: string;
  kind: "image" | "video" | "website";
  src: string;
  liveUrl?: string;
  poster?: string;
  portrait?: boolean;
  tags?: string[];
  links?: GalleryLink[];
};

function timecode(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function PaperVideoPlayer({
  src,
  poster,
  title,
  locale,
  portrait = false,
}: {
  src: string;
  poster: string;
  title: string;
  locale: Locale;
  portrait?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
    }
  }

  function seek(value: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrent(value);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  async function enterFullscreen() {
    const shell = shellRef.current;
    if (shell?.requestFullscreen) await shell.requestFullscreen();
  }

  return (
    <div
      ref={shellRef}
      className={`paper-player ${portrait ? "is-portrait" : ""}`}
      data-playing={playing ? "true" : "false"}
    >
      <div className="player-title-strip" aria-hidden="true">
        <span>REC / {title}</span>
        <i />
      </div>
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        src={src}
        poster={poster}
        aria-label={title}
        onClick={togglePlayback}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) => {
          setCurrent(event.currentTarget.currentTime);
          if (Number.isFinite(event.currentTarget.duration)) {
            setDuration(event.currentTarget.duration);
          }
        }}
        onDurationChange={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0,
          )
        }
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setMuted(event.currentTarget.muted);
        }}
      />
      {!playing && (
        <button
          type="button"
          className="paper-play"
          onClick={togglePlayback}
          aria-label={`${pick(locale, "Play", "پخش")}: ${title}`}
        >
          <span aria-hidden="true">▶</span>
          <small>{pick(locale, "press to play", "برای پخش بزنید")}</small>
        </button>
      )}
      <div className="paper-player-controls">
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={pick(
            locale,
            playing ? "Pause" : "Play",
            playing ? "مکث" : "پخش",
          )}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>
        <span className="player-time" dir="ltr">
          {timecode(current)} / {timecode(duration)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.05"
          value={Math.min(current, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label={pick(locale, "Video position", "موقعیت ویدئو")}
          style={
            {
              "--progress": `${duration ? (current / duration) * 100 : 0}%`,
            } as React.CSSProperties
          }
        />
        <button
          type="button"
          onClick={toggleMute}
          aria-label={pick(
            locale,
            muted ? "Unmute" : "Mute",
            muted ? "فعال کردن صدا" : "قطع صدا",
          )}
        >
          {muted ? "×♪" : "♪"}
        </button>
        <button
          type="button"
          onClick={enterFullscreen}
          aria-label={pick(locale, "Fullscreen", "تمام‌صفحه")}
        >
          ⛶
        </button>
      </div>
    </div>
  );
}

export function ProjectModal({
  items,
  activeIndex,
  setActiveIndex,
  onClose,
  locale,
}: {
  items: GalleryItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onClose: () => void;
  locale: Locale;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStart = useRef<number | null>(null);
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragX, setDragX] = useState(0);
  const [turn, setTurn] = useState<"next-out" | "next-in" | "prev-out" | "prev-in" | "">("");
  const item = items[activeIndex];

  const move = (direction: number) => {
    if (turn) return;
    setDragX(0);
    const way = direction > 0 ? "next" : "prev";
    setTurn(`${way}-out`);
    turnTimer.current = setTimeout(() => {
      setActiveIndex((activeIndex + direction + items.length) % items.length);
      setTurn(`${way}-in`);
      turnTimer.current = setTimeout(() => setTurn(""), 260);
    }, 210);
  };

  const moveTo = (index: number) => {
    if (turn || index === activeIndex) return;
    setDragX(0);
    const way = index > activeIndex ? "next" : "prev";
    setTurn(`${way}-out`);
    turnTimer.current = setTimeout(() => {
      setActiveIndex(index);
      setTurn(`${way}-in`);
      turnTimer.current = setTimeout(() => setTurn(""), 260);
    }, 210);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
      if (turnTimer.current) clearTimeout(turnTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") move(locale === "fa" ? 1 : -1);
      if (event.key === "ArrowRight") move(locale === "fa" ? -1 : 1);
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button, input, a")) return;
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return;
    setDragX(event.clientX - dragStart.current);
  }

  function finishDrag() {
    if (Math.abs(dragX) > 70) move(dragX < 0 ? 1 : -1);
    else setDragX(0);
    dragStart.current = null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="project-modal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-label={item.title}
    >
      <div className="project-modal-paper">
        <header className="project-modal-header">
          <p>
            {pick(locale, "WORK FOLIO", "دفتر ورق‌زدنی")} ·{" "}
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={pick(locale, "Close", "بستن")}
          >
            ×
          </button>
        </header>

        <div className="project-modal-stage-wrap" data-turn={turn}>
        <div
          className="project-modal-stage"
          onPointerDown={startDrag}
          onPointerMove={updateDrag}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          style={{
            transform: `translateX(${dragX}px) rotate(${dragX / 300}deg)`,
          }}
        >
          {item.kind === "video" ? (
            <PaperVideoPlayer
              key={`${activeIndex}-${item.src}`}
              src={item.src}
              poster={item.poster || ""}
              title={item.title}
              locale={locale}
              portrait={item.portrait}
            />
          ) : item.kind === "website" && item.liveUrl ? (
            <div className="site-preview-shell">
              <div className="site-preview-bar" aria-hidden="true">
                <span /><span /><span />
                <strong>{new URL(item.liveUrl).hostname}</strong>
              </div>
              <iframe
                key={`${activeIndex}-${item.liveUrl}`}
                src={item.liveUrl}
                title={`${item.title} — ${pick(locale, "live website", "وب‌سایت زنده")}`}
                loading="lazy"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              />
            </div>
          ) : (
            <img src={item.src} alt={item.title} draggable={false} />
          )}
          <span className="drag-note" aria-hidden="true">
            ↔ {pick(locale, "drag to leaf through", "برای ورق‌زدن بکشید")}
          </span>
        </div>
        </div>

        <div className="project-modal-copy">
          <div>
            <p className="project-modal-note">{item.note}</p>
            <h2>{item.title}</h2>
            {item.description && <p>{item.description}</p>}
            {item.tags && (
              <div className="tech-chips">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
            {item.links && (
              <div className="project-links">
                {item.links.map((link) => (
                  <a
                    className="text-link"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    key={link.href}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
          <nav
            className="project-modal-nav"
            aria-label={pick(
              locale,
              "Project navigation",
              "جابه‌جایی بین پروژه‌ها",
            )}
          >
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label={pick(locale, "Previous project", "پروژه قبلی")}
            >
              ← <span>{pick(locale, "previous", "قبلی")}</span>
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label={pick(locale, "Next project", "پروژه بعدی")}
            >
              <span>{pick(locale, "next", "بعدی")}</span> →
            </button>
          </nav>
        </div>

        <div
          className="project-pagination"
          aria-label={pick(locale, "Choose a project", "انتخاب پروژه")}
        >
          {items.map((entry, index) => (
            <button
              type="button"
              key={`${entry.title}-${index}`}
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => moveTo(index)}
              aria-label={`${index + 1}: ${entry.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </dialog>
  );
}

export function imageGalleryItem(
  file: string,
  title: string,
  note: string,
): GalleryItem {
  return {
    kind: "image",
    src: publicPath(`/media/${file}.webp`),
    title,
    note,
  };
}
