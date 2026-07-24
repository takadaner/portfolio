"use client";

// Floating scroll-to-top control with a progress ring. Only rendered below
// `xl`, where ProjectsNav's left rail is hidden and the projects list is a
// very long single column with no other way back to the top.
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const RADIUS = 21;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollTopButton({ label }: { label: string }) {
  const [shown, setShown] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Reveal once the reader is a full screen past the top.
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {shown && (
        <motion.button
          type="button"
          aria-label={label}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-20 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface/90 text-foreground backdrop-blur-md transition-colors duration-300 hover:border-muted-2/50 md:bottom-6 xl:hidden"
        >
          {/* progress ring */}
          <svg
            aria-hidden
            viewBox="0 0 48 48"
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          >
            <motion.circle
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              stroke="#b9b1a4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp size={18} strokeWidth={1.8} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
