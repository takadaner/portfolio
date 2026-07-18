"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAnimationToggle } from "@/lib/AnimationContext";
import ErrorBoundary from "@/components/ErrorBoundary";

// Dither renders a WebGL (three.js) shader — load it only on the client.
const Dither = dynamic(() => import("./Dither"), { ssr: false });

// Probe whether a WebGL context can actually be created. Some environments
// (sandboxed browsers, disabled hardware acceleration) report WebGL as
// unavailable — mounting the Canvas there throws, so we skip it entirely.
function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    // Free the probe context so it doesn't count against the context limit.
    (gl as WebGLRenderingContext)
      .getExtension("WEBGL_lose_context")
      ?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function HeroBackground() {
  const { paused } = useAnimationToggle();
  const zoom = !paused;

  // Stays false during SSR and the first client render (so markup matches),
  // then flips on once we've confirmed WebGL works. Deferred to an idle
  // moment so the three.js chunk (~500KB) never competes with hydration and
  // the hero photo — the background has a 1.1s fade-in anyway.
  const [webglReady, setWebglReady] = useState(false);
  useEffect(() => {
    const probe = () => setWebglReady(isWebGLAvailable());
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(probe, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(probe, 350);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        animate={zoom ? { scale: [1, 1.05] } : { scale: 1 }}
        transition={
          zoom
            ? {
                duration: 8,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }
            : { duration: 0 }
        }
      >
        {webglReady && (
          <ErrorBoundary fallback={null}>
            <Dither
              waveColor={[0.9686274509803922, 0.9686274509803922, 0.9686274509803922]}
              disableAnimation={paused}
              enableMouseInteraction
              mouseRadius={0.1}
              colorNum={14}
              pixelSize={2}
              waveAmplitude={0.45}
              waveFrequency={3}
              waveSpeed={0.02}
            />
          </ErrorBoundary>
        )}
      </motion.div>

      {/* Left scrim — keeps the hero copy readable over the bright dither. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />

      {/* Fade the bottom into the page background so the content + bento stay legible. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
    </motion.div>
  );
}
