"use client";

import { useEffect } from "react";

type LenisLike = { stop: () => void; start: () => void };

const locks = new Set<string>();

function getLenis(): LenisLike | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { __lenis?: LenisLike }).__lenis ?? null;
}

function blockEvent(e: KeyboardEvent | WheelEvent | TouchEvent) {
  if (locks.size === 0) return;
  if (e instanceof KeyboardEvent) {
    const blocked = [" ", "Space", "PageDown", "PageUp", "End", "Home", "ArrowDown", "ArrowUp"];
    const target = e.target as HTMLElement | null;
    const tag = target?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (blocked.includes(e.key)) e.preventDefault();
    return;
  }
  e.preventDefault();
}

let listenersAttached = false;
function attachListeners() {
  if (listenersAttached || typeof window === "undefined") return;
  window.addEventListener("keydown", blockEvent as EventListener, { passive: false });
  window.addEventListener("wheel", blockEvent as EventListener, { passive: false });
  window.addEventListener("touchmove", blockEvent as EventListener, { passive: false });
  listenersAttached = true;
}
function detachListeners() {
  if (!listenersAttached || typeof window === "undefined") return;
  window.removeEventListener("keydown", blockEvent as EventListener);
  window.removeEventListener("wheel", blockEvent as EventListener);
  window.removeEventListener("touchmove", blockEvent as EventListener);
  listenersAttached = false;
}

function apply() {
  if (typeof document === "undefined") return;
  const locked = locks.size > 0;
  // Only attach non-passive listeners while actually locked — avoids the
  // "non-passive scroll-blocking listener" perf warning during normal scroll.
  if (locked) attachListeners();
  else detachListeners();
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
  const lenis = getLenis();
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}

export function useScrollLock(name: string, active: boolean) {
  useEffect(() => {
    if (active) {
      locks.add(name);
      apply();
    } else {
      locks.delete(name);
      apply();
    }
    return () => {
      locks.delete(name);
      apply();
    };
  }, [name, active]);
}

export function scrollLockActive() {
  return locks.size > 0;
}
