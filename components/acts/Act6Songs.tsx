"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { VinylRecord } from "@/components/three/VinylRecord";
import { ClientOnly } from "@/components/ClientOnly";
import { SONGS } from "@/lib/content";

export function Act6Songs() {
  const [hover, setHover] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section className="relative min-h-[100dvh] bg-[#0a0a0a] overflow-hidden scene">
      <div className="grid md:grid-cols-2 min-h-[100dvh]">
        {/* Left: vinyl */}
        <div className="relative h-[60vh] md:h-auto">
          <ClientOnly>
            <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[3, 5, 3]} intensity={1.2} color="#ff8ea0" />
              <directionalLight position={[-3, -2, 3]} intensity={0.5} color="#c9a16d" />
              <VinylRecord spinning={!!playingId} />
              <Environment preset="night" />
            </Canvas>
          </ClientOnly>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]" />
        </div>

        {/* Right: tracklist */}
        <div className="flex flex-col justify-center px-6 md:px-16 py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose mb-4">act · vi</p>
          <h2 className="font-clash text-5xl md:text-7xl mb-3">our songs.</h2>
          <p className="text-white/50 mb-12 max-w-md">
            a mini shelf. the ones that started meaning us. tap play to listen here.
          </p>

          <ol className="space-y-1">
            {SONGS.map((s, i) => {
              const isPlaying = playingId === s.title;
              return (
                <motion.li
                  key={s.title}
                  onMouseEnter={() => setHover(i)}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  className="group py-5 border-b border-white/5 hover:border-rose/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-baseline gap-4 md:gap-6 flex-1 min-w-0">
                      <span className="font-mono text-[10px] text-white/40 w-6 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-[var(--font-fraunces)] italic text-2xl md:text-3xl block leading-tight group-hover:text-rose transition-colors">
                          {s.title}
                        </span>
                        <span className="text-xs text-white/40 uppercase tracking-[0.2em] mt-1 block">
                          {s.artist}
                        </span>
                        {s.note && (
                          <span className="text-xs text-white/35 italic mt-2 block font-[var(--font-fraunces)]">
                            {s.note}
                          </span>
                        )}

                        {/* Play button + external links */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {s.youtubeId && (
                            <button
                              onClick={() =>
                                setPlayingId(isPlaying ? null : s.title)
                              }
                              aria-label={isPlaying ? "pause" : "play"}
                              className={`group/btn inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full transition-all duration-300 hair-dark ${
                                isPlaying
                                  ? "bg-rose text-black"
                                  : "bg-white/5 text-white/85 hover:bg-rose/90 hover:text-black"
                              }`}
                            >
                              <span className="text-[10px] uppercase tracking-[0.25em] font-medium">
                                {isPlaying ? "playing" : "play"}
                              </span>
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-transform duration-300 ${
                                  isPlaying ? "bg-black/15" : "bg-black/10 group-hover/btn:scale-110"
                                }`}
                              >
                                {isPlaying ? "❚❚" : "▶"}
                              </span>
                            </button>
                          )}
                          <a
                            href={s.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-rose/20 hair-dark text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-rose transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose" />
                            youtube
                          </a>
                          {s.spotify && (
                            <a
                              href={s.spotify}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-[#1db954]/20 hair-dark text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-[#1db954] transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1db954]" />
                              spotify
                            </a>
                          )}
                        </div>

                        {/* Inline YouTube embed when playing */}
                        <AnimatePresence initial={false}>
                          {isPlaying && s.youtubeId && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                              className="overflow-hidden mt-4"
                            >
                              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black hair-dark bezel-inner">
                                <iframe
                                  src={`https://www.youtube.com/embed/${s.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                                  title={s.title}
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  allowFullScreen
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  className="absolute inset-0 w-full h-full"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <motion.span
                      className="text-white/30 text-xl shrink-0"
                      animate={{
                        x: hover === i ? 0 : -4,
                        opacity: hover === i ? 1 : 0.4,
                        rotate: isPlaying ? 45 : 0,
                      }}
                    >
                      {isPlaying ? "♪" : "↗"}
                    </motion.span>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <p className="mt-12 text-xs text-white/30 font-mono italic">
            * plays through youtube. side a forever. side b is tomorrow.
          </p>
        </div>
      </div>
    </section>
  );
}
