"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  Globe,
  Bot,
  Hotel,
  Server,
  Palette,
  Search,
  Check,
  X,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAnimationToggle } from "@/lib/AnimationContext";
import { LogoMark } from "@/components/Logo";
import "./ServicesRing.css";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Camera pull-back: fast start, long settle — reads as a physical dolly. */
const CAMERA_EASE = [0.65, 0, 0.18, 1] as const;
const INTRO_KEY = "services-intro-played";
const HOLD_MS = 1050; // close-up hold on the pill before the pull-back
const CAMERA_S = 1.3; // camera pull-back duration (s)

const pillIcons: Record<string, LucideIcon> = {
  globe: Globe,
  bot: Bot,
  hotel: Hotel,
  server: Server,
  palette: Palette,
  search: Search,
};

type ServicePill = {
  icon: string;
  label: string;
  description: string;
  features: string[];
};

/** "boot" = pre-hydration (hidden) → "intro" = camera parked on the pill
    close-up → "page" = camera pulls back and the page assembles. */
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

/** One half of the tilted orbit ring. Both halves render the same full
    ellipse with identical comet layers, clipped to the upper / lower half —
    the back half sits behind the pill, the front half in front of it, so
    the comet visibly passes behind and then in front as it orbits. */
function RingOrbit({ layer, paused }: { layer: "back" | "front"; paused: boolean }) {
  const clipId = `ring-clip-${layer}`;
  const ellipse = "M 4 35 A 96 26 0 1 1 196 35 A 96 26 0 1 1 4 35";

  // stardust trailing under the lower-left sweep
  const particles: [number, number, number][] = [
    [24, 44, 1.2],
    [33, 51, 0.8],
    [45, 57, 1.1],
    [39, 62, 0.7],
    [57, 63, 0.9],
    [51, 67, 0.6],
  ];

  const comet = (
    <>
      <path
        d={ellipse}
        pathLength={100}
        stroke="#ffffff"
        strokeOpacity="0.1"
        strokeWidth="1"
      />
      <path
        d={ellipse}
        pathLength={100}
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="26 74"
        className="animate-ring-orbit blur-[3px]"
      />
      <path
        d={ellipse}
        pathLength={100}
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="14 86"
        className="animate-ring-orbit blur-[1.5px]"
      />
      <path
        d={ellipse}
        pathLength={100}
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="7 93"
        className="animate-ring-orbit"
      />
      <path
        d={ellipse}
        pathLength={100}
        stroke="#ffffff"
        strokeOpacity="0.85"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2.5 97.5"
        className="animate-ring-orbit blur-[4px]"
      />
    </>
  );

  return (
    <svg
      viewBox="0 0 200 70"
      fill="none"
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 w-[132%] -translate-x-1/2 -translate-y-1/2 -rotate-[20deg] ${
        layer === "front" ? "z-20" : "z-0"
      } ${paused ? "[&_.animate-ring-orbit]:[animation-play-state:paused]" : ""}`}
    >
      <defs>
        <clipPath id={clipId}>
          {layer === "back" ? (
            <rect x="-20" y="-20" width="240" height="55" />
          ) : (
            <rect x="-20" y="35" width="240" height="55" />
          )}
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{comet}</g>
      {layer === "front" &&
        particles.map(([cx, cy, r], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="#ffffff"
            initial={false}
            animate={paused ? { opacity: 0.35 } : { opacity: [0.1, 0.85, 0.1] }}
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
    </svg>
  );
}

/** The glossy black brand pill — layered gradients + inset highlights so it
    reads as a lit 3D object even at full-screen close-up. */
function BrandPill({
  label,
  pillRef,
}: {
  label: string;
  pillRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={pillRef}
      className="relative z-10 flex items-center gap-3 rounded-full px-7 py-4 sm:px-8 sm:py-[1.15rem]"
      style={{
        background:
          "linear-gradient(180deg, #343434 0%, #1d1d1d 42%, #0b0b0b 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: [
          "inset 0 1.5px 0 rgba(255,255,255,0.3)", // crisp top rim light
          "inset 0 12px 22px rgba(255,255,255,0.05)", // broad upper sheen
          "inset 0 -12px 20px rgba(0,0,0,0.6)", // lower body falloff
          "0 30px 60px -12px rgba(0,0,0,0.9)", // contact shadow
          "0 70px 130px -30px rgba(0,0,0,0.75)", // ambient shadow
        ].join(", "),
      }}
    >
      {/* soft specular sweep across the top surface */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-[2px] h-[46%] rounded-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 88%)",
          filter: "blur(1px)",
        }}
      />
      <LogoMark size={30} />
      <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {label}
      </span>
    </div>
  );
}

/** Clickable service pill: floats idly, lifts on hover, and — via the shared
    layoutId — morphs into the detail card when opened. */
function ServiceChip({
  pill,
  paused,
  floatDelay = 0,
  open,
  onOpen,
}: {
  pill: ServicePill;
  paused: boolean;
  floatDelay?: number;
  open: boolean;
  onOpen: () => void;
}) {
  const Icon = pillIcons[pill.icon] ?? Globe;
  return (
    <motion.div
      initial={false}
      animate={paused || open ? { y: 0 } : { y: [0, -4, 0] }}
      transition={
        paused || open
          ? { duration: 0.3 }
          : {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: floatDelay,
            }
      }
      className="min-w-0 shrink-0"
    >
      <motion.button
        type="button"
        layoutId={`svc-${pill.icon}`}
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-2xl border border-line bg-gradient-to-b from-[#161616] to-[#0e0e0e] px-4 py-3 text-left shadow-lg shadow-black/40 transition-colors duration-300 hover:border-[#333]"
      >
        <Icon size={16} strokeWidth={1.7} className="shrink-0 text-muted" />
        <span className="truncate text-sm font-medium text-foreground">
          {pill.label}
        </span>
      </motion.button>
    </motion.div>
  );
}

/** Expanded detail card — the chip morphs into this dialog via layoutId. */
function ServiceDetail({
  pill,
  ctaLabel,
  closeLabel,
  onClose,
}: {
  pill: ServicePill;
  ctaLabel: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const Icon = pillIcons[pill.icon] ?? Globe;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-6">
        <motion.div
          layoutId={`svc-${pill.icon}`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          role="dialog"
          aria-modal="true"
          aria-label={pill.label}
          className="pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-[#181818] to-[#0d0d0d] p-6 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-foreground">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <h2 className="text-lg font-semibold text-foreground">
                  {pill.label}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label={closeLabel}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors duration-300 hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {pill.description}
            </p>

            <ul className="mt-5 flex flex-col gap-2.5">
              {pill.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.06, ease: EASE }}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                >
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-2 text-foreground ring-1 ring-line">
                    <Check size={10} strokeWidth={2.6} />
                  </span>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 inline-block"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#2c2c2c] bg-gradient-to-b from-[#242424] to-[#141414] px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:from-[#2c2c2c] hover:to-[#1a1a1a]"
              >
                <Sparkle size={15} className="fill-foreground" />
                {ctaLabel}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

/** Desktop satellite: the chip springs in from its side of the screen, the
    connector line then draws from the chip all the way to the center pill,
    and a light pulse periodically travels outward along it. */
function Satellite({
  pill,
  side,
  index,
  phase,
  baseDelay,
  paused,
  open,
  onOpen,
}: {
  pill: ServicePill;
  side: "left" | "right";
  index: number;
  phase: Phase;
  baseDelay: number;
  paused: boolean;
  open: boolean;
  onOpen: () => void;
}) {
  const delay = baseDelay + index * 0.09;

  const line = (
    <motion.span
      initial={false}
      style={{ originX: side === "left" ? 0 : 1 }}
      animate={
        phase === "page" ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }
      }
      transition={{ duration: 0.7, ease: EASE, delay: delay + 0.24 }}
      className={`relative h-px min-w-4 flex-1 overflow-hidden ${
        side === "left"
          ? "bg-gradient-to-r from-transparent via-[#333333] to-[#464646]"
          : "bg-gradient-to-l from-transparent via-[#333333] to-[#464646]"
      }`}
    >
      {/* light pulse travelling from the pill out to the chip */}
      <motion.span
        initial={false}
        animate={
          paused
            ? { opacity: 0 }
            : {
                left: side === "left" ? ["100%", "-18%"] : ["-18%", "100%"],
                opacity: [0, 0.9, 0],
              }
        }
        transition={
          paused
            ? { duration: 0.3 }
            : {
                duration: 1.9,
                repeat: Infinity,
                repeatDelay: 2.8,
                delay: 2 + index * 0.5,
                ease: "easeInOut",
              }
        }
        className="absolute top-0 h-px w-10 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
    </motion.span>
  );

  return (
    <motion.div
      initial={false}
      animate={
        phase === "page"
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : {
              opacity: 0,
              x: side === "left" ? -36 : 36,
              y: 10,
              scale: 0.9,
            }
      }
      transition={
        phase === "page"
          ? { type: "spring", stiffness: 260, damping: 26, delay }
          : { duration: 0.2 }
      }
      className="flex w-full items-center"
    >
      {side === "left" ? (
        <>
          <ServiceChip
            pill={pill}
            paused={paused}
            floatDelay={index * 0.4}
            open={open}
            onOpen={onOpen}
          />
          {line}
        </>
      ) : (
        <>
          {line}
          <ServiceChip
            pill={pill}
            paused={paused}
            floatDelay={index * 0.4}
            open={open}
            onOpen={onOpen}
          />
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
  const [openPill, setOpenPill] = useState<ServicePill | null>(null);
  // camera framing, measured from the real layout before the intro starts
  const [introScale, setIntroScale] = useState(1);
  const [introY, setIntroY] = useState(0);
  const [originY, setOriginY] = useState<number | null>(null);

  const pillWrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Latest pause state, readable from the mount-only effect without
  // re-running it (a re-run would cancel the intro timer mid-flight).
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useLayoutEffect(() => {
    const wrap = pillWrapRef.current;
    const pillEl = pillRef.current;
    if (!wrap || !pillEl) return;

    // camera origin = the pill's center inside the camera element
    setOriginY(wrap.offsetTop + wrap.offsetHeight / 2);

    // The intro plays once per session — repeat visits get a fast fade-in.
    if (pausedRef.current || sessionStorage.getItem(INTRO_KEY)) {
      setPhase("page");
      return;
    }

    // frame the close-up: pill fills ~62% of the viewport width, centered
    const rect = pillEl.getBoundingClientRect();
    const scale = Math.min(
      4.3,
      Math.max(1.6, (window.innerWidth * 0.62) / rect.width)
    );
    setIntroScale(scale);
    setIntroY(window.innerHeight / 2 - (rect.top + rect.height / 2));
    setFromIntro(true);
    setPhase("intro");

    const t = setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      setPhase("page");
    }, HOLD_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const left = pills.slice(0, 3);
  const right = pills.slice(3, 6);

  // choreography offsets, relative to the camera pull-back starting
  const headDelay = fromIntro ? 0.85 : 0.05;
  const satBase = fromIntro ? 1.05 : 0.15;

  return (
    // reducedMotion="never" is a deliberate product decision: the owner
    // wants the intro identical for every visitor, including reduced-motion
    // users — do not switch this back to "user".
    <MotionConfig reducedMotion="never">
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-24 sm:pb-14 sm:pt-28">
        {/* the "camera": the whole composition scales about the pill's
            center — close-up during the intro, then a smooth pull-back */}
        <motion.div
          initial={false}
          style={{
            transformOrigin: originY !== null ? `50% ${originY}px` : "50% 50%",
          }}
          animate={
            phase === "page"
              ? { scale: 1, y: 0 }
              : { scale: introScale, y: introY }
          }
          transition={
            phase === "page"
              ? { duration: CAMERA_S, ease: CAMERA_EASE }
              : { duration: 0 }
          }
          className="relative flex w-full flex-col items-center"
        >
          {/* heading — masked line reveal once the camera lands */}
          <div className="flex flex-col items-center text-center">
            <motion.span
              initial={false}
              animate={
                phase === "page"
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 14, scale: 0.92 }
              }
              transition={{ duration: 0.6, ease: EASE, delay: headDelay }}
            >
              <LiveDotPill label={s.label} />
            </motion.span>
            <h1 className="mt-5 overflow-hidden text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
              <motion.span
                initial={false}
                animate={
                  phase === "page"
                    ? { opacity: 1, y: "0%", filter: "blur(0px)" }
                    : { opacity: 0, y: "112%", filter: "blur(8px)" }
                }
                transition={{
                  duration: 0.85,
                  ease: EASE,
                  delay: headDelay + 0.08,
                }}
                className="block"
              >
                <span className="text-foreground">{s.title1} </span>
                <span className="text-muted-2">{s.title2}</span>
              </motion.span>
            </h1>
            <motion.p
              initial={false}
              animate={
                phase === "page"
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 16, filter: "blur(6px)" }
              }
              transition={{ duration: 0.65, ease: EASE, delay: headDelay + 0.28 }}
              className="mt-4 max-w-xl text-base text-muted"
            >
              {s.subtitle}
            </motion.p>
          </div>

          {/* orbit composition */}
          <div className="mt-12 w-full max-w-5xl sm:mt-16">
            <div className="grid grid-cols-1 items-center sm:grid-cols-[1fr_auto_1fr]">
              <div className="hidden flex-col gap-7 sm:flex">
                {left.map((pill, i) => (
                  <Satellite
                    key={pill.label}
                    pill={pill}
                    side="left"
                    index={i * 2}
                    phase={phase}
                    baseDelay={satBase}
                    paused={paused}
                    open={openPill?.icon === pill.icon}
                    onOpen={() => setOpenPill(pill)}
                  />
                ))}
              </div>

              <div ref={pillWrapRef} className="flex justify-center sm:px-4">
                {/* the pill + ring fade in as a unit at the very start */}
                <motion.div
                  initial={false}
                  animate={
                    phase === "boot" ? { opacity: 0 } : { opacity: 1 }
                  }
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative"
                >
                  {/* gentle idle float so the hero object never sits dead still */}
                  <motion.div
                    initial={false}
                    animate={paused ? { y: 0 } : { y: [0, -6, 0] }}
                    transition={
                      paused
                        ? { duration: 0.3 }
                        : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
                    }
                    className="relative"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.04] blur-3xl"
                    />
                    <RingOrbit layer="back" paused={paused} />
                    <BrandPill label={dict.nav.logo} pillRef={pillRef} />
                    <RingOrbit layer="front" paused={paused} />
                  </motion.div>
                </motion.div>
              </div>

              <div className="hidden flex-col gap-7 sm:flex">
                {right.map((pill, i) => (
                  <Satellite
                    key={pill.label}
                    pill={pill}
                    side="right"
                    index={i * 2 + 1}
                    phase={phase}
                    baseDelay={satBase}
                    paused={paused}
                    open={openPill?.icon === pill.icon}
                    onOpen={() => setOpenPill(pill)}
                  />
                ))}
              </div>
            </div>

            {/* mobile: chips stack under the pill */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:hidden">
              {pills.map((pill, i) => (
                <motion.div
                  key={pill.label}
                  initial={false}
                  animate={
                    phase === "page"
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 18, scale: 0.9 }
                  }
                  transition={
                    phase === "page"
                      ? {
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                          delay: satBase + i * 0.07,
                        }
                      : { duration: 0.2 }
                  }
                >
                  <ServiceChip
                    pill={pill}
                    paused={paused}
                    floatDelay={i * 0.3}
                    open={openPill?.icon === pill.icon}
                    onOpen={() => setOpenPill(pill)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* pill detail dialog — the clicked chip morphs into this card */}
        <AnimatePresence>
          {openPill && (
            <ServiceDetail
              pill={openPill}
              ctaLabel={s.cta}
              closeLabel={s.close}
              onClose={() => setOpenPill(null)}
            />
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}
