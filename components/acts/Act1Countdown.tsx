"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import { PetalField } from "@/components/three/PetalField";
import { ClientOnly } from "@/components/ClientOnly";
import { useScrollLock } from "@/lib/useScrollLock";
import { useReveal } from "@/components/RevealProvider";
import { HER, MANUAL_LOCK } from "@/lib/content";

function calcDelta(target: Date) {
  const now = new Date();
  const ms = target.getTime() - now.getTime();
  return {
    total: ms,
    h: Math.max(0, Math.floor(ms / 3_600_000)),
    m: Math.max(0, Math.floor((ms % 3_600_000) / 60_000)),
    s: Math.max(0, Math.floor((ms % 60_000) / 1000)),
    ms: Math.max(0, ms % 1000),
  };
}

export function Act1Countdown() {
  // 5-second countdown from mount → auto-reveal.
  const target = useRef(new Date(Date.now() + 5000));
  const [t, setT] = useState<ReturnType<typeof calcDelta> | null>(null);
  const [arrived, setArrived] = useState(false);
  const [bypass, setBypass] = useState(false);
  const { unlock, skipAll } = useReveal();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (q.get("unlock") === "1") setBypass(true);
    }
    const tick = () => {
      const d = calcDelta(target.current);
      setT(d);
      if (d.total <= 0) {
        setArrived(true);
        return true;
      }
      return false;
    };
    if (tick()) return;
    const id = setInterval(() => { if (tick()) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, []);

  // Konami-lite dev unlock: press "u" five times fast
  useEffect(() => {
    const keys: number[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "u") return;
      const now = performance.now();
      keys.push(now);
      while (keys.length && now - keys[0] > 2500) keys.shift();
      if (keys.length >= 5) setBypass(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Manual lock wins over natural arrival, but bypass (?unlock=1,
  // Konami u×5, secret code 1212) still works so the owner can preview.
  const unlocked = MANUAL_LOCK ? bypass || skipAll : arrived || bypass || skipAll;
  useScrollLock("act1-countdown", !unlocked);

  useEffect(() => {
    if (unlocked) {
      const id = setTimeout(() => unlock(), 2600);
      return () => clearTimeout(id);
    }
  }, [unlocked, unlock]);

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#050505]">
      <div className="absolute inset-0">
        <ClientOnly>
          <Canvas
            camera={{ position: [0, 0, 12], fov: 45 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffbfd1" />
            <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ff4d6d" />
            <fog attach="fog" args={["#050505", 12, 28]} />
            <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.3}>
              <PetalField color="#ffbfd1" />
            </Float>
            <Environment preset="night" />
          </Canvas>
        </ClientOnly>
      </div>

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 142, 160, 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201, 161, 109, 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white/70 hair-dark bezel-inner"
        >
          a small internet · for you
        </motion.span>

        <AnimatePresence mode="wait">
          {!unlocked && t ? (
            <motion.div
              key="counting"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              transition={{ duration: 1 }}
            >
              <p className="font-[var(--font-fraunces)] italic text-white/60 text-xl md:text-2xl mb-6">
                {arrived && MANUAL_LOCK ? "not quite ready. soon." : "counting down to you"}
              </p>
              <div className="flex gap-4 md:gap-8 font-[var(--font-geist-mono)]">
                {[
                  { v: t.h, l: "hrs" },
                  { v: t.m, l: "min" },
                  { v: t.s, l: "sec" },
                ].map((u) => (
                  <div key={u.l} className="flex flex-col items-center">
                    <div className="relative w-20 md:w-32 aspect-square rounded-[1.5rem] bg-white/5 hair-dark bezel-inner flex items-center justify-center overflow-hidden">
                      <span className="font-clash text-4xl md:text-6xl tabular-nums">
                        {String(u.v).padStart(2, "0")}
                      </span>
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)",
                        }}
                      />
                    </div>
                    <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
                      {u.l}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-sm text-white/40 text-center max-w-md">
                {arrived && MANUAL_LOCK
                  ? "the day is here. the rest is being wrapped. one more breath."
                  : "the page is locked until midnight. the curtain lifts at 00:00."}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/35">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-rose/70 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose" />
                </span>
                door · sealed
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="arrived"
              className="flex flex-col items-center"
              initial={{ opacity: 0, filter: "blur(30px)", scale: 0.8 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 2.2, ease: [0.32, 0.72, 0, 1] }}
            >
              <motion.p
                className="mb-4 text-[10px] uppercase tracking-[0.3em] text-rose"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                happy birthday
              </motion.p>
              <motion.h1
                className="font-clash text-[18vw] md:text-[12vw] leading-[0.9] tracking-[-0.05em] text-white text-center glow-rose"
                initial={{ letterSpacing: "0.3em", opacity: 0 }}
                animate={{ letterSpacing: "-0.05em", opacity: 1 }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {HER.firstName}
              </motion.h1>
              <motion.p
                className="mt-4 font-[var(--font-fraunces)] italic text-white/70 text-2xl md:text-3xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
              >
                turning twenty-one.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-[10px] uppercase tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          scroll
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-white/30"
          />
        </motion.div>
      </div>
    </section>
  );
}
