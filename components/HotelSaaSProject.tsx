"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "@/components/Reveal";
import BorderGlow from "@/components/BorderGlow";

type MediaItem = {
  src: string;
  title: string;
  desc: string;
  showcase?: boolean;
};

export default function HotelSaaSProject() {
  const { lang } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tags = [
    "Python",
    "FastAPI",
    "Supabase",
    "Claude API",
    "Meta Cloud API",
    "Next.js",
    "Tailwind CSS",
  ];

  const mediaItems: MediaItem[] = [
    {
      src: "/images/proiecte/Hotel Saas Suite/wapp concierge.webp",
      title: lang === "ro" ? "WhatsApp Concierge AI" : "WhatsApp Concierge AI",
      desc: lang === "ro" ? "Explorare de interfață pentru un asistent digital dedicat întrebărilor uzuale ale oaspeților." : "Interface exploration for a digital assistant focused on common guest questions.",
      showcase: true
    }
  ];

  // Handle keyboard navigation in Lightbox
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
          prev !== null ? (prev - 1 + mediaItems.length) % mediaItems.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, mediaItems.length]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-foreground pb-24 pt-32 px-6 sm:px-8">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[100px]" />
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
              {lang === "ro" ? "Direcție de produs" : "Product direction"}
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-blue-400">
              Hotel SaaS Suite
            </h1>
            <p className="max-w-2xl text-lg text-muted mt-2 leading-relaxed">
              {lang === "ro"
                ? "O direcție de produs pentru unelte digitale dedicate hotelurilor mici: asistență pentru întrebările oaspeților, informații utile și fluxuri de suport mai clare. Concierge-ul este explorarea actuală; celelalte module sunt idei de validat, nu integrări active."
                : "A product direction for digital tools designed for small hotels: help with guest questions, useful information, and clearer support workflows. The concierge is the current exploration; other modules are ideas to validate, not live integrations."}
            </p>
          </div>
        </Reveal>

        {/* Tech Badges */}
        <Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-surface/50 backdrop-blur px-3.5 py-1 text-xs text-muted font-medium hover:border-blue-500/30 hover:text-blue-300 transition-colors"
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
                  {lang === "ro" ? "Direcții de explorat" : "Directions to explore"}
                </h2>
                <p>
                  {lang === "ro"
                    ? "Proiectul pornește de la o întrebare practică: cum pot instrumentele digitale să ajute echipele hoteliere să răspundă mai clar și să reducă pașii repetați? Concierge-ul este explorarea principală de acum."
                    : "The project starts with a practical question: how can digital tools help hotel teams respond more clearly and reduce repeated steps? The concierge is the current main exploration."}
                </p>
              </div>

              {/* The services */}
              <div className="space-y-4 pt-4">
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: lang === "ro" ? "Concierge AI pe WhatsApp" : "WhatsApp Concierge AI",
                      desc: lang === "ro" ? "Un asistent ar putea răspunde la întrebările uzuale și i-ar putea ajuta pe oaspeți să ajungă la un membru al echipei pentru cereri speciale." : "An assistant could answer common questions and help guests reach a team member for requests that need a personal touch."
                    },
                    {
                      title: lang === "ro" ? "Website-uri de Hotel" : "Hotel Websites",
                      desc: lang === "ro" ? "Un site hotelier clar ar putea pune la îndemână camerele, facilitățile și informațiile esențiale despre ședere." : "A clear hotel website could make rooms, amenities, and essential stay information easy to find."
                    },
                    {
                      title: lang === "ro" ? "Digital Compendium" : "Digital Compendium",
                      desc: lang === "ro" ? "Un compendiu digital accesibil prin QR ar putea reuni serviciile hotelului, opțiunile de masă și recomandările locale." : "A QR-accessible digital compendium could bring together hotel services, dining options, and local recommendations."
                    },
                    {
                      title: lang === "ro" ? "Review Automator" : "Review Automator",
                      desc: lang === "ro" ? "Un flux de feedback ar putea colecta sugestii după ședere și invita oaspeții să-și împărtășească experiența fără a filtra recenziile publice." : "A feedback flow could collect suggestions after a stay and invite guests to share their experience without filtering public reviews."
                    }
                  ].map((service, idx) => (
                    <li
                      key={idx}
                      className="p-4 rounded-xl border border-line bg-surface/30 backdrop-blur-sm"
                    >
                      <h4 className="font-medium text-foreground mb-1">{service.title}</h4>
                      <p className="text-sm text-muted-2">
                        {service.desc}
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
                {lang === "ro" ? "Detalii Suită" : "Suite Details"}
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Focus" : "Focus"}</span>
                  <span className="text-foreground font-medium">B2B Hospitality</span>
                </div>
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Backend propus" : "Proposed backend"}</span>
                  <span className="text-foreground font-medium">Python, FastAPI</span>
                </div>
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Integrări propuse" : "Proposed integrations"}</span>
                  <span className="text-foreground font-medium">Claude AI, Meta API</span>
                </div>
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Obiectiv" : "Goal"}</span>
                  <span className="text-foreground font-medium">{lang === "ro" ? "Răspunsuri mai consecvente la întrebările uzuale" : "More consistent answers to common guest questions"}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Gallery section */}
        <div className="mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
            <Reveal>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {lang === "ro" ? "Explorare vizuală" : "Visual exploration"}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {lang === "ro"
                    ? "Imaginea prezintă direcția vizuală a concierge-ului. Compendiul digital și fluxurile pentru recenzii rămân idei de validat, nu produse conectate."
                    : "The image shows the concierge's visual direction. The digital compendium and review workflows remain ideas to validate, not connected products."}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Grid Layout of Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-10">
            <AnimatePresence mode="popLayout">
              {mediaItems.map((item, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={`${item.src}-${idx}`}
                    onClick={() => setLightboxIndex(idx)}
                    className={`group cursor-pointer relative ${item.showcase ? "md:col-span-2" : ""}`}
                  >
                    <BorderGlow
                      edgeSensitivity={30}
                      glowColor={"210 75 55"}
                      backgroundColor="#0d0d0d"
                      borderRadius={16}
                      glowRadius={30}
                      glowIntensity={1.0}
                      colors={["#60a5fa", "#34d399"]}
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
                            sizes={item.showcase ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />

                          {/* Overlay Indicator */}
                          <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                            <span className="flex items-center gap-1.5 bg-background/90 text-foreground px-4 py-2 rounded-full text-xs font-semibold border border-line backdrop-blur shadow-lg">
                              <Eye size={12} className="text-blue-400" />
                              {lang === "ro" ? "Mărește imaginea" : "Enlarge Image"}
                            </span>
                          </div>
                        </div>

                        {/* Title and Short Caption */}
                        <div className="mt-3 px-1 pb-1">
                          <h4 className="font-semibold text-foreground text-sm group-hover:text-blue-300 transition-colors">
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
                  {lightboxIndex + 1} / {mediaItems.length}
                </span>
                <span className="font-semibold text-sm sm:text-base mt-0.5">
                  {mediaItems[lightboxIndex].title}
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
                  prev !== null ? (prev - 1 + mediaItems.length) % mediaItems.length : null
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
                  prev !== null ? (prev + 1) % mediaItems.length : null
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
                  src={mediaItems[lightboxIndex].src}
                  alt={mediaItems[lightboxIndex].title}
                  fill
                  priority
                  className="object-contain"
                  sizes="100vw"
                />
              </motion.div>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-6 max-w-2xl text-center px-4">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {mediaItems[lightboxIndex].desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
