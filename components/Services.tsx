"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  Globe,
  Bot,
  Hotel,
  Server,
  Palette,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAnimationToggle } from "@/lib/AnimationContext";
import { LogoMark } from "@/components/Logo";

const EASE = [0.16, 1, 0.3, 1] as const;
const INTRO_KEY = "services-intro-played";
const INTRO_MS = 1600;

const pillIcons: Record<string, LucideIcon> = {
  globe: Globe,
  bot: Bot,
  hotel: Hotel,
  server: Server,
  palette: Palette,
  search: Search,
};

type ServicePill = { icon: string; label: string };

/** "boot" = pre-hydration (all hidden) → "intro" = big pill + ring →
    "page" = pill shrinks into place, heading + satellites compose in. */
type Phase = "boot" | "intro" | "page";

function LiveDotPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-muted" />
      </span>
      {label}
    </span>
  );
}

/** One half of the tilted "Saturn" light trail. The back half passes above
    the pill (behind it), the front half sweeps under it (in front), so the
    ring reads as orbiting the pill in 3D. */
function RingArc({ layer, paused }: { layer: "back" | "front"; paused: boolean }) {
  const d =
    layer === "back"
      ? "M 4 35 A 96 26 0 0 1 196 35"
      : "M 196 35 A 96 26 0 0 1 4 35";
  const gradId = `ring-grad-${layer}`;

  // dust particles trailing the ring along its lower-left sweep
  const particles: [number, number, number][] = [
    [26, 44, 1.3],
    [34, 50, 0.8],
    [45, 56, 1.1],
    [38, 60, 0.7],
    [56, 62, 0.9],
    [50, 66, 0.6],
  ];

  return (
    <motion.svg
      viewBox="0 0 200 70"
      fill="none"
      aria-hidden
      initial={false}
      animate={paused ? { opacity: 0.85 } : { opacity: [0.65, 1, 0.65] }}
      transition={
        paused
          ? { duration: 0 }
          : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
      }
      className={`pointer-events-none absolute left-1/2 top-1/2 w-[180%] -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] ${
        layer === "front" ? "z-20" : "z-0"
      }`}
    >
      <defs>
        {layer === "back" ? (
          <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>
        ) : (
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.5" />
          </linearGradient>
        )}
      </defs>
      <path
        d={d}
        stroke={`url(#${gradId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        className="blur-[3px]"
      />
      <path d={d} stroke={`url(#${gradId})`} strokeWidth="1.6" strokeLinecap="round" />
      {layer === "front" &&
        particles.map(([cx, cy, r], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="#ffffff"
            initial={false}
            animate={paused ? { opacity: 0.35 } : { opacity: [0.1, 0.8, 0.1] }}
            transition={
              paused
                ? { duration: 0 }
                : {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.35,
                  }
            }
          />
        ))}
    </motion.svg>
  );
}

/** The central black brand pill with the orbiting ring. Starts blown up
    during the intro, then shrinks into its slot in the composition. */
function CenterPill({
  phase,
  fromIntro,
  label,
  paused,
}: {
  phase: Phase;
  fromIntro: boolean;
  label: string;
  paused: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={
        phase === "boot"
          ? { opacity: 0, scale: 1.75, y: -48 }
          : phase === "intro"
          ? { opacity: 1, scale: 1.75, y: -48 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={
        phase === "page"
          ? { duration: 0.95, ease: EASE, delay: fromIntro ? 0.1 : 0 }
          : { duration: 0.55, ease: "easeOut" }
      }
      className="relative"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.04] blur-3xl"
      />
      <RingArc layer="back" paused={paused} />
      <div className="relative z-10 flex items-center gap-3 rounded-full border border-[#2c2c2c] bg-gradient-to-b from-[#242424] to-[#141414] px-6 py-3.5 shadow-[0_24px_70px_-12px_rgba(0,0,0,0.85)] sm:px-7 sm:py-4">
        <LogoMark size={30} />
        <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {label}
        </span>
      </div>
      <RingArc layer="front" paused={paused} />
    </motion.div>
  );
}

function ServiceChip({ pill }: { pill: ServicePill }) {
  const Icon = pillIcons[pill.icon] ?? Globe;
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-line bg-gradient-to-b from-[#161616] to-[#0e0e0e] px-4 py-3 shadow-lg shadow-black/40 transition-colors duration-300 hover:border-[#333]">
      <Icon size={16} strokeWidth={1.7} className="shrink-0 text-muted" />
      <span className="truncate text-sm font-medium text-foreground">
        {pill.label}
      </span>
    </div>
  );
}

/** Desktop satellite: chip + hairline connector pointing at the center
    pill. The middle row sits closer to the center, hinting at an orbit. */
function Satellite({
  pill,
  side,
  row,
  index,
  phase,
  fromIntro,
}: {
  pill: ServicePill;
  side: "left" | "right";
  row: number;
  index: number;
  phase: Phase;
  fromIntro: boolean;
}) {
  const delay = phase === "page" ? (fromIntro ? 0.6 : 0.15) + index * 0.08 : 0;
  const arcOffset =
    row === 1 ? (side === "left" ? "sm:translate-x-8" : "sm:-translate-x-8") : "";
  const lineWidth = row === 1 ? "w-8 lg:w-12" : "w-12 lg:w-20";

  const line = (
    <motion.span
      initial={false}
      style={{ originX: side === "left" ? 0 : 1 }}
      animate={
        phase === "page" ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.3 }
      }
      transition={{ duration: 0.6, ease: EASE, delay: delay + 0.1 }}
      className={`h-px shrink-0 ${lineWidth} ${
        side === "left"
          ? "bg-gradient-to-r from-[#3a3a3a] to-transparent"
          : "bg-gradient-to-l from-[#3a3a3a] to-transparent"
      }`}
    />
  );

  return (
    <motion.div
      initial={false}
      animate={
        phase === "page"
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 16, scale: 0.95 }
      }
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={`flex items-center ${arcOffset}`}
    >
      {side === "left" ? (
        <>
          <ServiceChip pill={pill} />
          {line}
        </>
      ) : (
        <>
          {line}
          <ServiceChip pill={pill} />
        </>
      )}
    </motion.div>
  );
}

export default function Services() {
  const { dict } = useLanguage();
  const { paused } = useAnimationToggle();
  const s = dict.services;
  const pills = s.pills as ServicePill[];

  const [phase, setPhase] = useState<Phase>("boot");
  const [fromIntro, setFromIntro] = useState(false);

  // Latest pause state, readable from the mount-only effect below without
  // re-running it (re-running would cancel the intro timer mid-flight).
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    if (pausedRef.current || sessionStorage.getItem(INTRO_KEY)) {
      setPhase("page");
      return;
    }

    setFromIntro(true);
    setPhase("intro");
    const t = setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      setPhase("page");
    }, INTRO_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const left = pills.slice(0, 3);
  const right = pills.slice(3, 6);

  const headDelay = phase === "page" ? (fromIntro ? 0.45 : 0.05) : 0;

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-24 sm:pb-14 sm:pt-28">
        {/* heading */}
        <motion.div
          initial={false}
          animate={
            phase === "page" ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }
          }
          transition={{ duration: 0.7, ease: EASE, delay: headDelay }}
          className="flex flex-col items-center text-center"
        >
          <LiveDotPill label={s.label} />
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-foreground">{s.title1} </span>
            <span className="text-muted-2">{s.title2}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted">{s.subtitle}</p>
        </motion.div>

        {/* orbit composition */}
        <div className="mt-12 w-full max-w-5xl sm:mt-16">
          <div className="grid grid-cols-1 items-center sm:grid-cols-[1fr_auto_1fr]">
            <div className="hidden flex-col items-end gap-7 sm:flex">
              {left.map((pill, row) => (
                <Satellite
                  key={pill.label}
                  pill={pill}
                  side="left"
                  row={row}
                  index={row * 2}
                  phase={phase}
                  fromIntro={fromIntro}
                />
              ))}
            </div>

            <div className="flex justify-center sm:px-6">
              <CenterPill
                phase={phase}
                fromIntro={fromIntro}
                label={dict.nav.logo}
                paused={paused}
              />
            </div>

            <div className="hidden flex-col items-start gap-7 sm:flex">
              {right.map((pill, row) => (
                <Satellite
                  key={pill.label}
                  pill={pill}
                  side="right"
                  row={row}
                  index={row * 2 + 1}
                  phase={phase}
                  fromIntro={fromIntro}
                />
              ))}
            </div>
          </div>

          {/* mobile: chips stack under the pill */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:hidden">
            {pills.map((pill, i) => (
              <motion.div
                initial={false}
                animate={
                  phase === "page"
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 14 }
                }
                transition={{
                  duration: 0.55,
                  ease: EASE,
                  delay: phase === "page" ? (fromIntro ? 0.55 : 0.1) + i * 0.06 : 0,
                }}
                key={pill.label}
              >
                <ServiceChip pill={pill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
