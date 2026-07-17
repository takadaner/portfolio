"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Play, Eye } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "@/components/Reveal";
import BorderGlow from "@/components/BorderGlow";

type MediaItem = {
  src: string;
  type: "live" | "render";
  title: string;
  desc: string;
  showcase?: boolean;
};

export default function DarkroomProject() {
  const { lang, dict } = useLanguage();
  const [filter, setFilter] = useState<"all" | "live" | "render">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tags = [
    "Projection Mapping",
    "Generative Art",
    "TouchDesigner",
    "MadMapper",
    "Resolume Arena",
    "3D Modeling",
    "Audiovisual Installation"
  ];

  const mediaItems: MediaItem[] = [
    // 1. Portal Room
    {
      src: "/images/darkroom/darkroom5.webp",
      type: "render",
      title: lang === "ro" ? "Portal — Concept 3D" : "Portal — 3D Concept",
      desc: lang === "ro" ? "Studiu inițial pentru geometria și unghiurile de proiecție în spațiul 3D." : "Initial study for projection geometry and angles in 3D space."
    },
    {
      src: "/images/darkroom/darkroom1.webp",
      type: "live",
      title: lang === "ro" ? "Portal — Proiecție Live" : "Portal — Live Projection",
      desc: lang === "ro" ? "Test de proiecție în timp real în camera Portal, calibrând interacțiunea geometrică." : "Real-time projection test in the Portal room, calibrating geometric interaction.",
      showcase: true
    },
    // 2. Odyssey Room
    {
      src: "/images/darkroom/darkroom6.webp",
      type: "render",
      title: lang === "ro" ? "Odyssey — Randare Vizuală" : "Odyssey — Visual Render",
      desc: lang === "ro" ? "Texturi organice generate procedural pentru al doilea spațiu tematic." : "Procedurally generated organic textures for the second themed space."
    },
    {
      src: "/images/darkroom/darkroom2.webp",
      type: "live",
      title: lang === "ro" ? "Odyssey — Flux Generativ" : "Odyssey — Generative Flow",
      desc: lang === "ro" ? "Particule generative care curg pe suprafețele fizice tridimensionale." : "Generative particles flowing over physical three-dimensional surfaces."
    },
    // 3. Link Room
    {
      src: "/images/darkroom/darkroom7.webp",
      type: "render",
      title: lang === "ro" ? "Link — Structură de Date" : "Link — Data Structure",
      desc: lang === "ro" ? "Reprezentare artistică a fluxului de informație digitală." : "Artistic representation of digital information flow."
    },
    {
      src: "/images/darkroom/darkroom11.webp",
      type: "render",
      title: lang === "ro" ? "Cadru din Proiecție (Link)" : "Projection Frame (Link)",
      desc: lang === "ro" ? "Cadru exportat direct din aplicația TouchDesigner la rezoluție înaltă." : "Frame exported directly from the TouchDesigner patch at high resolution."
    },
    {
      src: "/images/darkroom/darkroom3.webp",
      type: "live",
      title: lang === "ro" ? "Link — Interacțiune Optică" : "Link — Optical Interaction",
      desc: lang === "ro" ? "Sincronizare între sunet și vizualurile proiectate pe colțuri." : "Synchronicity between sound and projected corner visuals.",
      showcase: true
    },
    // 4. Alter Ego Room
    {
      src: "/images/darkroom/darkroom8.webp",
      type: "render",
      title: lang === "ro" ? "Alter Ego — Reflexie Digitală" : "Alter Ego — Digital Reflection",
      desc: lang === "ro" ? "Randare conceptuală a oglinzii generative bazate pe senzori." : "Conceptual render of the sensor-based generative mirror."
    },
    {
      src: "/images/darkroom/darkroom9.webp",
      type: "live",
      title: lang === "ro" ? "Alter Ego — Feedback Video" : "Alter Ego — Video Feedback",
      desc: lang === "ro" ? "Efecte generative complexe obținute prin bucle de feedback optic în timp real." : "Complex generative effects achieved via real-time optical feedback loops."
    },
    // 5. Syntesys Room
    {
      src: "/images/darkroom/darkroom12.webp",
      type: "live",
      title: lang === "ro" ? "Syntesys — Finalul Imersiv" : "Syntesys — Immersive Climax",
      desc: lang === "ro" ? "Fuziunea tuturor camerelor tematice într-un spectacol total de lumini." : "The fusion of all themed rooms into a total light show.",
      showcase: true
    },
    // 6. Behind the Scenes / Tech Setup
    {
      src: "/images/darkroom/darmroom4.webp",
      type: "render",
      title: lang === "ro" ? "Setup Tehnic & Hardware" : "Technical Setup & Hardware",
      desc: lang === "ro" ? "Schema de amplasare a videoproiectoarelor în interiorul spațiului." : "Placement schema of the video projectors inside the space.",
      showcase: true
    },
    {
      src: "/images/darkroom/darkroom10.webp",
      type: "render",
      title: lang === "ro" ? "Hartă de Calibrare Geometrică" : "Geometric Calibration Map",
      desc: lang === "ro" ? "Grila utilizată pentru ajustarea fină a keystone-ului." : "Grid used for fine-tuning the projector keystone."
    },
    {
      src: "/images/darkroom/darkroom12.webp",
      type: "render",
      title: lang === "ro" ? "Ajustări de Margini & Blending" : "Edge Blending & Calibration",
      desc: lang === "ro" ? "Configurarea îmbinării dintre cele două proiectoare principale." : "Configuring the blend zone between the two main projectors."
    }
  ];

  const filteredItems = mediaItems.filter(
    (item) => filter === "all" || item.type === filter
  );

  // Handle keyboard navigation in Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredItems.length : null
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <div className="min-h-screen bg-[#050505] text-foreground pb-24 pt-32 px-6 sm:px-8">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-content">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-2 hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            {lang === "ro" ? "Înapoi la proiecte" : "Back to projects"}
          </Link>
        </div>

        {/* Title & Header */}
        <Reveal>
          <div className="flex flex-col gap-4">
            <span className="inline-flex max-w-fit items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
              Interactive Installation
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-purple-400">
              Darkroom — Projection Mapping
            </h1>
            <p className="max-w-2xl text-lg text-muted mt-2 leading-relaxed">
              {lang === "ro"
                ? "Instalație imersivă de projection mapping formată din 5 camere tematice care explorează fuziunea dintre artă generativă, design de sunet și spațiu tridimensional."
                : "Immersive projection mapping installation consisting of 5 themed rooms exploring the fusion of generative art, sound design, and three-dimensional space."}
            </p>
          </div>
        </Reveal>

        {/* Tech Badges */}
        <Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-surface/50 backdrop-blur px-3.5 py-1 text-xs text-muted font-medium hover:border-purple-500/30 hover:text-purple-300 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Project info details */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-12 mt-16 items-start">
          {/* Left Column - Detailed description */}
          <Reveal>
            <div className="space-y-8 text-muted leading-relaxed">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  {lang === "ro" ? "Despre Proiect" : "About the Project"}
                </h2>
                <p>
                  {lang === "ro"
                    ? "Conceptul instalației „Darkroom” s-a născu din dorința de a aduce datele digitale într-un format tangibil și perceput senzorial. Proiectul ghidează spectatorul printr-o călătorie de acțiune și reacțiune, punând sub lupă relația omului cu inteligența artificială și mediul digital înconjurător."
                    : "The concept behind 'Darkroom' emerged from the desire to present digital data in a tangible and sensory format. The project guides the viewer through a journey of action and reaction, highlighting the relationship between human perception, artificial intelligence, and the surrounding digital environment."}
                </p>
                <p>
                  {lang === "ro"
                    ? "Cu o durată totală de 8 minute și utilizând peste 14.000 de cadre individuale randate de la zero, instalația transformă spațiile fizice în portaluri tridimensionale pline de texturi dinamice, modelate după algoritmi naturali și matematici."
                    : "Spanning a total duration of 8 minutes and using over 14,000 individual frames rendered from scratch, the installation transforms physical spaces into three-dimensional portals full of dynamic textures modeled after natural and mathematical algorithms."}
                </p>
              </div>

              {/* The 5 rooms details */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {lang === "ro" ? "Cele 5 Camere Tematice" : "The 5 Themed Rooms"}
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "1. Portal",
                      desc_ro: "Introducerea în lumea digitală, o trecere graduală de la realitatea fizică la cea virtuală.",
                      desc_en: "Introduction to the digital realm, a gradual transition from physical to virtual reality."
                    },
                    {
                      title: "2. Odyssey",
                      desc_ro: "O călătorie cosmică și organică prin structuri de date fluide, estetizate.",
                      desc_en: "A cosmic and organic journey through fluid, aestheticized data structures."
                    },
                    {
                      title: "3. Link",
                      desc_ro: "Explorarea conexiunii dintre om și mașină prin interacțiuni vizuale unghiulare.",
                      desc_en: "Exploring the connection between human and machine through angular visual interactions."
                    },
                    {
                      title: "4. Alter Ego",
                      desc_ro: "O reflexie digitală a conștiinței umane transpusă într-o oglindă generativă.",
                      desc_en: "A digital reflection of human consciousness transposed into a generative mirror."
                    },
                    {
                      title: "5. Syntesys",
                      desc_ro: "Punctul culminant al experienței, unde toate elementele se unesc într-o simfonie completă.",
                      desc_en: "The climax of the experience, where all elements unite into a complete symphony."
                    }
                  ].map((room, idx) => (
                    <li
                      key={idx}
                      className="p-4 rounded-xl border border-line bg-surface/30 backdrop-blur-sm"
                    >
                      <h4 className="font-medium text-foreground mb-1">{room.title}</h4>
                      <p className="text-sm text-muted-2">
                        {lang === "ro" ? room.desc_ro : room.desc_en}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Right Column - Project Metadata */}
          <Reveal>
            <div className="p-6 rounded-2xl border border-line bg-surface/20 backdrop-blur-md space-y-6">
              <h3 className="font-semibold text-foreground text-lg border-b border-line pb-3">
                {lang === "ro" ? "Detalii Proiect" : "Project Details"}
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Rol" : "Role"}</span>
                  <span className="text-foreground font-medium">Concept & Creative Developer</span>
                </div>
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Data" : "Date"}</span>
                  <span className="text-foreground font-medium">2026</span>
                </div>
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Instrumente" : "Software"}</span>
                  <span className="text-foreground font-medium">TouchDesigner, MadMapper, Resolume, Blender</span>
                </div>
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Tip Hardware" : "Hardware Setup"}</span>
                  <span className="text-foreground font-medium">Laser Projectors, Spout routing, MIDI Control</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Gallery section with Filters */}
        <div className="mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {lang === "ro" ? "Galeria Instalației" : "Installation Gallery"}
              </h2>
            </Reveal>

            {/* Filter buttons */}
            <Reveal>
              <div className="flex gap-2 p-1 rounded-full border border-line bg-surface/40 max-w-fit">
                {[
                  { id: "all", label_ro: "Toate", label_en: "All" },
                  { id: "live", label_ro: "Proiecții Live", label_en: "Live Projections" },
                  { id: "render", label_ro: "Randări & Concepte", label_en: "Renders & Concepts" }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFilter(btn.id as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      filter === btn.id
                        ? "bg-foreground text-background"
                        : "text-muted-2 hover:text-foreground"
                    }`}
                  >
                    {lang === "ro" ? btn.label_ro : btn.label_en}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Grid Layout of Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    // src alone isn't unique (one image is reused), so pair it with
                    // the type to keep keys stable across filtering.
                    key={`${item.src}-${item.type}`}
                    onClick={() => setLightboxIndex(idx)}
                    className={`group cursor-pointer relative ${item.showcase ? "md:col-span-2" : ""}`}
                  >
                    <BorderGlow
                      edgeSensitivity={30}
                      glowColor={item.type === "live" ? "290 80 60" : "210 75 55"}
                      backgroundColor="#0d0d0d"
                      borderRadius={16}
                      glowRadius={30}
                      glowIntensity={1.0}
                      colors={item.type === "live" ? ["#c084fc", "#e879f9"] : ["#60a5fa", "#34d399"]}
                      fillOpacity={0.2}
                    >
                      <div className="p-3">
                        <div className={`relative overflow-hidden rounded-xl bg-surface/50 transition-all duration-300 ${
                          item.showcase ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3] md:aspect-[16/10]"
                        }`}>
                          <Image
                            src={item.src}
                            alt={item.title}
                            fill
                            // Animated WebP (live items) must bypass the optimizer to keep moving.
                            unoptimized={item.type === "live"}
                            sizes={item.showcase ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />

                          {/* Overlay Indicator */}
                          <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                            <span className="flex items-center gap-1.5 bg-background/90 text-foreground px-4 py-2 rounded-full text-xs font-semibold border border-line backdrop-blur shadow-lg">
                              {item.type === "live" ? (
                                <Play size={12} className="fill-current text-purple-400" />
                              ) : (
                                <Eye size={12} className="text-blue-400" />
                              )}
                              {lang === "ro" ? "Mărește imaginea" : "Enlarge Image"}
                            </span>
                          </div>

                          {/* Tag Type Badge in corner */}
                          <span className={`absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded backdrop-blur ${
                            item.type === "live"
                              ? "bg-purple-950/70 border border-purple-500/30 text-purple-300"
                              : "bg-blue-950/70 border border-blue-500/30 text-blue-300"
                          }`}>
                            {item.type === "live" ? "Live Map" : "Render"}
                          </span>
                        </div>

                        {/* Title and Short Caption */}
                        <div className="mt-3 px-1 pb-1">
                          <h4 className="font-semibold text-foreground text-sm group-hover:text-purple-300 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-2 mt-1 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </BorderGlow>
                  </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
          >
            {/* Header controls inside lightbox */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white z-55">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-2">
                  {lightboxIndex + 1} / {filteredItems.length}
                </span>
                <span className="font-semibold text-sm sm:text-base mt-0.5">
                  {filteredItems[lightboxIndex].title}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Left and Right Nav Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
                );
              }}
              className="absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null ? (prev + 1) % filteredItems.length : null
                );
              }}
              className="absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Main Image Container */}
            <div
              className="relative w-full max-w-5xl aspect-video max-h-[75vh]"
              onClick={() => setLightboxIndex(null)}
            >
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full relative"
              >
                <Image
                  src={filteredItems[lightboxIndex].src}
                  alt={filteredItems[lightboxIndex].title}
                  fill
                  priority
                  unoptimized={filteredItems[lightboxIndex].type === "live"}
                  className="object-contain"
                  sizes="100vw"
                />
              </motion.div>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-6 max-w-2xl text-center px-4">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {filteredItems[lightboxIndex].desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
