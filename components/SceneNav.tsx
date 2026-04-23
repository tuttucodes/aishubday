"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const ACTS = [
  { id: "act-1", label: "open" },
  { id: "act-2", label: "reel" },
  { id: "act-3", label: "stars" },
  { id: "act-4", label: "letter" },
  { id: "act-5", label: "reasons" },
  { id: "act-6", label: "songs" },
  { id: "act-7", label: "cake" },
  { id: "act-8", label: "song" },
  { id: "act-9", label: "gift" },
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

  return (
    <nav
      aria-label="scene navigator"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[80] hidden md:flex flex-col gap-3 mix-blend-difference"
    >
      {ACTS.map((a, i) => (
        <a key={a.id} href={`#${a.id}`} className="group flex items-center gap-3 justify-end">
          <motion.span
            className="text-[10px] uppercase tracking-[0.3em] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ opacity: active === i ? 1 : 0 }}
          >
            {a.label}
          </motion.span>
          <motion.span
            className="block rounded-full"
            animate={{
              width: active === i ? 28 : 8,
              height: 2,
              backgroundColor: active === i ? "#ffffff" : "rgba(255,255,255,0.35)",
            }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          />
        </a>
      ))}
    </nav>
  );
}
