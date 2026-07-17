"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type MediaItem = {
  src: string;
  kind: "image" | "video";
  title: string;
  desc: string;
  ratio: number; // width / height  (16/9 = landscape, 9/16 = portrait)
  priority?: boolean; // above-the-fold images
  span?: string; // e.g. "col-span-1", "md:col-span-2"
};

/* ------------------------------------------------------------------ */
/*  Animated Image (lazy reveal + blur-up)                             */
/* ------------------------------------------------------------------ */

function AnimatedGalleryImage({
  item,
  onClick,
  className,
}: {
  item: MediaItem;
  onClick: () => void;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative group", className)}>
      <AspectRatio
        ref={ref}
        ratio={item.ratio}
        className="bg-surface/30 relative size-full rounded-xl border border-line overflow-hidden cursor-pointer"
      >
        <Image
          alt={item.title}
          src={item.src}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={item.priority}
          className={cn(
            "object-cover transition-all duration-700 ease-out group-hover:scale-105",
            isInView && !isLoading ? "opacity-100 blur-0" : "opacity-0 blur-sm"
          )}
          onLoad={() => setIsLoading(false)}
          onClick={onClick}
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
          onClick={onClick}
        >
          <p className="text-sm font-medium text-white">{item.title}</p>
          <span className="inline-flex items-center gap-1 text-xs text-amber-300 mt-1">
            <Eye size={12} />
            {item.desc.length > 60 ? item.desc.slice(0, 60) + "…" : item.desc}
          </span>
        </div>
      </AspectRatio>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated Video (autoplay, muted, lazy)                             */
/* ------------------------------------------------------------------ */

function AnimatedGalleryVideo({
  item,
  onClick,
  className,
}: {
  item: MediaItem;
  onClick: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: false, margin: "100px" });

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <div className={cn("relative group", className)}>
      <AspectRatio
        ref={ref}
        ratio={item.ratio}
        className="bg-black relative size-full rounded-xl border border-line overflow-hidden cursor-pointer"
      >
        <video
          ref={videoRef}
          src={item.src}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          onClick={onClick}
        />

        {/* Play badge */}
        <div className="absolute top-3 right-3 rounded-full bg-amber-500/90 p-2 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Play size={14} className="text-white ml-0.5" />
        </div>

        {/* Hover overlay - moved to top to prevent overlap with native video controls */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-start p-4 pointer-events-none"
        >
          <p className="text-sm font-medium text-white">{item.title}</p>
          <span className="inline-flex items-center gap-1 text-xs text-amber-300 mt-1">
            <Eye size={12} />
            {item.desc.length > 60 ? item.desc.slice(0, 60) + "…" : item.desc}
          </span>
        </div>
      </AspectRatio>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function VillaVisualizationsProject() {
  const { lang } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tags = [
    "3D Rendering",
    "Architectural Visualization",
    "Concept Design",
    "Blueprint Overlay",
    "Walkthrough Video",
  ];

  const mediaItems: MediaItem[] = [
    {
      src: "/images/proiecte/villas/Villa.jpg",
      kind: "image",
      ratio: 4 / 5,
      priority: true,
      span: "md:col-span-1",
      title:
        lang === "ro"
          ? "Vilă Minimalistă — Malul Apei"
          : "Minimalist Villa — Waterfront",
      desc:
        lang === "ro"
          ? "Randare fotorealistă a unei vile contemporane pe malul apei, cu suprapunere de schiță arhitecturală."
          : "Photorealistic render of a contemporary waterfront villa with architectural sketch overlay.",
    },
    {
      src: "/images/proiecte/villas/villa.mp4",
      kind: "video",
      ratio: 4 / 5,
      span: "md:col-span-1",
      title:
        lang === "ro"
          ? "Walkthrough Video — Vilă 1"
          : "Walkthrough Video — Villa 1",
      desc:
        lang === "ro"
          ? "Tur video 3D prin interiorul și exteriorul vilei."
          : "3D video tour through the villa interior and exterior.",
    },
    {
      src: "/images/proiecte/villas/contemporary villa in a wooded area.jpg",
      kind: "image",
      ratio: 3 / 4,
      priority: true,
      span: "md:col-span-1",
      title:
        lang === "ro"
          ? "Vilă Contemporană — Zonă Împădurită"
          : "Contemporary Villa — Wooded Area",
      desc:
        lang === "ro"
          ? "Vizualizare concept a unei vile moderne pe mai multe nivele, integrată în peisajul forestier."
          : "Concept visualization of a modern multi-level villa integrated into a forest landscape.",
    },
    {
      src: "/images/proiecte/villas/villa2.mp4",
      kind: "video",
      ratio: 4 / 5,
      span: "md:col-span-1",
      title:
        lang === "ro"
          ? "Walkthrough Video — Vilă 2"
          : "Walkthrough Video — Villa 2",
      desc:
        lang === "ro"
          ? "Animație cinematografică a unei rezidențe de lux."
          : "Cinematic animation of a luxury residence.",
    },
    {
      src: "/images/proiecte/villas/villa3.jpg",
      kind: "image",
      ratio: 4 / 5,
      span: "md:col-span-1",
      title:
        lang === "ro"
          ? "Rezidență — Studiu de Materiale"
          : "Residence — Material Study",
      desc:
        lang === "ro"
          ? "Diagramă arhitecturală detaliată: beton, cărămidă perforată, ventilație naturală și plan de etaj."
          : "Detailed architectural diagram: concrete, perforated brick, natural ventilation and floor plan.",
    },
    {
      src: "/images/proiecte/villas/vlla4.jpg",
      kind: "image",
      ratio: 3 / 4,
      span: "md:col-span-1",
      title:
        lang === "ro"
          ? "Vilă Deșert — Stâncă"
          : "Desert Villa — Cliff Retreat",
      desc:
        lang === "ro"
          ? "Randare concept a unei vile minimaliste într-un peisaj de deșert și stâncă, cu suprapunere de planuri."
          : "Concept render of a minimalist villa set in a desert cliff landscape with blueprint overlay.",
    },
    {
      src: "/images/proiecte/villas/villa5.jpg",
      kind: "image",
      ratio: 4 / 5,
      span: "md:col-span-1",
      title:
        lang === "ro"
          ? "Vilă Lacustră — Planimetrie"
          : "Lakefront Villa — Floor Plan",
      desc:
        lang === "ro"
          ? "Vilă de lux pe malul lacului cu planimetrie suprapusă și acoperiș verde."
          : "Luxury lakefront villa with overlaid floor plan and green roof design.",
    },
    {
      src: "/images/proiecte/villas/villa3.mp4",
      kind: "video",
      ratio: 4 / 5,
      span: "md:col-span-1",
      title:
        lang === "ro"
          ? "Walkthrough Video — Vilă 3"
          : "Walkthrough Video — Villa 3",
      desc:
        lang === "ro"
          ? "Prezentare fluidă a spațiilor interioare și a grădinii."
          : "Fluid showcase of interior spaces and garden areas.",
    },
  ];


  // Keyboard nav in lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % mediaItems.length : null
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + mediaItems.length) % mediaItems.length
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, mediaItems.length]);

  return (
    <div className="min-h-screen bg-[#050505] text-foreground pb-24 pt-32 px-6 sm:px-8">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        
        {/* ============================================================ */}
        {/*  Left Text — Center Gallery — Right Text                       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)_320px] gap-10 xl:gap-20">

          {/* Left Column — Title & Context */}
          <Reveal>
            <div className="lg:sticky lg:top-32 space-y-12">
              
              {/* Back Button */}
              <div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-sm text-muted-2 hover:text-foreground transition-colors group"
                >
                  <ArrowLeft
                    size={16}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  {lang === "ro" ? "Înapoi la proiecte" : "Back to projects"}
                </Link>
              </div>

              {/* Title & Header */}
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl xl:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-amber-400">
                  {lang === "ro"
                    ? "Vizualizări Vile — Randări 3D"
                    : "Villa Visualizations — 3D Renders"}
                </h1>
                <p className="text-lg text-muted mt-2 leading-relaxed">
                  {lang === "ro"
                    ? "Randări fotorealiste și videouri walkthrough ale vilelor și rezidențelor de lux."
                    : "Photorealistic renders and walkthrough videos of luxury villas and residences."}
                </p>
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-surface/50 backdrop-blur px-3.5 py-1 text-xs text-muted font-medium hover:border-amber-500/30 hover:text-amber-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </Reveal>

          {/* Center Column — Bento Grid Gallery (Auto-Scrolling Marquee) */}
          <div className="relative w-full h-[85vh] overflow-hidden rounded-xl border border-line/30 bg-surface/10 shadow-2xl">
            
            {/* Fade masks for top/bottom of the marquee */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />

            {/* Marquee Wrapper */}
            <div className="flex flex-col gap-5 animate-marquee-y hover:[animation-play-state:paused] pt-5">
              
              {/* Original Grid */}
              <div className="grid w-full gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 px-2">
                {mediaItems.map((item, idx) => {
                  if (item.kind === "video") {
                    return (
                      <AnimatedGalleryVideo
                        key={`first-${item.src}-${idx}`}
                        item={item}
                        className={item.span}
                        onClick={() => setLightboxIndex(idx)}
                      />
                    );
                  }

                  return (
                    <AnimatedGalleryImage
                      key={`first-${item.src}-${idx}`}
                      item={item}
                      className={item.span}
                      onClick={() => setLightboxIndex(idx)}
                    />
                  );
                })}
              </div>

              {/* Duplicated Grid for Infinite Loop */}
              <div className="grid w-full gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 px-2" aria-hidden="true">
                {mediaItems.map((item, idx) => {
                  if (item.kind === "video") {
                    return (
                      <AnimatedGalleryVideo
                        key={`dup-${item.src}-${idx}`}
                        item={item}
                        className={item.span}
                        onClick={() => setLightboxIndex(idx)}
                      />
                    );
                  }

                  return (
                    <AnimatedGalleryImage
                      key={`dup-${item.src}-${idx}`}
                      item={item}
                      className={item.span}
                      onClick={() => setLightboxIndex(idx)}
                    />
                  );
                })}
              </div>
              
            </div>
          </div>

          {/* Right Column — Details */}
          <Reveal>
            <div className="lg:sticky lg:top-32 space-y-10 mt-8 lg:mt-0">
              <div className="pt-4 border-t border-line/50">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80 mb-3">
                  {lang === "ro" ? "Despre proiect" : "About"}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {lang === "ro"
                    ? "Randări fotorealiste combinate cu suprapuneri de planuri și schițe arhitecturale. Fiecare vizualizare explorează relația dintre volum, lumină și peisaj."
                    : "Photorealistic renders combined with blueprint and sketch overlays. Each visualization explores the relationship between volume, light, and landscape."}
                </p>
              </div>
              <div className="pt-4 border-t border-line/50">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80 mb-3">
                  {lang === "ro" ? "Materiale" : "Materials"}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {lang === "ro"
                    ? "Beton expus, lemn natural, cărămidă perforată, sticlă panoramică — integrate în peisaje de la malul apei la pădure și deșert."
                    : "Exposed concrete, natural wood, perforated brick, panoramic glass — set in landscapes from waterfront to forest and desert."}
                </p>
              </div>
              <div className="pt-4 border-t border-line/50">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80 mb-3">
                  {lang === "ro" ? "Walkthrough-uri" : "Walkthroughs"}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {lang === "ro"
                    ? "Animații cinematografice care explorează fluiditatea spațiilor interioare și exterioare, redate cu iluminare naturală și textură reală."
                    : "Cinematic animations exploring the fluidity of interior and exterior spaces, rendered with natural lighting and real-world texture."}
                </p>
              </div>
              <div className="pt-4 border-t border-line/50">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80 mb-3">
                  {lang === "ro" ? "Concept" : "Concept"}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {lang === "ro"
                    ? "De la refugii minimaliste la rezidențe urbane — fiecare proiect e gândit la intersecția dintre funcționalitate și experiență vizuală."
                    : "From minimalist retreats to urban residences — each project is conceived at the intersection of functionality and visual experience."}
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* ============================================================ */}
      {/*  Lightbox                                                     */}
      {/* ============================================================ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={20} />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null
                    ? (prev - 1 + mediaItems.length) % mediaItems.length
                    : null
                );
              }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next */}
            <button
              className="absolute right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null
                    ? (prev + 1) % mediaItems.length
                    : null
                );
              }}
            >
              <ChevronRight size={24} />
            </button>

            {/* Content */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {mediaItems[lightboxIndex].kind === "image" ? (
                  <Image
                    src={mediaItems[lightboxIndex].src}
                    alt={mediaItems[lightboxIndex].title}
                    width={1400}
                    height={1050}
                    className="max-h-[80vh] w-auto rounded-lg object-contain"
                    priority
                    unoptimized
                  />
              ) : (
                <video
                  src={mediaItems[lightboxIndex].src}
                  controls
                  autoPlay
                  muted
                  className="max-h-[80vh] w-auto rounded-lg"
                />
              )}

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-sm font-semibold text-white">
                  {mediaItems[lightboxIndex].title}
                </p>
                <p className="text-xs text-white/70 mt-1">
                  {mediaItems[lightboxIndex].desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
