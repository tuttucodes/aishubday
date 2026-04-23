"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
      }
    };
    let raf: number;
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="hidden [@media(hover:hover)]:block">
      <div
        ref={dot}
        aria-hidden
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-white mix-blend-difference pointer-events-none z-[9999]"
      />
      <div
        ref={ring}
        aria-hidden
        className="fixed top-0 left-0 w-[36px] h-[36px] rounded-full border border-white/40 mix-blend-difference pointer-events-none z-[9999] transition-[width,height] duration-300"
      />
    </div>
  );
}
