"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export function Act8Song() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetch("/audio/song.mp3", { method: "HEAD" })
      .then((r) => setExists(r.ok))
      .catch(() => setExists(false));
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  return (
    <section className="relative min-h-[100dvh] bg-[#0a0806] text-white overflow-hidden flex items-center justify-center px-6 scene">
      {/* Ambient mesh glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(201,161,109,0.15), transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,142,160,0.1), transparent 50%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-4 text-center">act · viii</p>
        <h2 className="font-clash text-5xl md:text-7xl text-center mb-4">a song, from me.</h2>
        <p className="text-white/50 text-center mb-12 max-w-md mx-auto">
          {exists === true
            ? "press play. this is the one i sang for you."
            : "this part is still cooking. i wanted to sing one for you — the recording will live right here when it's ready."}
        </p>

        <div className="relative rounded-[2rem] p-2 bg-white/5 hair-dark bezel-inner">
          <div className="rounded-[calc(2rem-0.5rem)] p-8 bg-gradient-to-br from-[#1a0e12] via-[#0d0709] to-[#050505] relative overflow-hidden">
            {/* Animated wave */}
            <div className="flex items-end justify-center gap-1 h-24 mb-8">
              {Array.from({ length: 36 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-rose to-[#ffd27a]"
                  animate={
                    playing
                      ? { height: [`${10 + Math.random() * 30}%`, `${40 + Math.random() * 60}%`, `${10 + Math.random() * 30}%`] }
                      : { height: `${15 + Math.sin(i) * 10}%` }
                  }
                  transition={{ duration: 0.6 + (i % 5) * 0.1, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>

            {exists === true ? (
              <div className="flex items-center gap-4">
                <audio ref={audioRef} src="/audio/song.mp3" onEnded={() => setPlaying(false)} />
                <button
                  onClick={toggle}
                  className="group flex items-center gap-3 pl-6 pr-1.5 py-1.5 rounded-full bg-rose text-black transition-all"
                >
                  <span className="text-sm font-medium">{playing ? "pause" : "play"}</span>
                  <span className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-sm">
                    {playing ? "❚❚" : "▶"}
                  </span>
                </button>
                <p className="text-xs text-white/50 font-mono">for krishnaa · a demo</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                <div className="inline-flex items-center gap-3 pl-4 pr-4 py-2 rounded-full bg-white/5 hair-dark text-xs text-white/60 font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose animate-pulse" />
                  still recording · be patient w me
                </div>
                <p className="text-xs text-white/40 font-mono">
                  (drop file → <code className="text-rose">/public/audio/song.mp3</code>)
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mt-8 font-[var(--font-fraunces)] italic text-white/50 text-lg">
          until then — this space is reserved only for your ears.
        </p>
      </motion.div>
    </section>
  );
}
