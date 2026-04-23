"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import { CakeScene } from "@/components/three/CakeScene";
import { ClientOnly } from "@/components/ClientOnly";
import { useMicBlow } from "@/lib/useMicBlow";

export function Act7Cake() {
  const { enabled, enable, level, blew, reset } = useMicBlow(0.25);
  const [manualBlow, setManualBlow] = useState(false);
  const blown = blew || manualBlow;

  useEffect(() => {
    if (blown) {
      const confetti = (window as any).__confetti;
      if (confetti) confetti();
    }
  }, [blown]);

  return (
    <section className="relative min-h-[100dvh] bg-gradient-to-b from-[#1a0a12] via-[#0f0610] to-[#050505] overflow-hidden scene">
      <div className="grid md:grid-cols-[1.2fr,1fr] min-h-[100dvh]">
        <div className="relative h-[60vh] md:h-auto">
          <ClientOnly>
            <Canvas
              shadows
              camera={{ position: [0, 2.5, 6], fov: 40 }}
              dpr={[1, 1.5]}
            >
              <ambientLight intensity={0.25} />
              <directionalLight position={[3, 5, 3]} intensity={0.6} color="#ffd9a0" castShadow />
              <CakeScene blownOut={blown} count={21} />
              <ContactShadows position={[0, -1.2, 0]} opacity={0.5} blur={2.5} far={5} />
              <Environment preset="sunset" />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
            </Canvas>
          </ClientOnly>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-4">act · vii</p>
          <h2 className="font-clash text-5xl md:text-7xl mb-3">the cake.</h2>
          <p className="text-white/50 mb-10 max-w-md">
            21 candles. all of them yours. blow — either with your mouth (mic on) or tap the button.
          </p>

          <AnimatePresence mode="wait">
            {!blown ? (
              <motion.div key="b" className="space-y-4" exit={{ opacity: 0, y: -10 }}>
                {!enabled ? (
                  <button
                    onClick={() => enable()}
                    className="group flex items-center gap-3 pl-6 pr-1.5 py-1.5 rounded-full bg-white/5 hair-dark bezel-inner transition-all hover:bg-white/10"
                  >
                    <span className="text-sm">enable mic</span>
                    <span className="w-9 h-9 rounded-full bg-rose/20 flex items-center justify-center text-rose text-sm group-hover:translate-x-1 transition-transform">↗</span>
                  </button>
                ) : (
                  <div className="rounded-[1.5rem] p-5 bg-white/5 hair-dark bezel-inner">
                    <p className="text-xs text-white/60 mb-3 font-mono">listening…</p>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose to-[#ffb56b] transition-all duration-75"
                        style={{ width: `${Math.min(100, level * 400)}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs text-white/40">blow hard into the mic 🎤</p>
                  </div>
                )}

                <button
                  onClick={() => setManualBlow(true)}
                  className="block text-sm text-white/40 underline-offset-4 hover:underline"
                >
                  or tap here to blow them out
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                className="space-y-6"
              >
                <p className="font-[var(--font-fraunces)] italic text-3xl md:text-4xl text-rose">
                  make a wish, chungi.
                </p>
                <p className="text-white/60 max-w-md">
                  (don't tell me what it is. i'll try to earn it.)
                </p>
                <button
                  onClick={() => { setManualBlow(false); reset(); }}
                  className="text-xs text-white/40 underline-offset-4 hover:underline"
                >
                  relight candles
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ConfettiLayer trigger={blown} />
    </section>
  );
}

function ConfettiLayer({ trigger }: { trigger: boolean }) {
  const pieces = Array.from({ length: 80 });
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {pieces.map((_, i) => {
            const colors = ["#ff8ea0", "#c9a16d", "#ffd9a0", "#8b6ec9", "#6dc9b0"];
            const c = colors[i % colors.length];
            const x = Math.random() * 100;
            const delay = Math.random() * 0.4;
            const dur = 2 + Math.random() * 2;
            return (
              <motion.span
                key={i}
                className="absolute w-2 h-3 rounded-sm"
                style={{ left: `${x}%`, top: "-5%", background: c }}
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: "115vh",
                  rotate: 720 + Math.random() * 360,
                  opacity: [1, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{ duration: dur, delay, ease: "easeOut" }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
