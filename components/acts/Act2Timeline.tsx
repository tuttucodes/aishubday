"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { GalleryItem } from "@/lib/gallery";

type Frame = {
  slug: string;
  date: string;
  title: string;
  caption: string;
  media?: GalleryItem;
};

const FRAME_META: { slug: string; date: string; title: string; caption: string }[] = [
  { slug: "01-day-one", date: "2025 · 06", title: "udaipur → yes", caption: "iim udaipur week. boat. scooty. somewhere between june 13 and june 15 the pretending ended." },
  { slug: "02-early-nights", date: "2025 · 07", title: "ecr, july", caption: "the birds. beach terrace mornings. your first illusionist gig. we never really went home." },
  { slug: "03-dakshinchitra", date: "2025 · 08", title: "august things", caption: "smart mirror nights. owl looks. helmets on the way somewhere — always somewhere." },
  { slug: "04-chikmagalur", date: "2025 · 09 → 10", title: "onam → chikmagalur", caption: "onam saree. chikmagalur. pool naps. formals by candlelight on halloween." },
  { slug: "05-year-end", date: "2025 · 11 → 2026 · 01", title: "year end", caption: "go-kart adrenaline. beach terrace cafe — twelve times over in december. rolled into our first new year." },
  { slug: "06-valentine", date: "2026 · 02", title: "february wore you", caption: "lipstick. jhumka mid-flight. vibrance concert. you under a tree. all february, all yours." },
  { slug: "07-us-now", date: "2026 · 03", title: "scooty sundays", caption: "march. you were the ceiling i looked up at from the hospital bed, and every sunday since." },
  { slug: "08-today", date: "2026 · 04 · 24", title: "today", caption: "your day. twenty-one on you. the internet, quiet." },
];

function pickFeatured(items: GalleryItem[], slug: string): GalleryItem | undefined {
  const pool = items.filter((i) => i.slug === slug);
  if (pool.length === 0) return undefined;
  const img = pool.find((i) => i.kind === "image");
  return img ?? pool[0];
}

type Props = { items: GalleryItem[] };

export function Act2Timeline({ items }: Props) {
  const FRAMES: Frame[] = FRAME_META.map((f) => ({
    ...f,
    media: pickFeatured(items, f.slug),
  }));

  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Frame | null>(null);

  const itemsBySlug = useCallback(
    (slug: string) => items.filter((i) => i.slug === slug),
    [items],
  );

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
        <div className="px-6 md:px-16 pt-10 flex items-baseline justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70 bg-white/5 hair-dark mb-4">
              <span className="w-1 h-1 rounded-full bg-rose" />
              act · ii · reel
            </span>
            <h2 className="font-clash text-5xl md:text-7xl">the reel.</h2>
          </div>
          <p className="hidden md:block text-sm text-white/40 max-w-xs text-right">
            june 2025 → april 2026. scroll slow. tap a frame to open the roll.
          </p>
        </div>

        <div className="flex-1 flex items-center">
          <div ref={track} className="flex gap-10 pl-[10vw] pr-[30vw] will-change-transform">
            {FRAMES.map((f, i) => {
              const count = itemsBySlug(f.slug).length;
              return (
                <motion.article
                  key={i}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="shrink-0 w-[72vw] md:w-[42vw] aspect-[3/4] rounded-[2rem] p-1.5 bg-white/5 hair-dark relative overflow-hidden group cursor-pointer"
                  onClick={() => setExpanded(f)}
                >
                  <div className="relative w-full h-full rounded-[calc(2rem-0.375rem)] overflow-hidden bezel-inner">
                    <FrameMedia frame={f} index={i} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 mb-3">{f.date}</p>
                      <h3 className="font-clash text-3xl md:text-4xl mb-2">{f.title}</h3>
                      <p className="text-white/70 text-sm max-w-[90%] mb-5">{f.caption}</p>
                      {count > 0 && (
                        <div className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-black/50 backdrop-blur-md hair-dark group-hover:bg-rose/90 transition-colors duration-400">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-white/85 group-hover:text-black">
                            open roll · {count}
                          </span>
                          <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-black/20 flex items-center justify-center text-xs text-white/85 group-hover:text-black group-hover:translate-x-0.5 transition-transform duration-400">
                            ↗
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hair-dark flex items-center justify-center text-[10px] font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {f.media?.kind === "video" && (
                      <div className="absolute top-6 left-6 px-2 py-1 rounded-full bg-rose/80 text-black text-[9px] uppercase tracking-[0.25em] font-mono">
                        ▸ reel
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/30 pb-6">
          drag / scroll · tap to open the roll
        </p>
      </div>

      <AnimatePresence>
        {expanded && (
          <RollingGallery
            frame={expanded}
            items={itemsBySlug(expanded.slug)}
            onClose={() => setExpanded(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function FrameMedia({ frame, index }: { frame: Frame; index: number }) {
  if (frame.media?.kind === "image") {
    return (
      <Image
        src={frame.media.src}
        alt={frame.title}
        fill
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
        sizes="50vw"
      />
    );
  }
  if (frame.media?.kind === "video") {
    return (
      <video
        src={frame.media.src}
        poster={frame.media.thumb}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <PlaceholderFrame frame={frame} index={index} />
    </div>
  );
}

function PlaceholderFrame({ frame, index }: { frame: Frame; index: number }) {
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
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <span className="font-[var(--font-fraunces)] italic text-white/15 text-[7rem] leading-none select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <code className="text-[10px] font-mono text-white/40 bg-black/40 px-3 py-1.5 rounded-full hair-dark">
          {frame.slug}
        </code>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">no media yet</p>
      </div>
    </div>
  );
}

function RollingGallery({
  frame,
  items,
  onClose,
}: {
  frame: Frame;
  items: GalleryItem[];
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const nudge = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nudge(1);
      if (e.key === "ArrowLeft") nudge(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, nudge]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const centerX = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let best = Infinity;
      children.forEach((c, i) => {
        const mid = c.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(mid - centerX);
        if (d < best) {
          best = d;
          closest = i;
        }
      });
      setIdx(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-[96] bg-black/92 backdrop-blur-2xl flex flex-col"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, filter: "blur(20px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        exit={{ y: 40, opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        className="relative flex-1 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="px-6 md:px-16 pt-12 pb-6 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-3">
              {frame.date}
            </p>
            <h3 className="font-clash text-4xl md:text-6xl mb-3">{frame.title}</h3>
            <p className="font-[var(--font-fraunces)] italic text-white/55 text-base md:text-lg max-w-2xl">
              {frame.caption}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/45 font-mono tabular-nums">
              {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => nudge(-1)}
              className="w-10 h-10 rounded-full bg-white/5 hair-dark hover:bg-white/10 text-lg transition-colors duration-300"
              aria-label="previous"
            >
              ←
            </button>
            <button
              onClick={() => nudge(1)}
              className="w-10 h-10 rounded-full bg-white/5 hair-dark hover:bg-white/10 text-lg transition-colors duration-300"
              aria-label="next"
            >
              →
            </button>
            <button
              onClick={onClose}
              className="group ml-2 inline-flex items-center gap-2 pl-4 pr-1 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors duration-300"
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/80">
                close
              </span>
              <span className="w-7 h-7 rounded-full bg-rose text-black flex items-center justify-center text-xs group-hover:rotate-90 transition-transform duration-400">
                ✕
              </span>
            </button>
          </div>
        </div>

        {/* rolling strip */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-[10vw] pb-12 no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((it, i) => (
            <RollItem key={it.id} it={it} focused={i === idx} />
          ))}
        </div>

        {/* bottom caption */}
        <p className="text-center pb-6 text-[10px] uppercase tracking-[0.3em] text-white/35 font-mono">
          ← → keys · swipe · esc to close
        </p>
      </motion.div>
    </motion.div>
  );
}

function RollItem({ it, focused }: { it: GalleryItem; focused: boolean }) {
  return (
    <motion.div
      animate={{
        scale: focused ? 1 : 0.82,
        opacity: focused ? 1 : 0.45,
      }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="shrink-0 snap-center w-[80vw] md:w-[55vw] lg:w-[45vw] aspect-[3/4] rounded-[2rem] p-1.5 bg-white/5 hair-dark relative"
    >
      <div className="relative w-full h-full rounded-[calc(2rem-0.375rem)] overflow-hidden bezel-inner bg-black">
        {it.kind === "image" ? (
          <Image
            src={it.src}
            alt={it.label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80vw, 45vw"
            unoptimized
          />
        ) : (
          <video
            src={it.src}
            poster={it.thumb}
            autoPlay={focused}
            muted
            loop
            playsInline
            controls={focused}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md hair-dark text-[9px] font-mono uppercase tracking-[0.25em] text-white/80">
          {new Date(it.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {it.place && <span className="text-rose">· {it.place}</span>}
        </div>
      </div>
    </motion.div>
  );
}
