import { useEffect, useRef, useState, useCallback } from "react";
import type { MPCSong } from "@/lib/mcp-songs";

// ─── Audio Engine Hook ────────────────────────────────────────────────────────
// Manages Web Audio API context + per-pad buffer loading for an MPCSong.
// Falls back to a 100 ms silent buffer if an audio file can't be fetched.
// Polyphonic — the same pad can overlap itself on rapid hits.
// ─────────────────────────────────────────────────────────────────────────────

export function useAudioEngine(song: MPCSong) {
  const contextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<number, AudioBuffer>>(new Map());
  const [loadedPads, setLoadedPads] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  /** Lazily create (or resume) the AudioContext after the first user gesture */
  const ensureContext = useCallback((): AudioContext => {
    if (!contextRef.current) {
      contextRef.current = new (
        window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext
      )();
    }
    if (contextRef.current.state === "suspended") {
      void contextRef.current.resume();
    }
    return contextRef.current;
  }, []);

  /** 100 ms of silence — used as placeholder when the real file is missing */
  const createSilentBuffer = useCallback(
    (ctx: AudioContext): AudioBuffer =>
      ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.1), ctx.sampleRate),
    []
  );

  // Load (or reload) all 16 buffers whenever the song changes
  useEffect(() => {
    buffersRef.current.clear();
    setLoadedPads(new Set());
    setIsLoading(true);

    let cancelled = false;

    const ctx = ensureContext();
    const newLoaded = new Set<number>();

    void (async () => {
      await Promise.allSettled(
        song.pads.map(async (pad) => {
          try {
            const res = await fetch(pad.audioSrc);
            if (!res.ok) throw new Error("not-found");
            const arrayBuffer = await res.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            if (!cancelled) {
              buffersRef.current.set(pad.id, audioBuffer);
              newLoaded.add(pad.id);
            }
          } catch {
            // Silently fall back — pad will still trigger, just silent
            if (!cancelled) {
              buffersRef.current.set(pad.id, createSilentBuffer(ctx));
            }
          }
        })
      );

      if (!cancelled) {
        setLoadedPads(new Set(newLoaded));
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [song, ensureContext, createSilentBuffer]);

  // Release the hardware audio context when the machine unmounts — browsers
  // cap concurrent AudioContexts, so leaking one per song open eventually
  // kills audio for the whole tab.
  useEffect(() => {
    return () => {
      void contextRef.current?.close().catch(() => {});
      contextRef.current = null;
    };
  }, []);

  /** Play pad `padId` immediately (polyphonic) */
  const triggerPad = useCallback(
    (padId: number) => {
      const ctx = ensureContext();
      const buffer =
        buffersRef.current.get(padId) ?? createSilentBuffer(ctx);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    },
    [ensureContext, createSilentBuffer]
  );

  return { triggerPad, loadedPads, isLoading };
}
