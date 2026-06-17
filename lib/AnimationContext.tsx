"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";

type AnimationContextValue = {
  paused: boolean;
  toggle: () => void;
};

const AnimationContext = createContext<AnimationContextValue | null>(null);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  // Pause all animations when the user switches away from the tab so the
  // WebGL shader and CSS animations don't burn GPU/CPU in the background.
  useEffect(() => {
    const onVisibilityChange = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const paused = manuallyPaused || tabHidden;

  return (
    <AnimationContext.Provider value={{ paused, toggle: () => setManuallyPaused((p) => !p) }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AnimationContext.Provider>
  );
}

export function useAnimationToggle() {
  const ctx = useContext(AnimationContext);
  if (!ctx)
    throw new Error("useAnimationToggle must be used within AnimationProvider");
  return ctx;
}
