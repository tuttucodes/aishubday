"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LETTER } from "@/lib/content";

export function Act4Letter() {
  const root = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const words = LETTER.split(/(\s+)/).filter(Boolean);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(wordsRef.current, { opacity: 0.12 });
      gsap.to(wordsRef.current, {
        opacity: 1,
        stagger: 0.02,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[200dvh] bg-[var(--paper)] text-[#1a1a1a] paper-tex scene"
    >
      <div className="sticky top-0 min-h-[100dvh] flex flex-col items-center justify-center px-5 md:px-6 py-16 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a6a3e] mb-4 md:mb-6">act · iv</p>
        <h2 className="font-[var(--font-fraunces)] italic text-3xl md:text-6xl mb-10 md:mb-16 text-[#3a2a1a]">
          a letter.
        </h2>

        <div className="max-w-2xl font-[var(--font-fraunces)] text-lg sm:text-xl md:text-3xl leading-[1.55] md:leading-[1.5] text-[#2a2218]" style={{ fontVariationSettings: "'opsz' 144" }}>
          {words.map((w, i) => {
            if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
            return (
              <span
                key={i}
                ref={(el) => {
                  if (el) wordsRef.current[i] = el;
                }}
                className="inline-block"
              >
                {w}
              </span>
            );
          })}
        </div>

        <p className="mt-10 md:mt-16 font-[var(--font-caveat)] text-3xl md:text-4xl text-[#8b3a3a]">
          — yours.
        </p>
      </div>
    </section>
  );
}
