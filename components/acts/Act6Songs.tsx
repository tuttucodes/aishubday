"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { VinylRecord } from "@/components/three/VinylRecord";
import { ClientOnly } from "@/components/ClientOnly";
import { InViewOnly } from "@/components/InViewOnly";
import { SONGS } from "@/lib/content";
import { useBackgroundMusic } from "@/components/BackgroundMusic";

export function Act6Songs() {
  const [hover, setHover] = useState(0);
  const { song: current, playing, play, pause } = useBackgroundMusic();

  return (
    <section className="relative min-h-[100dvh] bg-[#0a0a0a] overflow-hidden scene">
      <div className="grid md:grid-cols-2 min-h-[100dvh]">
        {/* Left: vinyl */}
        <div className="relative h-[60vh] md:h-auto">
          <ClientOnly>
            <InViewOnly rootMargin="600px 0px" keepMounted>
              <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[3, 5, 3]} intensity={1.2} color="#ff8ea0" />
                <directionalLight position={[-3, -2, 3]} intensity={0.5} color="#c9a16d" />
                <VinylRecord spinning={playing} />
                <Environment preset="night" />
              </Canvas>
            </InViewOnly>
          </ClientOnly>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]" />
        </div>

        {/* Right: tracklist */}
        <div className="flex flex-col justify-center px-6 md:px-16 py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-4">act · vi</p>
          <h2 className="font-clash text-5xl md:text-7xl mb-3">our songs.</h2>
          <p className="text-white/50 mb-10 max-w-md text-sm md:text-base">
            tap ▶ next to a track — it follows you everywhere on the page.
            tap again to stop.
          </p>

          <ol className="space-y-0">
            {SONGS.map((s, i) => {
              const isCurrent = current?.title === s.title;
              const isPlayingThis = isCurrent && playing;
              const hasId = !!s.youtubeId;

              const onToggle = () => {
                if (!hasId) return;
                if (isPlayingThis) pause();
                else play(s.youtubeId!, s.startAt);
              };

              return (
                <motion.li
                  key={s.title}
                  onMouseEnter={() => setHover(i)}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  className="group py-4 md:py-5 border-b border-white/5 hover:border-rose/40 transition-colors"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* tiny inline play button */}
                    <button
                      onClick={onToggle}
                      disabled={!hasId}
                      aria-label={
                        !hasId
                          ? "youtube id missing"
                          : isPlayingThis
                            ? "pause"
                            : "play"
                      }
                      className={`shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm transition-all duration-300 hair-dark ${
                        isPlayingThis
                          ? "bg-rose text-black shadow-[0_0_24px_rgba(255,142,160,0.5)]"
                          : hasId
                            ? "bg-white/5 text-white/85 hover:bg-rose hover:text-black hover:scale-105"
                            : "bg-white/5 text-white/25 cursor-not-allowed"
                      }`}
                    >
                      {isPlayingThis ? "❚❚" : "▶"}
                    </button>

                    <span className="font-mono text-[10px] text-white/40 w-6 shrink-0 hidden sm:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span
                          className={`font-[var(--font-fraunces)] italic text-xl md:text-2xl leading-tight transition-colors ${
                            isCurrent ? "text-rose" : "group-hover:text-rose text-white"
                          }`}
                        >
                          {s.title}
                        </span>
                        {isPlayingThis && (
                          <EqBars />
                        )}
                      </div>
                      <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] mt-0.5 block">
                        {s.artist}
                      </span>
                      {s.note && hover === i && (
                        <motion.span
                          initial={{ opacity: 0, y: 2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-white/35 italic mt-1 block font-[var(--font-fraunces)]"
                        >
                          {s.note}
                        </motion.span>
                      )}
                    </div>

                    <a
                      href={s.search}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="open in youtube"
                      className="shrink-0 w-8 h-8 rounded-full bg-white/5 hair-dark hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-rose transition-colors text-xs"
                    >
                      ↗
                    </a>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-white/25 font-mono">
            plays via youtube · pill bottom-right controls it
          </p>
        </div>
      </div>
    </section>
  );
}

function EqBars() {
  return (
    <span className="inline-flex items-end gap-[3px] h-4 ml-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] bg-rose rounded-full"
          animate={{
            height: ["25%", "100%", "45%", "80%", "25%"],
          }}
          transition={{
            duration: 0.9 + i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
          style={{ height: "25%" }}
        />
      ))}
    </span>
  );
}
