import { useEffect, useRef, useState, useCallback } from "react";
import type { MPCSong } from "@/lib/mcp-songs";

// ─── Audio Engine Hook ────────────────────────────────────────────────────────
// Manages Web Audio API context + per-pad buffer loading for an MPCSong.
// Polyphonic — the same pad can overlap itself on rapid hits.
// ─────────────────────────────────────────────────────────────────────────────

export function useAudioEngine(song: MPCSong) {
  const contextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<number, AudioBuffer>>(new Map());
  const [loadedPads, setLoadedPads] = useState<Set<number>>(new Set());
  const [failedPads, setFailedPads] = useState<Set<number>>(new Set());
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

  // Load (or reload) all 16 buffers whenever the song changes
  useEffect(() => {
    buffersRef.current.clear();
    setLoadedPads(new Set());
    setFailedPads(new Set());
    setIsLoading(true);

    let cancelled = false;

    const ctx = ensureContext();
    const newLoaded = new Set<number>();
    const newFailed = new Set<number>();

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
            if (!cancelled) newFailed.add(pad.id);
          }
        })
      );

      if (!cancelled) {
        setLoadedPads(new Set(newLoaded));
        setFailedPads(new Set(newFailed));
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [song, ensureContext]);

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
      const buffer = buffersRef.current.get(padId);
      if (!buffer) return;
      const ctx = ensureContext();

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    },
    [ensureContext]
  );

  return { triggerPad, loadedPads, failedPads, isLoading };
}
