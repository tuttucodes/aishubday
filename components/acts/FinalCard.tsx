"use client";

import { motion } from "motion/react";
import { HER } from "@/lib/content";

export function FinalCard() {
  return (
    <section className="relative min-h-[100dvh] bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,142,160,0.12) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(30px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center px-6"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-6">the end · not really</p>
        <h2 className="font-clash text-[14vw] md:text-[10vw] leading-[0.9] glow-rose">
          happy birthday,
          <br />
          <span className="italic font-[var(--font-fraunces)] font-normal">chungi.</span>
        </h2>
        <p className="mt-10 font-[var(--font-fraunces)] italic text-white/60 text-lg md:text-xl max-w-md mx-auto">
          thank you for being twenty-one with me.
          <br />
          let's keep going.
        </p>

        <div className="mt-14 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/30">
          <span>{HER.bdayLabel}</span>
          <span className="w-8 h-px bg-white/20" />
          <span>forever · tentatively</span>
        </div>

        <p className="mt-20 text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
          press ↑ ↑ ↓ ↓ ← → ← → b a for a secret
        </p>
      </motion.div>
    </section>
  );
}
