"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type Props = { src: string };

export function Act11Hero({ src }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [exists, setExists] = useState<boolean | null>(null);

  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.85, 1, 1, 0.95]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.4]);

  useEffect(() => {
    fetch(src, { method: "HEAD" })
      .then((r) => setExists(r.ok))
      .catch(() => setExists(false));
  }, [src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || exists !== true) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.play().then(() => setPlaying(true)).catch(() => {});
          } else {
            el.pause();
            setPlaying(false);
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [exists]);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => {});
    else {
      el.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    const next = !muted;
    setMuted(next);
    el.muted = next;
    el.volume = 1;
    if (!next) {
      // unmute needs a user gesture — play call re-arms audio
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <section
      ref={root}
      className="relative min-h-[130dvh] bg-gradient-to-b from-[#050505] via-[#0a0508] to-[#050505] overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,142,160,0.15), transparent 60%)",
          opacity: glow,
        }}
      />

      <div className="sticky top-0 h-[100dvh] flex flex-col items-center justify-center px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-6 md:mb-8"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-3">act · xi</p>
          <h2 className="font-clash text-5xl md:text-7xl glow-rose">a reel. for you.</h2>
          <p className="mt-4 font-[var(--font-fraunces)] italic text-white/55 text-sm md:text-lg max-w-md mx-auto">
            made from every clip i could find. unmute if you want.
          </p>
        </motion.div>

        <motion.div
          className="relative w-full max-w-[min(92vw,420px)] aspect-[9/16] rounded-[2rem] overflow-hidden bg-white/5 hair-dark bezel-inner ambient"
          style={{ scale }}
        >
          {exists === true ? (
            <>
              <video
                ref={videoRef}
                src={src}
                autoPlay
                muted={muted}
                loop
                playsInline
                preload="metadata"
                onClick={toggle}
                onVolumeChange={(e) => setMuted((e.currentTarget as HTMLVideoElement).muted)}
                className="w-full h-full object-cover cursor-pointer"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: playing ? 0 : 1 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <span className="w-16 h-16 rounded-full bg-rose/85 text-black flex items-center justify-center text-2xl shadow-2xl">
                  ▶
                </span>
              </motion.div>

              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-3">
                <button
                  onClick={toggle}
                  className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md hair-dark text-[10px] uppercase tracking-[0.3em] text-white/85 hover:text-rose transition-colors"
                >
                  {playing ? "pause" : "play"}
                </button>
                <button
                  onClick={toggleMute}
                  aria-label={muted ? "unmute" : "mute"}
                  className="group inline-flex items-center gap-2 pl-4 pr-1 py-1 rounded-full bg-rose/90 text-black text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-rose transition-all duration-300"
                >
                  <span>{muted ? "unmute" : "mute"}</span>
                  <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs group-hover:scale-110 transition-transform duration-300">
                    {muted ? "♪" : "✕"}
                  </span>
                </button>
              </div>
            </>
          ) : exists === false ? (
            <ComingSoon />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
                loading…
              </p>
            </div>
          )}
        </motion.div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
          tap to play · scroll on
        </p>
      </div>
    </section>
  );
}

function ComingSoon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center px-6 max-w-xs">
        <p className="font-[var(--font-fraunces)] italic text-white/60 text-lg mb-3">
          still rendering.
        </p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-mono">
          /public/hero-letter.mp4 · coming soon
        </p>
      </div>
    </div>
  );
}
