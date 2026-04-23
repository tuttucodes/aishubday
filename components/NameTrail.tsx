"use client";

import { useEffect, useRef } from "react";

const LETTERS = "krishnaa·aishu·chungi·".split("");

export function NameTrail() {
  const ref = useRef<HTMLDivElement>(null);
  const lastRef = useRef({ x: 0, y: 0, t: 0, i: 0 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const { x: lx, y: ly, t: lt } = lastRef.current;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      const dist = Math.hypot(dx, dy);
      if (dist < 40 || now - lt < 35) return;
      lastRef.current = { x: e.clientX, y: e.clientY, t: now, i: (lastRef.current.i + 1) % LETTERS.length };
      const letter = LETTERS[lastRef.current.i];
      if (letter === "·") return;
      const span = document.createElement("span");
      span.textContent = letter;
      span.className = "name-trail-letter";
      span.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;transform:translate(-50%,-50%) rotate(${(Math.random() - 0.5) * 30}deg)`;
      el.appendChild(span);
      setTimeout(() => span.remove(), 1600);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[95] overflow-hidden" />
      <style jsx global>{`
        .name-trail-letter {
          position: fixed;
          font-family: var(--font-caveat), cursive;
          font-size: 32px;
          color: rgba(255, 142, 160, 0.85);
          text-shadow: 0 0 12px rgba(255, 142, 160, 0.5);
          pointer-events: none;
          animation: name-trail-fade 1.6s cubic-bezier(0.32, 0.72, 0, 1) forwards;
          will-change: transform, opacity;
          mix-blend-mode: screen;
        }
        @keyframes name-trail-fade {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.6);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -120%) scale(1.2);
          }
        }
      `}</style>
    </>
  );
}
