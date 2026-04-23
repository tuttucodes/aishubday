"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type RevealCtx = {
  unlocked: boolean;
  skipAll: boolean;
  unlock: () => void;
};

const Ctx = createContext<RevealCtx | null>(null);

const SECRET = "1212";

export function RevealProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [skipAll, setSkipAll] = useState(false);
  const unlock = useCallback(() => setUnlocked(true), []);
  const buf = useRef("");
  const lastAt = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!/^[0-9]$/.test(e.key)) return;
      const now = performance.now();
      if (now - lastAt.current > 2500) buf.current = "";
      lastAt.current = now;
      buf.current = (buf.current + e.key).slice(-SECRET.length);
      if (buf.current === SECRET) {
        setSkipAll(true);
        setUnlocked(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <Ctx.Provider value={{ unlocked, skipAll, unlock }}>{children}</Ctx.Provider>;
}

export function useReveal() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useReveal outside RevealProvider");
  return v;
}

export function RevealGate({ children }: { children: ReactNode }) {
  const { unlocked } = useReveal();
  if (!unlocked) return null;
  return <>{children}</>;
}
