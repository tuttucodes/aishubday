"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";

type Props = { items: GalleryItem[] };

function fullDateLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// ---- Cluster math (apple-watch honeycomb, squircle tiles) ------------------
// Odd rows offset horizontally by half-col = hex-packed look. No clip crop.
const MAX_SCALE = 1;
const MIN_SCALE = 0.42;
const FADE_DIST = 560;

type Layout = { cols: number; tileD: number; colW: number; rowH: number };

function layoutForWidth(w: number): Layout {
  // Mobile → tablet → desktop → wide
  const tileD = w < 520 ? 82 : w < 820 ? 100 : w < 1280 ? 118 : 132;
  const cols = w < 520 ? 9 : w < 820 ? 11 : w < 1280 ? 15 : 17;
  return {
    cols,
    tileD,
    colW: Math.round(tileD * 0.92),
    rowH: Math.round(tileD * 0.88),
  };
}

function hexCoord(i: number, layout: Layout) {
  const col = i % layout.cols;
  const row = Math.floor(i / layout.cols);
  const x = col * layout.colW + (row % 2 === 0 ? 0 : layout.colW / 2);
  const y = row * layout.rowH;
  return { x, y };
}

export function Act10Gallery({ items }: Props) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "photo") return items.filter((i) => i.kind === "image");
    return items.filter((i) => i.kind === "video");
  }, [items, filter]);

  const totals = {
    photos: items.filter((i) => i.kind === "image").length,
    videos: items.filter((i) => i.kind === "video").length,
  };

  if (items.length === 0) return null;

  return (
    <section className="relative min-h-[100dvh] bg-[#040404] text-white overflow-hidden">
      {/* ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 8%, rgba(255,142,160,0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 88% 92%, rgba(201,161,109,0.08), transparent 60%), radial-gradient(ellipse 60% 30% at 50% 50%, rgba(139,110,201,0.06), transparent 70%)",
        }}
      />

      <div className="relative z-10 px-4 md:px-16 pt-24 md:pt-32 pb-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10 md:mb-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70 bg-white/5 hair-dark mb-6">
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
            <p className="mt-5 text-white/45 max-w-lg font-[var(--font-fraunces)] italic text-sm md:text-base">
              {items.length} moments. drag the grid. tap to open.
            </p>
          </div>

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
      </div>

      <HexCluster items={filtered} onOpen={(it) => setActive(it)} />

      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/30 pb-10 font-mono">
        drag · pinch · tap
      </p>

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

function HexCluster({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (it: GalleryItem) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [layout, setLayout] = useState<Layout>(() => layoutForWidth(1280));
  const [renderLimit, setRenderLimit] = useState(40);

  // progressive render — first batch fast, rest on idle
  useEffect(() => {
    if (renderLimit >= items.length) return;
    const cb = () => setRenderLimit(items.length);
    const id =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(cb, { timeout: 600 })
        : (setTimeout(cb, 400) as unknown as number);
    return () => {
      if (typeof cancelIdleCallback !== "undefined" && typeof id === "number")
        cancelIdleCallback(id);
      else clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
    };
  }, [items.length, renderLimit]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setVp({ w, h });
      setLayout(layoutForWidth(w));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // cluster dimensions
  const clusterW = layout.cols * layout.colW + layout.colW / 2;
  const clusterH = Math.ceil(items.length / layout.cols) * layout.rowH + layout.tileD;

  // drag bounds — keep cluster reachable, allow edges to go off screen
  const drag = useMemo(() => {
    if (!vp.w || !vp.h) return undefined;
    const padX = vp.w * 0.25;
    const padY = vp.h * 0.25;
    return {
      left: -(clusterW - vp.w + padX),
      right: padX,
      top: -(clusterH - vp.h + padY),
      bottom: padY,
    };
  }, [vp.w, vp.h, clusterW, clusterH]);

  // initial center
  useEffect(() => {
    if (!vp.w || !vp.h) return;
    panX.set(vp.w / 2 - clusterW / 2);
    panY.set(vp.h / 2 - clusterH / 2 + 40);
  }, [vp.w, vp.h, clusterW, clusterH, panX, panY]);

  return (
    <div
      ref={viewportRef}
      className="relative w-full h-[72dvh] md:h-[80dvh] overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        maskImage:
          "radial-gradient(ellipse 92% 85% at 50% 50%, black 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 92% 85% at 50% 50%, black 55%, transparent 100%)",
      }}
    >
      <motion.div
        className="absolute top-0 left-0"
        style={{
          x: panX,
          y: panY,
          width: clusterW,
          height: clusterH,
          willChange: "transform",
        }}
        drag
        dragMomentum
        dragElastic={0.15}
        dragConstraints={drag}
        dragTransition={{ power: 0.28, timeConstant: 340, bounceStiffness: 120, bounceDamping: 18 }}
      >
        {items.slice(0, renderLimit).map((it, i) => (
          <HexTile
            key={it.id}
            it={it}
            index={i}
            layout={layout}
            panX={panX}
            panY={panY}
            viewportW={vp.w}
            viewportH={vp.h}
            onOpen={() => onOpen(it)}
          />
        ))}
      </motion.div>
    </div>
  );
}

function HexTile({
  it,
  index,
  layout,
  panX,
  panY,
  viewportW,
  viewportH,
  onOpen,
}: {
  it: GalleryItem;
  index: number;
  layout: Layout;
  panX: ReturnType<typeof useMotionValue<number>>;
  panY: ReturnType<typeof useMotionValue<number>>;
  viewportW: number;
  viewportH: number;
  onOpen: () => void;
}) {
  const { x, y } = hexCoord(index, layout);

  const cx = x + layout.tileD / 2;
  const cy = y + layout.tileD / 2;

  const scale = useTransform<number, number>([panX, panY], ([px, py]) => {
    if (!viewportW || !viewportH) return 1;
    const viewCenterCx = -px + viewportW / 2;
    const viewCenterCy = -py + viewportH / 2;
    const d = Math.hypot(cx - viewCenterCx, cy - viewCenterCy);
    const k = Math.min(1, d / FADE_DIST);
    return MAX_SCALE - (MAX_SCALE - MIN_SCALE) * k * k;
  });

  const opacity = useTransform<number, number>([panX, panY], ([px, py]) => {
    if (!viewportW || !viewportH) return 1;
    const d = Math.hypot(
      cx - (-px + viewportW / 2),
      cy - (-py + viewportH / 2),
    );
    const k = Math.min(1, d / (FADE_DIST * 1.15));
    return 1 - 0.5 * k;
  });

  // Near-viewport tiles get eager loading + high fetchpriority. First row too.
  const priority = index < 18;

  return (
    <motion.button
      onClick={onOpen}
      onPointerDown={(e) => {
        const start = { x: e.clientX, y: e.clientY };
        const t = e.currentTarget;
        const upHandler = (ev: PointerEvent) => {
          const dx = Math.abs(ev.clientX - start.x);
          const dy = Math.abs(ev.clientY - start.y);
          if (dx > 5 || dy > 5) t.dataset.dragged = "1";
          else delete t.dataset.dragged;
          window.removeEventListener("pointerup", upHandler);
        };
        window.addEventListener("pointerup", upHandler);
      }}
      onClickCapture={(e) => {
        if ((e.currentTarget as HTMLElement).dataset.dragged === "1") {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      className="absolute group"
      style={{
        left: x,
        top: y,
        width: layout.tileD,
        height: layout.tileD,
        scale,
        opacity,
        transformOrigin: "center",
        willChange: "transform, opacity",
      }}
    >
      <div className="absolute inset-0 rounded-[32%] overflow-hidden bg-[#120a0d] ring-1 ring-white/[0.04] shadow-[0_10px_25px_-10px_rgba(0,0,0,0.6)]">
        {it.kind === "image" ? (
          // raw <img> — thumbs are already 500px JPG, skip Next image pipeline
          // for faster first paint of 185 tiles.
          <img
            src={it.thumb}
            alt={it.label}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "low"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            src={it.src}
            poster={it.thumb}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* rose rim on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[32%] ring-2 ring-inset ring-rose/60" />
        {it.kind === "video" && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-rose/90 text-black text-[7px] uppercase tracking-[0.3em] font-mono pointer-events-none">
            ▸
          </div>
        )}
      </div>
    </motion.button>
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
