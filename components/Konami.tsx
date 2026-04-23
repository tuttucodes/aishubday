"use client";

import { useEffect, useState } from "react";

const SEQ = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

export function Konami() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQ[idx]) {
        idx++;
        if (idx === SEQ.length) {
          setOpen(true);
          idx = 0;
        }
      } else {
        idx = key === SEQ[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-3xl"
      onClick={() => setOpen(false)}
    >
      <div className="max-w-lg px-10 py-14 rounded-[2rem] bg-black/60 hair-dark bezel-inner text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-rose mb-5">you found it</p>
        <p className="font-clash text-4xl mb-6">secret level unlocked</p>
        <p className="text-white/70 leading-relaxed">
          hey chungi. congrats. u cracked the code.
          <br />only u could figure that out.
          <br />i love you. endlessly.
        </p>
        <button
          onClick={() => setOpen(false)}
          className="mt-10 px-6 py-3 rounded-full bg-white text-black text-sm font-medium"
        >
          close
        </button>
      </div>
    </div>
  );
}
