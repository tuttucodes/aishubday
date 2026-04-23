"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { GiftBox } from "@/components/three/GiftBox";
import { ClientOnly } from "@/components/ClientOnly";
import { InViewOnly } from "@/components/InViewOnly";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";

export function Act9Gift() {
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.5 });
  const progress = useTransform(smooth, [0.3, 0.7], [0, 1]);
  const [p, setP] = useState(0);

  useEffect(() => progress.on("change", setP), [progress]);

  return (
    <section
      ref={root}
      className="relative min-h-[200dvh] bg-gradient-to-b from-[#050505] via-[#0a0508] to-[#050505]"
    >
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col">
        <div className="pt-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-3">act · ix</p>
          <h2 className="font-clash text-5xl md:text-7xl">your gift.</h2>
          <p className="mt-3 text-white/50 max-w-md mx-auto text-sm">scroll slowly. or tap.</p>
        </div>

        <div className="flex-1 relative">
          <ClientOnly>
            <InViewOnly rootMargin="600px 0px">
              <Canvas
                shadows="basic"
                camera={{ position: [3, 2.2, 4.5], fov: 40 }}
                dpr={[1, 1.5]}
              >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 6, 5]} intensity={1} color="#ffd9a0" castShadow />
                <directionalLight position={[-3, 3, -2]} intensity={0.4} color="#ff8ea0" />
                <GiftBox progress={opened ? 1 : p} />
                <ContactShadows position={[0, 0, 0]} opacity={0.5} blur={2.5} far={6} />
                <Environment preset="warehouse" />
              </Canvas>
            </InViewOnly>
          </ClientOnly>

          {/* Tap to open shortcut */}
          {!opened && p < 0.4 && (
            <button
              onClick={() => setOpened(true)}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 group flex items-center gap-3 pl-6 pr-1.5 py-1.5 rounded-full bg-white/5 hair-dark bezel-inner text-sm"
            >
              <span>tap to open it now</span>
              <span className="w-9 h-9 rounded-full bg-rose/20 text-rose flex items-center justify-center group-hover:translate-x-1 transition-transform">↗</span>
            </button>
          )}

          <AnimatePresence>
            {(opened || p > 0.85) && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                <div className="max-w-md mx-auto text-center px-6 pointer-events-auto">
                  <p className="font-[var(--font-fraunces)] italic text-white/80 text-xl md:text-2xl mb-3">your real one isn't digital.</p>
                  <p className="font-clash text-4xl md:text-5xl mb-6">check your room.</p>
                  <p className="text-white/50 text-sm">there's a box. open it at breakfast.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
