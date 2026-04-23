"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { REASONS } from "@/lib/content";

const HUES = ["#ff8ea0", "#c9a16d", "#3d8b5a", "#8b6ec9", "#d9a5b3", "#6d8bc9", "#c96d9d", "#6dc9b0", "#e8b86d"];

export function Act5Reasons() {
  const root = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <section ref={root} className="relative min-h-[140dvh] bg-gradient-to-b from-[#fef0e8] via-[#fde6d3] to-[#fae0d0] text-[#1a1a1a] overflow-hidden scene">
      <div className="sticky top-0 min-h-[100dvh] flex flex-col justify-center py-24">
        <div className="px-6 md:px-16 mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c84d6d] mb-4">act · v</p>
          <h2 className="font-clash text-5xl md:text-8xl text-balance">
            twenty-one reasons,
            <br />
            <span className="italic font-[var(--font-fraunces)] font-normal text-[#c84d6d]">and still counting.</span>
          </h2>
        </div>

        {/* Row 1 */}
        <motion.div className="marquee-track flex gap-4 whitespace-nowrap mb-6" style={{ rotate }}>
          {[...REASONS, ...REASONS].map((r, i) => (
            <ReasonPill key={i} i={i} text={r} />
          ))}
        </motion.div>
        {/* Row 2 reversed direction */}
        <motion.div
          className="flex gap-4 whitespace-nowrap mb-6"
          animate={{ x: [-500, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...REASONS].reverse().concat([...REASONS].reverse()).map((r, i) => (
            <ReasonPill key={i} i={i + 7} text={r} variant="outline" />
          ))}
        </motion.div>
        {/* Row 3 */}
        <motion.div
          className="flex gap-4 whitespace-nowrap"
          animate={{ x: [0, -800] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {[...REASONS, ...REASONS].map((r, i) => (
            <ReasonPill key={i} i={i + 3} text={r} />
          ))}
        </motion.div>

        <p className="mt-16 px-6 md:px-16 text-sm text-[#7a4a2a] max-w-md">
          (this list is nowhere near complete. but we're pacing ourselves.)
        </p>
      </div>
    </section>
  );
}

function ReasonPill({ text, i, variant = "solid" }: { text: string; i: number; variant?: "solid" | "outline" }) {
  const hue = HUES[i % HUES.length];
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -6, rotate: Math.random() * 6 - 3 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="group shrink-0 px-8 py-5 rounded-full flex items-center gap-3 bezel-inner-light font-[var(--font-fraunces)] italic text-xl md:text-2xl cursor-pointer"
      style={{
        background:
          variant === "solid"
            ? `linear-gradient(135deg, ${hue}33, ${hue}11)`
            : "transparent",
        border: variant === "solid" ? `1px solid ${hue}44` : `1px solid ${hue}77`,
        color: variant === "solid" ? "#2a2218" : hue,
      }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: hue, boxShadow: `0 0 10px ${hue}99` }}
      />
      {text}
    </motion.div>
  );
}
