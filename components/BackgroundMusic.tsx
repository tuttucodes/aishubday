"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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
  const [startAt, setStartAt] = useState<number>(0);
  const [playing, setPlaying] = useState(false);

  const song = useMemo(
    () => SONGS.find((s) => s.youtubeId && s.youtubeId === currentId) ?? null,
    [currentId],
  );

  const play = useCallback((youtubeId: string, start = 0) => {
    setCurrentId(youtubeId);
    setStartAt(start);
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (!currentId) return;
    setPlaying((p) => !p);
  }, [currentId]);

  const value = useMemo<MusicCtx>(
    () => ({ song, playing, play, pause, toggle }),
    [song, playing, play, pause, toggle],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <BackgroundMusicIframe id={currentId} playing={playing} startAt={startAt} />
      <NowPlayingPill />
    </Ctx.Provider>
  );
}

export function useBackgroundMusic() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBackgroundMusic outside provider");
  return v;
}

// Hidden YouTube iframe that holds the audio. Uses the `loop` playlist trick
// so the same track repeats forever. Re-mounts when track id changes.
function BackgroundMusicIframe({
  id,
  playing,
  startAt,
}: {
  id: string | null;
  playing: boolean;
  startAt: number;
}) {
  if (!id) return null;
  // Unmounting the iframe when paused fully stops audio; remounting on play
  // re-starts. Keying by id+playing forces fresh iframe per state change.
  if (!playing) return null;
  const startParam = startAt > 0 ? `&start=${startAt}` : "";
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&controls=0&modestbranding=1&playsinline=1&loop=1&playlist=${id}&rel=0&iv_load_policy=3${startParam}`;
  return (
    <iframe
      key={`${id}-${playing}-${startAt}`}
      src={src}
      title="background music"
      allow="autoplay; encrypted-media"
      aria-hidden
      className="fixed bottom-0 left-0 w-[1px] h-[1px] opacity-0 pointer-events-none"
    />
  );
}

// Floating mini-player pill, bottom-right. Only visible when a track is chosen.
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
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[85]"
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
