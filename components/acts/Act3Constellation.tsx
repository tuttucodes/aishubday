"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const ConstellationCanvas = dynamic(
  () => import("@/components/three/Constellation").then((m) => m.ConstellationCanvas),
  { ssr: false }
);

export function Act3Constellation() {
  return (
    <section className="relative min-h-[120dvh] w-full bg-[#030308] overflow-hidden">
      <div className="absolute inset-0">
        <ConstellationCanvas />
      </div>

      <div className="relative z-10 h-[100dvh] flex flex-col items-center justify-between py-16 px-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          className="text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-4">act · iii</p>
          <h2 className="font-clash text-5xl md:text-7xl">the constellation.</h2>
          <p className="mt-4 text-white/60 max-w-md mx-auto text-sm">
            hover the stars. our memories hide in the dark.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="text-[10px] uppercase tracking-[0.3em] text-white/30 text-center"
        >
          some stars don't show till u look for them.
        </motion.p>
      </div>
    </section>
  );
}
