"use client";

import { motion } from "motion/react";

type Props = {
  variant?: "mark" | "full";
  className?: string;
};

export function Logo({ variant = "mark", className = "" }: Props) {
  if (variant === "mark") {
    return (
      <span
        aria-label="Krishnaa Nair"
        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#0a0508] hair-dark bezel-inner relative ${className}`}
      >
        <span className="font-[var(--font-fraunces)] italic text-white text-lg leading-none tracking-tight -mt-0.5">
          kn
        </span>
        <span className="absolute right-1.5 bottom-1.5 w-1 h-1 rounded-full bg-rose" />
      </span>
    );
  }

  return (
    <span
      aria-label="Krishnaa Nair"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#0a0508] hair-dark bezel-inner relative">
        <span className="font-[var(--font-fraunces)] italic text-white text-xl leading-none tracking-tight -mt-0.5">
          kn
        </span>
        <span className="absolute right-1.5 bottom-1.5 w-1 h-1 rounded-full bg-rose" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-[var(--font-fraunces)] italic text-white text-base">krishnaa</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/50 mt-1">
          n · a · i · r
        </span>
      </span>
    </span>
  );
}

export function LogoBadge() {
  return (
    <motion.a
      href="#act-1"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      className="fixed left-4 md:left-6 z-[70] cursor-pointer"
      style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      aria-label="top · Krishnaa Nair"
    >
      <Logo variant="mark" />
    </motion.a>
  );
}
