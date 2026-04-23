"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
            "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(255,142,160,0.08), transparent 60%), radial-gradient(ellipse 60% 40% at 90% 90%, rgba(201,161,109,0.06), transparent 60%)",
        }}
      />
      <div className="relative z-10 px-6 md:px-16 py-24">
        <div className="flex items-baseline justify-between flex-wrap gap-6 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-3">act · x</p>
            <h2 className="font-clash text-5xl md:text-7xl">the archive.</h2>
            <p className="mt-4 text-white/50 max-w-xl font-[var(--font-fraunces)] italic text-lg">
              every frame. every clip. sorted by the day it happened.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              all · {items.length}
            </FilterChip>
            <FilterChip active={filter === "photo"} onClick={() => setFilter("photo")}>
              photos · {totals.photos}
            </FilterChip>
            <FilterChip active={filter === "video"} onClick={() => setFilter("video")}>
              videos · {totals.videos}
            </FilterChip>
          </div>
        </div>

        <div className="mt-16 space-y-20">
          {months.map((bucket) => (
            <div key={bucket.label}>
              <div className="flex items-baseline gap-4 mb-6">
                <h3 className="font-clash text-2xl md:text-3xl">{bucket.label}</h3>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                  {bucket.items.length} {bucket.items.length === 1 ? "moment" : "moments"}
                </span>
              </div>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
                {bucket.items.map((it, i) => (
                  <Tile key={it.id} it={it} index={i} onOpen={() => setActive(it)} />
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
      className={`px-3 py-1.5 rounded-full hair-dark transition-colors ${
        active ? "bg-rose text-black" : "bg-white/5 text-white/70 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Tile({ it, index, onOpen }: { it: GalleryItem; index: number; onOpen: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.03, 0.4), ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ y: -4 }}
      onClick={onOpen}
      className="group mb-3 block w-full rounded-2xl overflow-hidden bg-white/5 hair-dark relative cursor-pointer break-inside-avoid"
    >
      {it.kind === "image" ? (
        <Image
          src={it.thumb}
          alt={it.label}
          width={500}
          height={500}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
          loading="lazy"
        />
      ) : (
        <>
          <AutoVideo src={it.src} poster={it.thumb} alt={it.label} />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose/90 text-black text-[9px] uppercase tracking-[0.25em] font-mono pointer-events-none">
            ● video
          </div>
        </>
      )}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-white/80">
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
      className="w-full h-auto object-cover block"
    />
  );
}

function Lightbox({ it, onClose }: { it: GalleryItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex-1 flex items-center justify-center">
          {it.kind === "image" ? (
            <Image
              src={it.src}
              alt={it.label}
              width={1600}
              height={1600}
              className="max-w-full max-h-[75vh] object-contain rounded-xl w-auto h-auto"
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
              className="max-w-full max-h-[75vh] rounded-xl bg-black"
            />
          )}
        </div>
        <div className="flex items-center justify-between w-full text-xs text-white/60 font-mono">
          <span>{fullDateLabel(it.date)}</span>
          {it.place && <span className="text-rose">{it.place}</span>}
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
          >
            close · esc
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
