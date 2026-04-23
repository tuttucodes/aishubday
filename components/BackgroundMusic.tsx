"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { SONGS, type Song } from "@/lib/content";

type MusicCtx = {
  song: Song | null;
  playing: boolean;
  play: (youtubeId: string, startAt?: number) => void;
  pause: () => void;
  toggle: () => void;
};

const Ctx = createContext<MusicCtx | null>(null);

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const song = useMemo(
    () => SONGS.find((s) => s.youtubeId && s.youtubeId === currentId) ?? null,
    [currentId],
  );

  const play = useCallback((youtubeId: string, start = 0) => {
    const el = audioRef.current;
    if (!el) return;
    const nextSrc = `/audio/${youtubeId}.mp3`;
    if (!el.src.endsWith(nextSrc)) {
      el.src = nextSrc;
      el.currentTime = start;
    }
    setCurrentId(youtubeId);
    el.volume = 0.85;
    el.loop = true;
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !currentId) return;
    if (el.paused) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }, [currentId]);

  const value = useMemo<MusicCtx>(
    () => ({ song, playing, play, pause, toggle }),
    [song, playing, play, pause, toggle],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          // Safety: loop should handle this, but if it doesn't, restart.
          const el = audioRef.current;
          if (el) {
            el.currentTime = 0;
            el.play().catch(() => {});
          }
        }}
      />
      <NowPlayingPill />
    </Ctx.Provider>
  );
}

export function useBackgroundMusic() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBackgroundMusic outside provider");
  return v;
}

function NowPlayingPill() {
  const { song, playing, toggle } = useContext(Ctx) ?? {};
  return (
    <AnimatePresence>
      {song && (
        <motion.div
          initial={{ y: 60, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 60, opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="fixed right-4 md:right-6 z-[85]"
          style={{
            bottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="flex items-center gap-2 p-1 pl-3 md:pl-4 rounded-full bg-black/70 backdrop-blur-2xl hair-dark shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] max-w-[min(88vw,340px)]">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${playing ? "bg-rose animate-pulse" : "bg-white/40"}`}
            />
            <div className="flex flex-col leading-tight min-w-0 flex-1">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/45 truncate">
                now playing
              </span>
              <span className="font-[var(--font-fraunces)] italic text-sm text-white/90 truncate">
                {song.title}
              </span>
            </div>
            <button
              onClick={toggle}
              aria-label={playing ? "pause" : "play"}
              className="w-9 h-9 rounded-full bg-rose text-black flex items-center justify-center text-sm hover:scale-105 transition-transform duration-300 shrink-0"
            >
              {playing ? "❚❚" : "▶"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
