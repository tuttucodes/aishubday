"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  const [startAt, setStartAt] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Tracks whether the user explicitly paused. If false, any "paused" /
  // "ended" state from YouTube triggers an auto-resume (handles ad breaks,
  // end-of-track before loop kicks in, brief buffering stalls).
  const userPausedRef = useRef(false);

  const song = useMemo(
    () => SONGS.find((s) => s.youtubeId && s.youtubeId === currentId) ?? null,
    [currentId],
  );

  // postMessage helpers — talk to the YT iframe player.
  const ytCommand = useCallback((func: string, args: unknown[] = []) => {
    const el = iframeRef.current?.contentWindow;
    if (!el) return;
    el.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube.com",
    );
  }, []);

  const play = useCallback(
    (youtubeId: string, start = 0) => {
      userPausedRef.current = false;
      // New track: swap src + rely on autoplay=1. Same track: just resume.
      if (youtubeId !== currentId) {
        setCurrentId(youtubeId);
        setStartAt(start);
      } else {
        ytCommand("playVideo");
      }
      setPlaying(true);
    },
    [currentId, ytCommand],
  );

  const pause = useCallback(() => {
    userPausedRef.current = true;
    ytCommand("pauseVideo");
    setPlaying(false);
  }, [ytCommand]);

  const toggle = useCallback(() => {
    if (!currentId) return;
    if (playing) pause();
    else {
      userPausedRef.current = false;
      ytCommand("playVideo");
      setPlaying(true);
    }
  }, [currentId, playing, pause, ytCommand]);

  // Listen for YT state messages. Auto-resume on any non-user pause /
  // end so the track stays in background until user explicitly pauses.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "onStateChange") {
          // -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=cued
          const state = data.info as number;
          if (state === 1) {
            setPlaying(true);
            return;
          }
          if (state === 0) {
            // Ended — restart same track for a real loop (built-in loop
            // param is flaky for many music videos).
            if (!userPausedRef.current) {
              ytCommand("seekTo", [0, true]);
              ytCommand("playVideo");
            } else {
              setPlaying(false);
            }
          } else if (state === 2) {
            // Paused — if user didn't click pause, nudge back to play.
            // Do NOT seek; preserves current position through buffering
            // or fleeting ad transitions.
            if (!userPausedRef.current) {
              ytCommand("playVideo");
            } else {
              setPlaying(false);
            }
          }
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [ytCommand]);

  const value = useMemo<MusicCtx>(
    () => ({ song, playing, play, pause, toggle }),
    [song, playing, play, pause, toggle],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <BackgroundMusicIframe id={currentId} startAt={startAt} iframeRef={iframeRef} />
      <NowPlayingPill />
    </Ctx.Provider>
  );
}

export function useBackgroundMusic() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBackgroundMusic outside provider");
  return v;
}

// Off-screen iframe that holds the audio. Kept MOUNTED once a track is
// picked — toggling play/pause via postMessage preserves the original
// user-gesture context, so later resumes work without re-gesture.
//
// Dimensions are 320x180 (not 1x1) because some browsers throttle autoplay
// on sub-100px iframes. Positioned off-screen via transform + fixed.
function BackgroundMusicIframe({
  id,
  startAt,
  iframeRef,
}: {
  id: string | null;
  startAt: number;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  if (!id) return null;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const startParam = startAt > 0 ? `&start=${startAt}` : "";
  const src =
    `https://www.youtube.com/embed/${id}` +
    `?autoplay=1&controls=0&modestbranding=1&playsinline=1` +
    `&loop=1&playlist=${id}&rel=0&iv_load_policy=3&enablejsapi=1` +
    `&origin=${encodeURIComponent(origin)}${startParam}`;
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: "-10000px",
        top: 0,
        width: 320,
        height: 180,
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      <iframe
        ref={iframeRef}
        key={`${id}-${startAt}`}
        src={src}
        title="background music"
        allow="autoplay; encrypted-media"
        width={320}
        height={180}
        onLoad={() => {
          // Subscribe to onStateChange events so the provider can
          // auto-resume on end / unexpected pause.
          const w = iframeRef.current?.contentWindow;
          if (!w) return;
          w.postMessage(
            JSON.stringify({ event: "listening", id: `kn-bg-${id}` }),
            "https://www.youtube.com",
          );
          w.postMessage(
            JSON.stringify({
              event: "command",
              func: "addEventListener",
              args: ["onStateChange"],
            }),
            "https://www.youtube.com",
          );
        }}
      />
    </div>
  );
}

// Floating mini-player pill, bottom-right.
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
