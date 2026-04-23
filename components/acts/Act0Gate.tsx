"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useScrollLock } from "@/lib/useScrollLock";

const MEMES: { src: string; caption: string }[] = [
  { src: "/memes/please.gif", caption: "pls?? 🥺" },
  { src: "/memes/pikachu.gif", caption: "um wdym no?" },
  { src: "/memes/skeptic.gif", caption: "ok this is embarrassing" },
  { src: "/memes/wow.gif", caption: "are u serious rn" },
  { src: "/memes/fine.gif", caption: "cool. this is fine." },
  { src: "/memes/yes.gif", caption: "answer is yes. always." },
  { src: "/memes/please.gif", caption: "chungi i will cry." },
];

const TEASE_COPY = [
  "wrong answer. try again.",
  "LOL. funny. click yes.",
  "the no button is broken apparently.",
  "ok now i'm just offended.",
  "this is test three of patience.",
  "look me in the eye and click yes.",
  "i made this entire site. please.",
];

export function Act0Gate() {
  const [noClicks, setNoClicks] = useState(0);
  const [passed, setPassed] = useState(false);
  const [gone, setGone] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dodge = () => {
    if (noClicks < 1) return;
    const pad = 80;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = Math.random() * (w - pad * 2) - (w / 2 - pad);
    const y = Math.random() * (h - pad * 2) - (h / 2 - pad);
    setNoPos({ x, y });
  };

  const meme = MEMES[Math.min(noClicks, MEMES.length - 1)];
  const tease = TEASE_COPY[Math.min(noClicks - 1, TEASE_COPY.length - 1)];
  const yesScale = 1 + noClicks * 0.45;
  const noScale = Math.max(0.15, 1 - noClicks * 0.22);
  const noHidden = noClicks >= 6;

  const pass = () => {
    setPassed(true);
    setTimeout(() => setGone(true), 1100);
  };

  useScrollLock("act0-gate", !passed && !gone);

  if (gone) return null;

  return (
    <AnimatePresence>
      {!passed && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[90] bg-[#0a0508] overflow-hidden flex items-center justify-center px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(30px)", scale: 1.04 }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* bg glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(255,142,160,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 50% 110%, rgba(201,161,109,0.12) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10 w-full max-w-xl text-center">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="text-[10px] uppercase tracking-[0.3em] text-rose mb-6"
            >
              for chungi · 04.24.2026
            </motion.p>

            <motion.h1
              layout
              className="font-clash text-5xl md:text-7xl leading-[1] mb-4 text-balance"
            >
              ready for ur gift?
            </motion.h1>

            <motion.p
              layout
              className="font-[var(--font-fraunces)] italic text-white/60 text-lg md:text-xl mb-10"
            >
              a warning: this is not a card. this is a whole universe.
            </motion.p>

            {/* meme gif tile */}
            <div className="mx-auto mb-4 w-48 h-48 md:w-56 md:h-56 rounded-[1.5rem] overflow-hidden bg-white/5 hair-dark bezel-inner relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={meme.src}
                  src={meme.src}
                  alt="meme"
                  initial={{ scale: 0.8, opacity: 0, rotate: -6 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.9, opacity: 0, rotate: 6 }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              </AnimatePresence>
            </div>
            <motion.p
              key={meme.caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-[var(--font-fraunces)] italic text-white/70 text-base mb-6"
            >
              {meme.caption}
            </motion.p>

            <AnimatePresence>
              {noClicks > 0 && (
                <motion.p
                  key={noClicks}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="mb-6 font-[var(--font-fraunces)] italic text-rose text-lg"
                >
                  {tease}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="relative flex items-center justify-center gap-6 flex-wrap">
              <motion.button
                onClick={pass}
                animate={{ scale: yesScale }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                whileHover={{ scale: yesScale * 1.06 }}
                whileTap={{ scale: yesScale * 0.96 }}
                className="group relative flex items-center gap-3 pl-8 pr-1.5 py-2 rounded-full bg-gradient-to-br from-rose to-[#ff6a85] text-black font-medium bezel-inner cursor-pointer"
                style={{ zIndex: 2 }}
              >
                <span className="text-lg">yes, pls</span>
                <span className="w-10 h-10 rounded-full bg-black/15 flex items-center justify-center text-sm group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-transform">
                  ↗
                </span>
              </motion.button>

              {!noHidden ? (
                <motion.button
                  onClick={() => setNoClicks((c) => c + 1)}
                  onMouseEnter={dodge}
                  onFocus={dodge}
                  animate={{
                    scale: noScale,
                    x: noPos?.x ?? 0,
                    y: noPos?.y ?? 0,
                    rotate: noClicks * 6,
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="px-6 py-3 rounded-full bg-white/5 hair-dark bezel-inner text-white/70 text-sm cursor-pointer"
                  style={{ zIndex: 1 }}
                >
                  no
                </motion.button>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-white/30 font-mono italic"
                >
                  (the no button retired.)
                </motion.p>
              )}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-14 text-[10px] uppercase tracking-[0.3em] text-white/25"
            >
              hint · there is only one correct answer.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
