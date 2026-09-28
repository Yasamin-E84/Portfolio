"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { basePath } from "@/lib/content";

export function PageTurnTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [turning, setTurning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      setTurning(true);
      const routePath = `${basePath && url.pathname.startsWith(basePath) ? url.pathname.slice(basePath.length) : url.pathname}${url.search}${url.hash}`;
      timer.current = setTimeout(() => router.push(routePath), 290);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (!turning) return;
    timer.current = setTimeout(() => setTurning(false), 420);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [pathname, turning]);

  return <div className="page-turn-transition" data-active={turning ? "true" : "false"} aria-hidden="true"><i /></div>;
}
