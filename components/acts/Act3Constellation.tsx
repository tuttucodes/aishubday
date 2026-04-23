"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type Star = { x: number; y: number; r: number; s: number; hue: string };

// Deterministic RNG → stable SSR + no hydration flicker
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(count: number, seed: number): Star[] {
  const rnd = mulberry32(seed);
  const hues = ["#ffffff", "#ffe4c9", "#ffd7e3", "#e4d2ff"];
  return Array.from({ length: count }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    r: 0.4 + rnd() * 1.6,
    s: 0.3 + rnd() * 1,
    hue: hues[Math.floor(rnd() * hues.length)],
  }));
}

const FAR = buildStars(160, 42);
const NEAR = buildStars(60, 7);

export function Act3Constellation() {
  const root = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start end", "end start"],
  });
  const farY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const nearY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const captionY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const captionOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const captionScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.08]);

  useEffect(() => {
    // force a resize event so GSAP ScrollTrigger (if any upstream) recalculates
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[180dvh] w-full bg-[#030308] overflow-hidden"
    >
      {/* ambient radial */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,142,160,0.08), transparent 60%)",
        }}
      />

      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* Far star layer */}
        <motion.div className="absolute inset-0" style={{ y: farY }}>
          {FAR.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.r}px`,
                height: `${s.r}px`,
                background: s.hue,
                opacity: 0.5 * s.s,
                boxShadow: `0 0 ${s.r * 4}px ${s.hue}`,
                animation: `star-twinkle ${2 + (i % 5) * 0.6}s ease-in-out ${i % 13 * 0.2}s infinite alternate`,
              }}
            />
          ))}
        </motion.div>

        {/* Near stars: bigger, slower parallax */}
        <motion.div className="absolute inset-0" style={{ y: nearY }}>
          {NEAR.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.r * 1.8}px`,
                height: `${s.r * 1.8}px`,
                background: s.hue,
                opacity: 0.8,
                boxShadow: `0 0 ${s.r * 8}px ${s.hue}`,
                animation: `star-twinkle ${3 + (i % 4) * 0.7}s ease-in-out ${i % 9 * 0.25}s infinite alternate`,
              }}
            />
          ))}
        </motion.div>

        {/* Caption */}
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
          style={{ y: captionY, opacity: captionOpacity, scale: captionScale }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-6">act · iii</p>
          <h2 className="font-clash text-5xl sm:text-6xl md:text-[10vw] leading-[0.95] glow-rose max-w-4xl text-balance">
            the stars
            <br />
            <span className="italic font-[var(--font-fraunces)] font-normal">finally aligned.</span>
          </h2>
          <p className="mt-8 font-[var(--font-fraunces)] italic text-white/55 text-base md:text-xl max-w-md">
            college, first week. we just didn&apos;t know yet.
          </p>
        </motion.div>

        {/* Shooting star */}
        <motion.span
          aria-hidden
          className="absolute block h-px bg-gradient-to-r from-transparent via-white to-transparent"
          initial={{ x: "-20%", y: "20%", width: 0, opacity: 0 }}
          animate={{ x: "120%", y: "60%", width: 280, opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 7, ease: "easeOut" }}
          style={{ top: "15%", filter: "drop-shadow(0 0 8px #fff)" }}
        />
      </div>

      <style jsx>{`
        @keyframes star-twinkle {
          0% {
            opacity: 0.25;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}
