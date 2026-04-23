"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const ACTS = [
  { id: "act-1", label: "open", tone: "dark" },
  { id: "act-2", label: "reel", tone: "dark" },
  { id: "act-3", label: "stars", tone: "dark" },
  { id: "act-4", label: "letter", tone: "light" },
  { id: "act-5", label: "reasons", tone: "light" },
  { id: "act-6", label: "songs", tone: "dark" },
  { id: "act-7", label: "cake", tone: "dark" },
  { id: "act-8", label: "song", tone: "dark" },
  { id: "act-9", label: "gift", tone: "dark" },
];

export function SceneNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ACTS.findIndex((a) => a.id === e.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    ACTS.forEach((a) => {
      const el = document.getElementById(a.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const tone = ACTS[active]?.tone ?? "dark";
  const dotInactive = tone === "light" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.35)";
  const dotActive = tone === "light" ? "#1a1a1a" : "#ffffff";
  const textColor = tone === "light" ? "text-black/60" : "text-white/70";

  return (
    <nav
      aria-label="scene navigator"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[80] hidden md:flex flex-col gap-3"
    >
      {ACTS.map((a, i) => (
        <a key={a.id} href={`#${a.id}`} className="group flex items-center gap-3 justify-end">
          <motion.span
            className={`text-[10px] uppercase tracking-[0.3em] ${textColor} opacity-0 group-hover:opacity-100 transition-opacity`}
            animate={{ opacity: active === i ? 1 : 0 }}
          >
            {a.label}
          </motion.span>
          <motion.span
            className="block rounded-full"
            animate={{
              width: active === i ? 28 : 8,
              height: 2,
              backgroundColor: active === i ? dotActive : dotInactive,
            }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          />
        </a>
      ))}
    </nav>
  );
}
