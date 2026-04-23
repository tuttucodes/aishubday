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
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-6">the end · not really</p>
        <h2 className="font-clash text-[12vw] md:text-[8vw] leading-[0.95] glow-rose">
          happy birthday,
          <br />
          <span className="italic font-[var(--font-fraunces)] font-normal">chungi.</span>
        </h2>

        <div className="mt-14 mx-auto max-w-2xl text-left md:text-center space-y-6 font-[var(--font-fraunces)] italic text-white/75 text-lg md:text-xl leading-relaxed">
          <p>
            happy birthday my dearest, sweetest, most beautiful, sexy,
            amazing, kindhearted, supportive — mommy, sisterly, brotherly,
            fatherly, everything…
          </p>
          <p>
            may god bless u. may u get all the good and great things u
            deserve. i hope u keep having the best time of ur life.
          </p>
          <p>
            today is a milestone — and <em className="text-rose not-italic font-medium uppercase tracking-[0.15em] text-sm">you got this</em>. all
            ur businesses, ur internships, ur academics, the traveling u
            dream of — may all of it come true. and yes, we will go for
            that kanye concert.
          </p>
          <p className="text-rose">
            love u to the moon and back. ummaaaaaaaaah.
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2">
          <p className="font-[var(--font-caveat)] text-2xl md:text-3xl text-white/85">
            ninte swantham ennum,
          </p>
          <p className="font-[var(--font-caveat)] text-3xl md:text-4xl text-rose">
            rahul babu k nair
          </p>
        </div>

        <div className="mt-14 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/30">
          <span>{HER.bdayLabel}</span>
          <span className="w-8 h-px bg-white/20" />
          <span>forever · and i mean it</span>
        </div>

        <p className="mt-16 text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
          press ↑ ↑ ↓ ↓ ← → ← → b a for a secret
        </p>
      </motion.div>
    </section>
  );
}
