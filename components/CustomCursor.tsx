"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false); // over a link / button
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    // Only on devices with a real mouse — phones/tablets report `hover: none`,
    // so the custom cursor (and the native-cursor hiding) is skipped there.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = (e.target as HTMLElement | null)?.closest(
        "a, button, [role=button], [data-cursor]"
      );
      if (target) {
        setActive(true);
        setLabel(target.getAttribute("data-cursor"));
      } else {
        setActive(false);
        setLabel(null);
      }
    };

    const leave = () => setVisible(false);
    const downHandler = () => setDown(true);
    const upHandler = () => setDown(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", downHandler);
    window.addEventListener("mouseup", upHandler);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", downHandler);
      window.removeEventListener("mouseup", upHandler);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [x, y]);

  if (!enabled) return null;

  const hasLabel = Boolean(label);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.span
          className="block rounded-full bg-foreground"
          style={{ translateX: "-50%", translateY: "-50%" }}
          animate={{
            width: active ? 6 : 8,
            height: active ? 6 : 8,
            opacity: hasLabel ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="flex items-center justify-center overflow-hidden border backdrop-blur-sm"
          style={{ translateX: "-50%", translateY: "-50%", borderRadius: 9999 }}
          animate={{
            backgroundColor: hasLabel
              ? "rgba(18,18,18,0.92)"
              : "rgba(245,245,245,0.10)",
            borderColor: hasLabel ? "#2c2c2c" : "rgba(245,245,245,0.45)",
            scale: (hasLabel || active ? 1 : 0) * (down ? 0.9 : 1),
            opacity: hasLabel || active ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        >
          {hasLabel ? (
            <span className="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-foreground">
              {label}
            </span>
          ) : (
            <span style={{ width: 44, height: 44 }} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
