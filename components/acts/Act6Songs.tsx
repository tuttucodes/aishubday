"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { VinylRecord } from "@/components/three/VinylRecord";
import { SONGS } from "@/lib/content";

export function Act6Songs() {
  const [active, setActive] = useState(0);
  return (
    <section className="relative min-h-[100dvh] bg-[#0a0a0a] overflow-hidden scene">
      <div className="grid md:grid-cols-2 min-h-[100dvh]">
        {/* Left: vinyl */}
        <div className="relative h-[60vh] md:h-auto">
          <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 5, 3]} intensity={1.2} color="#ff8ea0" />
            <directionalLight position={[-3, -2, 3]} intensity={0.5} color="#c9a16d" />
            <VinylRecord spinning />
            <Environment preset="night" />
          </Canvas>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]" />
        </div>

        {/* Right: tracklist */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-4">act · vi</p>
          <h2 className="font-clash text-5xl md:text-7xl mb-3">our songs.</h2>
          <p className="text-white/50 mb-12 max-w-md">
            a mini shelf. the ones that started meaning us.
          </p>

          <ol className="space-y-1">
            {SONGS.map((s, i) => (
              <motion.li
                key={s.title}
                onMouseEnter={() => setActive(i)}
                whileHover={{ x: 8 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="group"
              >
                <a
                  href={s.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-baseline justify-between py-5 border-b border-white/5 hover:border-rose/40 transition-colors"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-[10px] text-white/40 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="font-[var(--font-fraunces)] italic text-2xl md:text-3xl block leading-tight group-hover:text-rose transition-colors">
                        {s.title}
                      </span>
                      <span className="text-xs text-white/40 uppercase tracking-[0.2em] mt-1 block">
                        {s.artist}
                      </span>
                    </div>
                  </div>
                  <motion.span
                    className="text-white/30 group-hover:text-rose"
                    animate={{ x: active === i ? 0 : -4 }}
                  >
                    ↗
                  </motion.span>
                </a>
              </motion.li>
            ))}
          </ol>

          <p className="mt-12 text-xs text-white/30 font-mono italic">
            * side a plays forever. side b is tomorrow.
          </p>
        </div>
      </div>
    </section>
  );
}
