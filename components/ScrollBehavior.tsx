"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function ScrollBehavior() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only initialize Lenis on non-homepage routes
    if (pathname !== "/") {
      if (!lenisRef.current) {
        const lenis = new Lenis({
          duration: 1.2,
          lerp: 0.1,
          smoothWheel: true,
        });

        lenisRef.current = lenis;

        let rafId: number;
        const raf = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
          cancelAnimationFrame(rafId);
          lenis.destroy();
          lenisRef.current = null;
        };
      }
    } else {
      // If we navigate to the homepage, destroy Lenis
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    }
  }, [pathname]);

  return null;
}
