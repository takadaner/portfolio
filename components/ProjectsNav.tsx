"use client";

// Fixed left-rail scroll-spy for the /projects page. Driven by the same
// project list the page renders, so the two never drift apart. Highlights
// the project currently crossing the viewport centre and lets you jump to
// any of them. Desktop-only — it lives in the left margin that only exists
// once the viewport is wider than the centred content column.
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export type ProjectNavItem = { title: string; slug: string };

export default function ProjectsNav({ items }: { items: ProjectNavItem[] }) {
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Track which article is nearest the viewport centre.
  useEffect(() => {
    const visible = new Set<string>();

    const recompute = () => {
      let bestSlug = "";
      let bestDist = Infinity;
      visible.forEach((slug) => {
        const el = document.getElementById(slug);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;
        const dist = Math.abs(centre - window.innerHeight / 2);
        if (dist < bestDist) {
          bestDist = dist;
          bestSlug = slug;
        }
      });
      if (bestSlug) {
        const idx = items.findIndex((it) => it.slug === bestSlug);
        if (idx >= 0) setActive(idx);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        recompute();
      },
      { rootMargin: "-15% 0px -15% 0px", threshold: [0, 0.5, 1] }
    );

    const observed = items
      .map((it) => document.getElementById(it.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    observed.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [items]);

  const goTo = (slug: string) => {
    document
      .getElementById(slug)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <motion.nav
      aria-label="Navigare proiecte"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="fixed left-5 top-28 z-40 hidden xl:block"
    >
      <span className="mb-3 block pl-[2px] font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">
        {String(active + 1).padStart(2, "0")}
        <span className="text-line"> / </span>
        {String(items.length).padStart(2, "0")}
      </span>

      <div className="relative flex flex-col gap-1">
        {/* static track */}
        <span
          aria-hidden
          className="absolute left-2 top-2 bottom-2 w-px -translate-x-1/2 bg-line"
        />
        {/* scroll-driven progress fill */}
        <motion.span
          aria-hidden
          style={{ scaleY: progress }}
          className="absolute left-2 top-2 bottom-2 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-accent via-accent/50 to-transparent"
        />

        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <motion.button
              key={it.slug}
              type="button"
              onClick={() => goTo(it.slug)}
              aria-label={it.title}
              aria-current={isActive ? "true" : undefined}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.55 + i * 0.025,
                type: "spring",
                stiffness: 400,
                damping: 22,
              }}
              className="group relative flex items-center"
            >
              {/* fixed-size hit area keeps every dot centred on the track */}
              <span className="relative z-10 flex h-4 w-4 items-center justify-center">
                {isActive && (
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-accent/40" />
                )}
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-[9px] w-[9px] bg-accent shadow-[0_0_12px_2px_rgba(185,177,164,0.55)]"
                      : "h-[6px] w-[6px] bg-muted-2/50 group-hover:h-2 group-hover:w-2 group-hover:bg-muted"
                  }`}
                />
              </span>

              {/* label — always shown for the active item, on hover otherwise */}
              <span
                className={`pointer-events-none absolute left-7 flex items-center gap-2 whitespace-nowrap rounded-full border bg-surface/90 px-3 py-1 text-xs backdrop-blur-sm transition-all duration-300 ${
                  isActive
                    ? "translate-x-0 border-muted-2/30 text-foreground opacity-100"
                    : "-translate-x-1 border-line text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                <span className="font-mono text-[10px] text-muted-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {it.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
