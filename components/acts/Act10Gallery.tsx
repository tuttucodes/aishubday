"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 8%, rgba(255,142,160,0.08), transparent 60%), radial-gradient(ellipse 50% 40% at 88% 92%, rgba(201,161,109,0.06), transparent 60%)",
        }}
      />

      <div className="relative z-10 px-4 md:px-16 pt-24 md:pt-32 pb-16">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70 bg-white/5 hair-dark mb-5">
              <span className="w-1 h-1 rounded-full bg-rose" />
              act · x · archive
            </span>
            <h2 className="font-clash text-4xl md:text-[6vw] md:leading-[0.9] tracking-tight">
              every frame,
              <br />
              <span className="italic font-[var(--font-fraunces)] font-normal text-white/70">
                every clip.
              </span>
            </h2>
            <p className="mt-4 text-white/45 max-w-lg font-[var(--font-fraunces)] italic text-sm md:text-base">
              {items.length} moments, sorted by the month they happened. tap to open.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 hair-dark bezel-inner">
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
        <div className="space-y-16 md:space-y-20">
          {months.map((bucket) => (
            <div key={bucket.label}>
              <div className="flex items-baseline gap-4 mb-5">
                <h3 className="font-clash text-xl md:text-2xl">{bucket.label}</h3>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {bucket.items.length} {bucket.items.length === 1 ? "moment" : "moments"}
                </span>
              </div>

              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [column-fill:_balance]">
                {bucket.items.map((it, i) => (
                  <Tile
                    key={it.id}
                    it={it}
                    index={i}
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
      className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
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
  onOpen,
}: {
  it: GalleryItem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.015, 0.2),
        ease: [0.32, 0.72, 0, 1],
      }}
      whileHover={{ y: -3 }}
      onClick={onOpen}
      className="group mb-3 md:mb-4 block w-full rounded-2xl overflow-hidden bg-white/5 hair-dark relative cursor-pointer break-inside-avoid"
    >
      {it.kind === "image" ? (
        // raw <img> for speed — thumbs already 500px JPG
        <img
          src={it.thumb}
          alt={it.label}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover block transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
        />
      ) : (
        <>
          <AutoVideo src={it.src} poster={it.thumb} alt={it.label} />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose/90 text-black text-[9px] uppercase tracking-[0.25em] font-mono pointer-events-none">
            ▸ reel
          </div>
        </>
      )}

      {/* date pill on hover */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-white/85">
          <span>{fullDateLabel(it.date)}</span>
          {it.place && <span className="text-rose">· {it.place}</span>}
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
      { threshold: 0.25, rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      className="w-full h-auto object-cover block"
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
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
