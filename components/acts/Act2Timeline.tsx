"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { motion } from "motion/react";

type Frame = { date: string; title: string; caption: string; img?: string };

const DEFAULT_FRAMES: Frame[] = [
  { date: "2025 · 06 · 15", title: "day zero", caption: "the first yes. it rained. we ignored it." },
  { date: "2025 · 07", title: "nights", caption: "long calls. longer silences. both lovely." },
  { date: "2025 · 08", title: "dakshinchitra", caption: "the infamous tape. (never speak of it.)" },
  { date: "2025 · 10", title: "chikmagalur", caption: "those stairs. coffee mist. u in a hoodie." },
  { date: "2025 · 12", title: "year end", caption: "u became the weather." },
  { date: "2026 · 02", title: "valentine", caption: "boring date. spectacular company." },
  { date: "2026 · 03", title: "us, now", caption: "everything louder. everything softer." },
  { date: "2026 · 04 · 24", title: "today", caption: "ur day. the whole internet on mute." },
];

export function Act2Timeline({ photos = [] }: { photos?: string[] }) {
  const FRAMES: Frame[] = DEFAULT_FRAMES.map((f, i) => ({
    ...f,
    img: photos[i] ?? f.img,
  }));
  // extra photos beyond defaults → append as bonus frames
  photos.slice(DEFAULT_FRAMES.length).forEach((p, i) => {
    FRAMES.push({
      date: "bonus",
      title: `frame ${DEFAULT_FRAMES.length + i + 1}`,
      caption: "another one.",
      img: p,
    });
  });

  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (!track.current || !root.current) return;
      const scrollDist = track.current.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -scrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${scrollDist}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-[#050505] overflow-hidden">
      <div className="h-[100dvh] flex flex-col">
        <div className="px-8 md:px-16 pt-10 flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-3">act · ii</p>
            <h2 className="font-clash text-5xl md:text-7xl">the reel.</h2>
          </div>
          <p className="hidden md:block text-sm text-white/40 max-w-xs text-right">
            june 2025 → april 2026. scroll slow. every frame is a memory.
          </p>
        </div>

        <div className="flex-1 flex items-center">
          <div ref={track} className="flex gap-10 pl-[10vw] pr-[30vw] will-change-transform">
            {FRAMES.map((f, i) => (
              <motion.article
                key={i}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="shrink-0 w-[72vw] md:w-[42vw] aspect-[3/4] rounded-[2rem] bg-white/5 hair-dark bezel-inner relative overflow-hidden group"
              >
                {f.img ? (
                  <Image src={f.img} alt={f.title} fill className="object-cover" sizes="50vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlaceholderFrame index={i} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 mb-3">{f.date}</p>
                  <h3 className="font-clash text-3xl md:text-4xl mb-2">{f.title}</h3>
                  <p className="text-white/70 text-sm max-w-[90%]">{f.caption}</p>
                </div>
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hair-dark flex items-center justify-center text-[10px] font-mono">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/30 pb-6">
          drag / scroll →
        </p>
      </div>
    </section>
  );
}

function PlaceholderFrame({ index }: { index: number }) {
  const hues = ["#ff8ea0", "#c9a16d", "#3d8b5a", "#8b6ec9", "#d9a5b3", "#6d8bc9", "#c96d9d", "#6dc9b0"];
  const hue = hues[index % hues.length];
  return (
    <div className="w-full h-full relative">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${30 + index * 8}% ${40 + index * 5}%, ${hue}aa 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${hue}44 0%, transparent 60%), linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-[var(--font-fraunces)] italic text-white/10 text-[8rem] select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
