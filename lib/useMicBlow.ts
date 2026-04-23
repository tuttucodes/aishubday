"use client";

import { useEffect, useRef, useState } from "react";

export function useMicBlow(threshold = 0.35) {
  const [enabled, setEnabled] = useState(false);
  const [level, setLevel] = useState(0);
  const [blew, setBlew] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const enable = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let raf: number;
      const loop = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setLevel(rms);
        if (rms > threshold) setBlew(true);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      setEnabled(true);
      return () => cancelAnimationFrame(raf);
    } catch {
      setEnabled(false);
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  return { enabled, enable, level, blew, reset: () => setBlew(false) };
}
