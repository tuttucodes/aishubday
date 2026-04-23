"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";

type Props = { items: GalleryItem[] };

function monthLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function fullDateLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// Bento sizing — deterministic from id so SSR/CSR match.
// Occasional large cards create Apple-Watch-like depth variation.
function tileSize(id: string): "sm" | "md" | "lg" | "xl" {
  const n = parseInt(id, 10);
  if (n % 17 === 0) return "xl";
  if (n % 9 === 0) return "lg";
  if (n % 5 === 0) return "md";
  return "sm";
}

const SIZE_CLASS: Record<ReturnType<typeof tileSize>, string> = {
  sm: "col-span-2 row-span-2",
  md: "col-span-2 row-span-3",
  lg: "col-span-3 row-span-3",
  xl: "col-span-4 row-span-4",
};

export function Act10Gallery({ items }: Props) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "photo") return items.filter((i) => i.kind === "image");
    return items.filter((i) => i.kind === "video");
  }, [items, filter]);

  const months = useMemo(() => {
    const buckets: { label: string; items: GalleryItem[] }[] = [];
    let current: typeof buckets[number] | null = null;
    for (const it of filtered) {
      const l = monthLabel(it.date);
      if (!current || current.label !== l) {
        current = { label: l, items: [] };
        buckets.push(current);
      }
      current.items.push(it);
    }
    return buckets;
  }, [filtered]);

  if (items.length === 0) return null;

  const totals = {
    photos: items.filter((i) => i.kind === "image").length,
    videos: items.filter((i) => i.kind === "video").length,
  };

  return (
    <section className="relative min-h-[100dvh] bg-[#040404] text-white overflow-hidden">
      {/* ambient orbs */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 8%, rgba(255,142,160,0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 88% 92%, rgba(201,161,109,0.08), transparent 60%), radial-gradient(ellipse 60% 30% at 50% 60%, rgba(139,110,201,0.05), transparent 70%)",
        }}
      />

      <div className="relative z-10 px-4 md:px-16 py-24 md:py-32">
        {/* header */}
        <div className="flex items-end justify-between flex-wrap gap-8 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70 bg-white/5 hair-dark mb-6">
              <span className="w-1 h-1 rounded-full bg-rose" />
              act · x · archive
            </span>
            <h2 className="font-clash text-5xl md:text-[8vw] md:leading-[0.85] tracking-tight">
              every frame,
              <br />
              <span className="italic font-[var(--font-fraunces)] font-normal text-white/70">
                every clip.
              </span>
            </h2>
            <p className="mt-6 text-white/45 max-w-xl font-[var(--font-fraunces)] italic text-base md:text-lg">
              one-hundred-and-eighty-five small eternities, sorted by the day they happened.
              tap any to open. hover to breathe.
            </p>
          </div>

          {/* pill filter, fluid-island style */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 hair-dark bezel-inner backdrop-blur-xl">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              all · {items.length}
            </FilterChip>
            <FilterChip active={filter === "photo"} onClick={() => setFilter("photo")}>
              photos · {totals.photos}
            </FilterChip>
            <FilterChip active={filter === "video"} onClick={() => setFilter("video")}>
              reels · {totals.videos}
            </FilterChip>
          </div>
        </div>

        {/* month buckets */}
        <div className="space-y-24 md:space-y-32">
          {months.map((bucket, bucketIdx) => (
            <div key={bucket.label}>
              <div className="sticky top-4 z-20 mb-8 w-fit">
                <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-black/70 backdrop-blur-xl hair-dark">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose" />
                  <h3 className="font-clash text-lg md:text-xl">{bucket.label}</h3>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {bucket.items.length} {bucket.items.length === 1 ? "moment" : "moments"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-12 auto-rows-[40px] md:auto-rows-[48px] gap-2 md:gap-3">
                {bucket.items.map((it, i) => (
                  <Tile
                    key={it.id}
                    it={it}
                    index={bucketIdx * 50 + i}
                    size={tileSize(it.id)}
                    onOpen={() => setActive(it)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <Lightbox it={active} onClose={() => setActive(null)} />}
      </AnimatePresence>

      <style jsx>{`
        /* Apple-Watch-style scroll scaling via view-timeline */
        @supports (animation-timeline: view()) {
          :global(.tile-scale) {
            animation: tile-scale linear both;
            animation-timeline: view();
            animation-range: entry 0% cover 55%;
          }
          :global(.tile-exit) {
            animation: tile-exit linear both;
            animation-timeline: view();
            animation-range: cover 60% exit 100%;
          }
          @keyframes tile-scale {
            from {
              transform: scale(0.7) translateY(24px);
              opacity: 0;
              filter: blur(18px);
            }
            to {
              transform: scale(1) translateY(0);
              opacity: 1;
              filter: blur(0);
            }
          }
          @keyframes tile-exit {
            from {
              transform: scale(1);
              opacity: 1;
            }
            to {
              transform: scale(0.9);
              opacity: 0.55;
            }
          }
        }
      `}</style>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        active
          ? "bg-rose text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
          : "text-white/60 hover:text-white/90"
      }`}
    >
      {children}
    </button>
  );
}

function Tile({
  it,
  index,
  size,
  onOpen,
}: {
  it: GalleryItem;
  index: number;
  size: "sm" | "md" | "lg" | "xl";
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // magnetic tilt on hover
  const onMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-x", `${-y * 10}deg`);
    el.style.setProperty("--tilt-y", `${x * 10}deg`);
    el.style.setProperty("--tilt-tx", `${x * 6}px`);
    el.style.setProperty("--tilt-ty", `${y * 6}px`);
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--tilt-tx", "0px");
    el.style.setProperty("--tilt-ty", "0px");
  }, []);

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 18, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.8,
        delay: Math.min(index * 0.02, 0.35),
        ease: [0.32, 0.72, 0, 1],
      }}
      onClick={onOpen}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className={`
        tile-scale group relative block
        ${SIZE_CLASS[size]}
        rounded-[1.25rem] md:rounded-[1.5rem]
        bg-white/5 hair-dark bezel-inner
        overflow-hidden cursor-pointer
        transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        hover:z-10 hover:shadow-[0_20px_60px_-20px_rgba(255,142,160,0.4)]
        [&:hover]:[transform:rotateX(var(--tilt-x,0))_rotateY(var(--tilt-y,0))_translate3d(var(--tilt-tx,0),var(--tilt-ty,0),0)_scale(1.04)]
      `}
    >
      {/* inner core (Doppelrand) */}
      <div className="absolute inset-[3px] rounded-[1.1rem] md:rounded-[1.35rem] overflow-hidden">
        {it.kind === "image" ? (
          <Image
            src={it.thumb}
            alt={it.label}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.08]"
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
          />
        ) : (
          <AutoVideo src={it.src} poster={it.thumb} alt={it.label} />
        )}

        {/* rose rim on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-[1.1rem] md:rounded-[1.35rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-1 ring-inset ring-rose/60" />

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* video badge */}
        {it.kind === "video" && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-[0.25em] font-mono text-rose pointer-events-none">
            ▸ reel
          </div>
        )}

        {/* date on hover */}
        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-white/90">
            <span>{fullDateLabel(it.date)}</span>
            {it.place && <span className="text-rose">· {it.place}</span>}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function AutoVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.08]"
    />
  );
}

function Lightbox({ it, onClose }: { it: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-[95] bg-black/92 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        exit={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col gap-4 p-1.5 rounded-[2rem] bg-white/5 hair-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-1 flex items-center justify-center rounded-[calc(2rem-0.375rem)] overflow-hidden bg-black">
          {it.kind === "image" ? (
            <Image
              src={it.src}
              alt={it.label}
              width={1600}
              height={1600}
              className="max-w-full max-h-[78vh] object-contain w-auto h-auto"
              sizes="100vw"
              unoptimized
            />
          ) : (
            <video
              src={it.src}
              poster={it.thumb}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[78vh] bg-black"
            />
          )}
        </div>
        <div className="flex items-center justify-between w-full text-xs font-mono text-white/65 px-3 pb-2">
          <span className="uppercase tracking-[0.25em]">{fullDateLabel(it.date)}</span>
          {it.place && (
            <span className="text-rose uppercase tracking-[0.25em]">{it.place}</span>
          )}
          <button
            onClick={onClose}
            className="group inline-flex items-center gap-2 pl-4 pr-1 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors duration-300"
          >
            <span className="uppercase tracking-[0.25em] text-white/80">close</span>
            <span className="w-7 h-7 rounded-full bg-rose text-black flex items-center justify-center text-xs group-hover:rotate-90 transition-transform duration-400">
              ✕
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
