"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Touch-aware tuning: lighter smoothing on mobile so GSAP pins + scrubs
    // stay synced with native touch scroll.
    const isTouch =
      typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

    const lenis = new Lenis({
      duration: isTouch ? 0.9 : 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      // Let native touch drive on mobile — smoother with GSAP pins
      // and avoids double-scroll feel.
      syncTouch: !isTouch,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Forward Lenis scroll to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
  return <>{children}</>;
}
