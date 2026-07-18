"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAnimationToggle } from "@/lib/AnimationContext";
import ErrorBoundary from "@/components/ErrorBoundary";

// Aurora renders a WebGL (ogl) shader — load it only on the client.
const Aurora = dynamic(() => import("./Aurora"), { ssr: false });

// Same probe as HeroBackground: skip the canvas entirely where WebGL
// can't be created (sandboxed browsers, disabled hardware acceleration).
function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext)
      .getExtension("WEBGL_lose_context")
      ?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Full-bleed aurora glow pinned to the top of the /experience page,
 * fading into the page background so the timeline stays legible.
 */
export default function ExperienceBackground() {
  const { paused } = useAnimationToggle();

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
      transition={{ duration: 1.4, ease: "easeOut" }}
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[85vh] overflow-hidden"
    >
      {webglReady && (
        <ErrorBoundary fallback={null}>
          <Aurora
            colorStops={["#8c8888", "#857e7e", "#7f7a7a"]}
            amplitude={0.3}
            blend={1}
            paused={paused}
          />
        </ErrorBoundary>
      )}

      {/* Fade the bottom into the page background so content stays legible. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      {/* Soften the very top edge under the navbar. */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/70 to-transparent" />
    </motion.div>
  );
}
