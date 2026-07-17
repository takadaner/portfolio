"use client";

import { useState, useRef, useEffect } from "react";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CircleDot, Instagram, Dribbble, Linkedin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAnimationToggle } from "@/lib/AnimationContext";
import HeroBackground from "@/components/HeroBackground";
import ShinyText from "@/components/ShinyText";
import BorderGlow from "@/components/BorderGlow";

const enter = (
  initial: Record<string, number | string>,
  animate: Record<string, number | string>,
  transition: Record<string, number | string>
) => ({ initial, animate, transition });

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Bento card media — renders a silent looping video when the project has one,
// otherwise the still image. The video autoplays by default (its poster keeps
// the frame visible instantly) and only pauses via the global animation
// toggle; reduced motion doesn't stop it, since the user asked for the clip
// here and the pause button remains the manual control.
function BentoCardMedia({
  project,
  priority,
  playing,
}: {
  project: { image: string; imageAlt: string; video?: string };
  priority: boolean;
  playing: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.muted = true; // must be set before play() for autoplay policies
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [playing]);

  if (!project.video) {
    return (
      <Image
        src={project.image}
        alt={project.imageAlt}
        width={1200}
        height={900}
        priority={priority}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={project.video}
      poster={project.image}
      autoPlay={playing}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={project.imageAlt}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
}

// Profile photos cycled in the hero, swapped every few seconds.
const profileImages = [
  "/images/eu/front-face.webp",
  "/images/eu/spate-wall.webp",
  "/images/eu/scaun-pe-fata.webp",
  "/images/eu/pahar-in-mana.webp",
  "/images/eu/bllured2.webp",
];

export default function Hero() {
  const { dict } = useLanguage();
  const { paused } = useAnimationToggle();
  const reduceMotion = useReducedMotion();
  const words = dict.hero.name.split(" ");

  const [bentoPage, setBentoPage] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollCooldown = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Client-only enhancements (motion that depends on reduced-motion, etc.)
  // run after mount so SSR markup and the first client render stay identical.
  useEffect(() => setMounted(true), []);

  // Auto-swipe the profile photo every 5s (pauses with the site's toggle).
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setPhotoIndex((p) => (p + 1) % profileImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  // Flips after mount so carousel page-changes use a snappier transition
  // instead of the staggered initial load-in delays.
  const firstLoad = useRef(true);
  useEffect(() => {
    firstLoad.current = false;
  }, []);

  const totalPages = Math.ceil(dict.projects.items.length / 6);

  // Native wheel listener on the entire hero section so preventDefault works
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onWheel = (e: WheelEvent) => {
      if (scrollCooldown.current) return;
      if (Math.abs(e.deltaY) < 15) return;

      // Infinite loop — wrap from the last page back to the first (and vice versa).
      const totalP = Math.ceil(dict.projects.items.length / 6);
      if (totalP <= 1) return;

      e.preventDefault();
      scrollCooldown.current = true;
      setTimeout(() => (scrollCooldown.current = false), 550);

      setBentoPage((prev) =>
        e.deltaY > 0 ? (prev + 1) % totalP : (prev - 1 + totalP) % totalP
      );
    };

    // Touch swipe (mobile) — swipe up advances to the next page, swipe down
    // goes back, mirroring the upward slide of the page transition.
    let touchStartY = 0;
    let touchStartX = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (scrollCooldown.current) return;

      const totalP = Math.ceil(dict.projects.items.length / 6);
      if (totalP <= 1) return;

      const dy = touchStartY - e.changedTouches[0].clientY;
      const dx = Math.abs(touchStartX - e.changedTouches[0].clientX);

      // Require a deliberate, mostly-vertical swipe.
      if (Math.abs(dy) < 40 || dx > Math.abs(dy)) return;

      scrollCooldown.current = true;
      setTimeout(() => (scrollCooldown.current = false), 550);

      setBentoPage((prev) =>
        dy > 0 ? (prev + 1) % totalP : (prev - 1 + totalP) % totalP
      );
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      section.removeEventListener("wheel", onWheel);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchend", onTouchEnd);
    };
  }, [dict.projects.items.length]);

  // Varied "bento" mosaics on a 4×3 grid — a mix of big squares, small
  // squares, tall and wide rectangles. Each page uses a different
  // arrangement so scrolling reshuffles the shapes.
  const gridLayouts = [
    {
      // big square top-left + wide bands
      grid: "grid-cols-4 grid-rows-3",
      spans: [
        "col-span-2 row-span-2", // big square
        "col-span-2 row-span-1", // wide
        "col-span-1 row-span-1", // small square
        "col-span-1 row-span-1", // small square
        "col-span-2 row-span-1", // wide
        "col-span-2 row-span-1", // wide
      ],
    },
    {
      // big square top-right + small squares
      grid: "grid-cols-4 grid-rows-3",
      spans: [
        "col-span-2 row-span-1", // wide
        "col-span-2 row-span-2", // big square
        "col-span-1 row-span-1", // small square
        "col-span-1 row-span-1", // small square
        "col-span-2 row-span-1", // wide
        "col-span-2 row-span-1", // wide
      ],
    },
    {
      // tall rectangle + extra-wide banner
      grid: "grid-cols-4 grid-rows-3",
      spans: [
        "col-span-1 row-span-2", // tall
        "col-span-3 row-span-1", // extra-wide banner
        "col-span-1 row-span-1", // small square
        "col-span-2 row-span-1", // wide
        "col-span-2 row-span-1", // wide
        "col-span-2 row-span-1", // wide
      ],
    },
  ];

  const mcpProject = dict.projects.items.find((p: any) => p.title.includes("MCP"));
  const heroProjects = dict.projects.items.filter((p: any) => !p.title.includes("MCP"));

  let currentProjects = heroProjects.slice(
    bentoPage * 6,
    bentoPage * 6 + 6
  );

  if (bentoPage === 0 && currentProjects.length >= 5) {
    const arranged = [...currentProjects];
    arranged[0] = heroProjects[3]; // Villa 3D walkthrough video in the big square
    arranged[1] = heroProjects[1];
    arranged[2] = heroProjects[2];
    arranged[3] = mcpProject || ({ title: "empty-3", isEmptySlot: true } as any);
    arranged[4] = heroProjects[4]; // Place Darkroom project in slot 4 instead of empty-4
    arranged[5] = heroProjects[0];
    currentProjects = arranged;
  }
  const currentLayout = gridLayouts[bentoPage % gridLayouts.length];

  // Pixel-glitch transition for the swapping profile photo: slice jumps,
  // contrast/hue flicker and a blur that resolves to sharp. Falls back to a
  // plain crossfade when the visitor prefers reduced motion.
  const photoTransition = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
        exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
      }
    : {
        initial: {
          opacity: 0,
          filter: "blur(10px) contrast(2.2) saturate(2) hue-rotate(-18deg)",
          clipPath: "inset(46% 0 46% 0)",
        },
        animate: {
          opacity: [0, 0.7, 1, 1],
          filter: [
            "blur(10px) contrast(2.2) saturate(2) hue-rotate(-18deg)",
            "blur(5px) contrast(1.6) saturate(1.5) hue-rotate(10deg)",
            "blur(1.5px) contrast(1.15) saturate(1.1) hue-rotate(-4deg)",
            "blur(0px) contrast(1) saturate(1) hue-rotate(0deg)",
          ],
          clipPath: [
            "inset(46% 0 46% 0)",
            "inset(8% 0 62% 0)",
            "inset(58% 0 6% 0)",
            "inset(0% 0 0% 0)",
          ],
          x: ["-12px", "9px", "-4px", "0px"],
          scaleX: [1.06, 0.97, 1.02, 1],
          transition: { duration: 0.75, ease: "easeInOut", times: [0, 0.4, 0.7, 1] },
        },
        exit: {
          opacity: [1, 1, 0],
          transition: { duration: 0.75, ease: "easeInOut", times: [0, 0.8, 1] },
        },
      };

  // Solid green status dot with a slow, smooth expanding halo.
  const pulseDot = (
    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
        animate={{ scale: [1, 2.2], opacity: [0.55, 0] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
    </span>
  );

  const socials = [
    { label: "Instagram", href: "https://www.instagram.com/abduladaner/", Icon: Instagram },
    { label: "Dribbble", href: "https://dribbble.com/", Icon: Dribbble },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/daner-abdula-816425188/", Icon: Linkedin },
  ];

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-start overflow-hidden px-6 pb-24 pt-24 sm:justify-center sm:px-8 sm:pb-6 sm:pt-28"
    >
      <HeroBackground />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-none flex-1 flex-col sm:flex-none lg:grid lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-8">
        {/* LEFT — text block */}
        <div className="max-w-3xl lg:-mt-8 lg:self-start [text-shadow:0_2px_16px_rgba(0,0,0,0.75)]">
          {/* Badge row — role + availability */}
          <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-[32rem] sm:flex-nowrap sm:gap-2">
            {/* Role badge — fade in */}
            <motion.span
              {...enter(
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0 },
                { duration: 0.6, delay: 0.15, ease: "easeOut" }
              )}
              className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border border-line bg-surface/90 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur-md sm:flex-1 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
            >
              <CircleDot strokeWidth={2} className="h-3 w-3 shrink-0 text-foreground sm:h-3.5 sm:w-3.5" />
              {dict.hero.role}
            </motion.span>

            {/* Availability badge — to the right of the role badge */}
            <motion.span
              {...enter(
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0 },
                { duration: 0.6, delay: 0.25, ease: "easeOut" }
              )}
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface/90 px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur-md sm:flex-1 sm:px-3 sm:py-1.5 sm:text-xs"
            >
              {pulseDot}
              {dict.hero.badge}
            </motion.span>
          </div>

          {/* Profile photo — fade in */}
          <motion.div
            {...enter(
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0 },
              { duration: 0.6, delay: 0.25, ease: "easeOut" }
            )}
            className="mt-3 sm:mt-6"
          >
            <div className="relative h-[24vh] w-full overflow-hidden rounded-2xl border border-line bg-surface/50 shadow-2xl sm:h-[42rem] sm:w-[32rem]">
              {/* Static first image until mount — keeps SSR/CSR markup identical. */}
              {!mounted ? (
                <Image
                  src={profileImages[0]}
                  alt="Abdula Daner"
                  fill
                  priority
                  sizes="(min-width: 640px) 512px, 100vw"
                  className="object-cover"
                />
              ) : (
                <AnimatePresence initial={false}>
                  <motion.div
                    key={photoIndex}
                    initial={photoTransition.initial}
                    animate={photoTransition.animate}
                    exit={photoTransition.exit}
                    className="absolute inset-0"
                  >
                    <Image
                      src={profileImages[photoIndex]}
                      alt="Abdula Daner"
                      fill
                      priority={photoIndex === 0}
                      sizes="(min-width: 640px) 512px, 100vw"
                      className="object-cover"
                    />

                    {/* Scanline / pixel-bar flash during the glitch */}
                    {!reduceMotion && (
                      <motion.div
                        aria-hidden
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: [0.6, 0.25, 0] }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="pointer-events-none absolute inset-0 mix-blend-screen"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(0deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 3px)",
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Social links — corner of the photo */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-cursor={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-background/70 text-foreground backdrop-blur-md transition-colors duration-300 hover:bg-foreground hover:text-background"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Name — fades in word by word */}
          <h1 className="mt-4 hidden flex-wrap items-start gap-x-2 text-[2.5rem] font-semibold leading-[0.95] tracking-tight sm:mt-6 sm:flex sm:gap-x-3 sm:text-7xl lg:text-[5.25rem]">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                {...enter(
                  { opacity: 0, y: 12 },
                  { opacity: 1, y: 0 },
                  {
                    duration: 0.6,
                    delay: 0.35 + i * 0.08,
                    ease: "easeOut",
                  }
                )}
                className={`inline-block ${i === 0 ? "text-foreground" : "text-muted-2"
                  }`}
              >
                <ShinyText
                  text={word}
                  speed={3}
                  delay={1}
                  color={i === 0 ? "#e5e5e5" : "#888888"}
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo
                />              </motion.span>
            ))}
            <motion.span
              {...enter(
                { opacity: 0 },
                { opacity: 1 },
                { duration: 0.5, delay: 0.5, ease: "easeOut" }
              )}
              className="mt-2 inline-block"
            >
              <ArrowUpRight
                className="h-6 w-6 text-foreground sm:h-10 sm:w-10"
                strokeWidth={1.5}
              />
            </motion.span>
          </h1>

        </div>

        {/* RIGHT — Project bento carousel */}
        <div className="relative mt-6 flex w-full flex-1 flex-col sm:mt-12 sm:flex-none lg:-mt-8 lg:h-[calc(100svh-8.5rem)] lg:max-h-none lg:min-h-[640px]">
          <div className="relative w-full flex-1 overflow-hidden sm:h-[55vh] sm:min-h-[420px] sm:flex-none lg:min-h-0 lg:flex-1">
            <AnimatePresence mode="wait">
            <motion.div
              key={bentoPage}
              initial={firstLoad.current ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className={`absolute inset-0 grid h-full gap-3 sm:gap-4 ${currentLayout.grid}`}
            >
              {currentProjects.map((project, i) => (
                <motion.div
                  key={project.title}
                  {...(firstLoad.current
                    ? {
                        // Load-in: gentle staggered fade.
                        initial: { opacity: 0, y: 12 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.5, delay: 0.5 + i * 0.05, ease: "easeOut" },
                      }
                    : {
                        // Page change: quick fade + restagger.
                        initial: { opacity: 0, y: 12 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.28, delay: i * 0.03, ease: "easeOut" },
                      })}
                  data-cursor={dict.projects.view}
                  className={`group relative h-full cursor-pointer ${currentLayout.spans[i] ?? ""
                    }`}
                >
                  {(project as any).isEmptySlot ? (
                    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-surface/30 text-muted transition-colors duration-300 hover:border-muted-2 hover:bg-surface/50">
                      <span className="text-sm font-medium tracking-wide">Slot Liber</span>
                    </div>
                  ) : (
                    <Link
                      href={(project as any).href?.startsWith("/") ? (project as any).href : `/projects#${slugify(project.title)}`}
                      className="block h-full"
                    >
                      <BorderGlow
                        className="h-full"
                        edgeSensitivity={40}
                        glowColor="260 70 65"
                        backgroundColor="#0a0a0a"
                        borderRadius={16}
                        glowRadius={30}
                        glowIntensity={1.2}
                        coneSpread={30}
                        colors={["#a78bfa", "#f472b6", "#38bdf8"]}
                        fillOpacity={0.3}
                      >
                        <div className="relative h-full overflow-hidden rounded-xl p-2">
                          <div className="h-full overflow-hidden rounded-lg">
                            <BentoCardMedia
                              project={project as any}
                              priority={bentoPage === 0 && i < 2}
                              playing={!paused}
                            />
                          </div>

                          {/* corner arrow button / Try me badge */}
                          {project.title && project.title.includes("MCP") ? (
                            <div className="absolute bottom-3 left-3 z-10 flex items-center justify-center">
                              <span className="animate-pulse inline-flex items-center justify-center rounded-full border border-line bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background shadow-lg backdrop-blur transition-colors duration-300">
                                Try me
                              </span>
                            </div>
                          ) : (
                            <div className="absolute bottom-3 left-3 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-background/80 backdrop-blur-sm transition-colors duration-300 group-hover:bg-foreground">
                              <ArrowUpRight
                                size={15}
                                className="text-foreground transition-colors duration-300 group-hover:text-background"
                              />
                            </div>
                          )}
                        </div>
                      </BorderGlow>
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Page indicator dots — below the boxes */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setBentoPage(i)}
                className={`h-1.5 rounded-full transition-all duration-400 ${i === bentoPage
                  ? "w-6 bg-foreground"
                  : "w-1.5 bg-foreground/25 hover:bg-foreground/40"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
