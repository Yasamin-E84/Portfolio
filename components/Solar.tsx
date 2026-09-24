"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { planets, copy, publicPath, type Locale } from "@/lib/content";
import {
  planetLayout,
  orbitPath,
  placePlanetNote,
  type SolarFrame,
} from "./solar-layout";
const Canvas = dynamic(() => import("./SolarCanvas"), { ssr: false });
function subscribeMotion(cb: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", cb);
  return () => query.removeEventListener("change", cb);
}
export function Solar({ locale }: { locale: Locale }) {
  const router = useRouter();
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [active, setActive] = useState(0),
    [ready, setReady] = useState(false),
    [fallback, setFallback] = useState(false),
    [manualPause, setManualPause] = useState(false),
    [hover, setHover] = useState(false),
    [focus, setFocus] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const orbitRefs = useRef<(SVGPathElement | null)[]>([]);
  const connectorRef = useRef<SVGPathElement>(null);
  const connectorSvgRef = useRef<SVGSVGElement>(null);
  const orbitsSvgRef = useRef<SVGSVGElement>(null);
  const selectedRef = useRef(active);
  const placementNeeded = useRef(true);
  const noteSize = useRef({ width: 340, height: 280 });
  const placement = useRef({ x: 0, y: 0 });
  const dimensions = useRef({ width: 0, height: 0 });
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // One animation clock drives spheres, hit targets, labels, and their connecting note.
  const onFrame = useCallback(({ points, width, height }: SolarFrame) => {
    const resized =
      dimensions.current.width !== width ||
      dimensions.current.height !== height;
    if (resized) {
      dimensions.current = { width, height };
      placementNeeded.current = true;
      orbitsSvgRef.current?.setAttribute("viewBox", `0 0 ${width} ${height}`);
      connectorSvgRef.current?.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`,
      );
      orbitRefs.current.forEach((path, index) =>
        path?.setAttribute("d", orbitPath(width, height, index)),
      );
    }
    points.forEach((point, index) => {
      const button = buttonRefs.current[index];
      if (button) {
        button.style.left = `${point.x}px`;
        button.style.top = `${point.y}px`;
      }
    });
    const note = noteRef.current;
    if (!note) return;
    if (placementNeeded.current) {
      const size = noteSize.current;
      placement.current = placePlanetNote(
        points,
        selectedRef.current,
        width,
        height,
        size.width,
        size.height,
      );
      note.style.left = `${placement.current.x}px`;
      note.style.top = `${placement.current.y}px`;
      note.classList.add("is-positioned");
      placementNeeded.current = false;
    }
    const p = points[selectedRef.current],
      box = placement.current,
      size = noteSize.current;
    const endX = Math.max(box.x + 14, Math.min(p.x, box.x + size.width - 14));
    const endY = Math.max(box.y + 10, Math.min(p.y, box.y + size.height - 10));
    const distance = Math.max(1, Math.hypot(endX - p.x, endY - p.y));
    const startX = p.x + ((endX - p.x) / distance) * (p.radius + 12);
    const startY = p.y + ((endY - p.y) / distance) * (p.radius + 12);
    connectorRef.current?.setAttribute(
      "d",
      `M${startX},${startY} Q${(startX + endX) / 2 + 13},${(startY + endY) / 2 - 9} ${endX},${endY}`,
    );
  }, []);
  useEffect(() => {
    selectedRef.current = active;
    placementNeeded.current = true;
    const stage = stageRef.current;
    if (fallback && stage)
      onFrame({
        points: planetLayout(stage.clientWidth, stage.clientHeight, 0, true),
        width: stage.clientWidth,
        height: stage.clientHeight,
      });
  }, [active, fallback, onFrame]);
  useEffect(() => {
    const stage = stageRef.current,
      note = noteRef.current;
    if (!stage || !note) return;
    const observe = new ResizeObserver(() => {
      noteSize.current = { width: note.offsetWidth, height: note.offsetHeight };
      // Only extend compact scenes when the measured translation needs extra room.
      const minimum =
        stage.clientWidth < 700
          ? `${Math.max(680, Math.ceil((note.offsetHeight + 115) / 0.56))}px`
          : "";
      if (stage.style.minHeight !== minimum) stage.style.minHeight = minimum;
      placementNeeded.current = true;
      if (fallback)
        onFrame({
          points: planetLayout(stage.clientWidth, stage.clientHeight, 0, true),
          width: stage.clientWidth,
          height: stage.clientHeight,
        });
    });
    observe.observe(note);
    observe.observe(stage);
    return () => observe.disconnect();
  }, [fallback, onFrame]);
  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    [],
  );
  function enterHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHover(true);
  }
  function leaveHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHover(false), 240);
  }
  const onReady = useCallback(() => setReady(true), []),
    onFailure = useCallback(() => {
      setFallback(true);
      setReady(true);
    }, []);
  const paused = manualPause || hover || focus || reduced;
  useEffect(() => {
    if (!ready || paused) return;
    const interval = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % 7);
    }, 5000);
    return () => clearInterval(interval);
  }, [ready, paused, active]);
  const c = copy[locale],
    planet = planets[active];
  return (
    <div
      className={`solar ${ready ? "is-ready" : ""} ${fallback ? "solar-fallback" : ""}`}
    >
      <div className="solar-stage" ref={stageRef}>
        <svg
          className="skill-orbits"
          ref={orbitsSvgRef}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          {planets.map((p, i) => (
            <path
              key={p.id}
              ref={(node) => {
                orbitRefs.current[i] = node;
              }}
              className={active === i ? "active-orbit" : ""}
            />
          ))}
        </svg>
        <svg
          className="planet-connector"
          ref={connectorSvgRef}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path ref={connectorRef} />
        </svg>
        {!fallback && (
          <Canvas
            active={active}
            reduced={reduced}
            onReady={onReady}
            onFailure={onFailure}
            onFrame={onFrame}
          />
        )}
        {!ready && (
          <span className="solar-loading" role="status">
            {locale === "en"
              ? "Bringing the universe into view…"
              : "در حال آماده‌سازی منظومه…"}
          </span>
        )}
        <div className="planet-controls" role="group" aria-label={c.solarHint}>
          {planets.map((p, i) => (
            <button
              key={p.id}
              ref={(node) => {
                buttonRefs.current[i] = node;
              }}
              className={`planet-button ${active === i ? "selected" : ""}`}
              style={
                {
                  "--planet-color": p.color,
                } as CSSProperties
              }
              aria-pressed={active === i}
              aria-controls="planet-card"
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") {
                  setActive(i);
                  enterHover();
                }
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") leaveHover();
              }}
              onFocus={(e) => {
                setActive(i);
                setFocus(e.currentTarget.matches(":focus-visible"));
              }}
              onBlur={() => setFocus(false)}
              onPointerDown={(e) => {
                setFocus(false);
                if (e.pointerType === "touch") setManualPause(true);
              }}
              onClick={() => router.push(`/${locale}/works?category=${p.id}`)}
              onKeyDown={(event) => {
                if (
                  !["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(
                    event.key,
                  )
                )
                  return;
                event.preventDefault();
                const next =
                  (i +
                    (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : 6)) %
                  7;
                buttonRefs.current[next]?.focus();
              }}
            >
              <span className="fallback-sphere" />
              <span className="planet-label">
                <span className="planet-number">0{i + 1}</span>
                {locale === "en" ? p.en : p.fa}
              </span>
            </button>
          ))}
        </div>
        <div
          ref={noteRef}
          className="planet-info"
          id="planet-card"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") enterHover();
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") leaveHover();
          }}
          onFocus={(e) => setFocus(e.target.matches(":focus-visible"))}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false);
          }}
        >
          <div className="planet-info-header">
            <span className="planet-index">
              0{active + 1} <span>/ 07</span>
            </span>
            <p>{locale === "en" ? planet.levelEn : planet.levelFa}</p>
            <button
              className="orbit-toggle"
              onClick={() => setManualPause((p) => !p)}
              disabled={reduced}
              aria-label={manualPause ? c.resume : c.pause}
            >
              {manualPause ? "▷" : "Ⅱ"}
              <span>{manualPause ? c.resume : c.pause}</span>
            </button>
          </div>
          <div className="planet-info-body">
            <h2>{locale === "en" ? planet.en : planet.fa}</h2>
            <p>{locale === "en" ? planet.enText : planet.faText}</p>
            <div className="planet-tags">
              {planet.tag.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <a
              className="text-link"
              href={publicPath(`/${locale}/works?category=${planet.id}`)}
            >
              {c.viewWork} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div
            className="orbit-progress"
            aria-hidden="true"
            key={`${active}-${paused}`}
          >
            <span
              style={{ animationPlayState: paused ? "paused" : "running" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
