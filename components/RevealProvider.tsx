"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type RevealCtx = {
  unlocked: boolean;
  unlock: () => void;
};

const Ctx = createContext<RevealCtx | null>(null);

export function RevealProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const unlock = useCallback(() => setUnlocked(true), []);
  return <Ctx.Provider value={{ unlocked, unlock }}>{children}</Ctx.Provider>;
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
