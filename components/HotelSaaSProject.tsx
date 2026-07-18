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
      desc: lang === "ro" ? "Asistent virtual inteligent care gestionează rezervările și răspunde oaspeților non-stop." : "Intelligent virtual assistant that handles bookings and answers guests 24/7.",
      showcase: true
    },
    {
      src: "/images/placeholder-toontone.svg",
      title: lang === "ro" ? "Hotel Websites" : "Hotel Websites",
      desc: lang === "ro" ? "Website-uri moderne, rapide și responsive pentru a crește conversiile și a oferi o experiență premium." : "Modern, fast, and responsive websites to increase conversions and provide a premium experience."
    },
    {
      src: "/images/placeholder-hotel-suite.svg",
      title: lang === "ro" ? "Digital Compendium" : "Digital Compendium",
      desc: lang === "ro" ? "Aplicație web pentru oaspeți cu servicii, meniu restaurant și atracții locale, accesibilă via cod QR." : "Guest web app featuring services, restaurant menu, and local attractions, accessible via QR code."
    },
    {
      src: "/images/placeholder-hueknew.svg",
      title: lang === "ro" ? "Review Automator" : "Review Automator",
      desc: lang === "ro" ? "Sistem automat pentru colectarea recenziilor pozitive și gestionarea feedback-ului intern." : "Automated system for collecting positive reviews and managing internal feedback."
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
    <div className="min-h-screen bg-[#050505] text-foreground pb-24 pt-32 px-6 sm:px-8">
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
              SaaS Suite
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-blue-400">
              Hotel SaaS Suite
            </h1>
            <p className="max-w-2xl text-lg text-muted mt-2 leading-relaxed">
              {lang === "ro"
                ? "O suită completă de soluții digitale pentru industria ospitalității, menită să automatizeze operațiunile, să crească numărul de rezervări directe și să ofere oaspeților o experiență de neuitat."
                : "A complete suite of digital solutions for the hospitality industry, designed to automate operations, increase direct bookings, and provide guests with an unforgettable experience."}
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
                  {lang === "ro" ? "Ce Oferim pentru Hoteluri" : "What We Offer for Hotels"}
                </h2>
                <p>
                  {lang === "ro"
                    ? "Într-o piață competitivă, digitalizarea și automatizarea sunt esențiale pentru a reduce costurile și a oferi o experiență premium. Hotel SaaS Suite integrează mai multe componente care lucrează împreună pentru succesul afacerii tale."
                    : "In a competitive market, digitalization and automation are essential to reduce costs and offer a premium experience. Hotel SaaS Suite integrates multiple components working together for your business's success."}
                </p>
              </div>

              {/* The services */}
              <div className="space-y-4 pt-4">
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: lang === "ro" ? "Concierge AI pe WhatsApp" : "WhatsApp Concierge AI",
                      desc: lang === "ro" ? "Răspunde instantaneu la întrebările oaspeților 24/7. De la programul restaurantului până la asistență pentru rezervări, bot-ul AI preia munca recepției." : "Answers guest inquiries instantly 24/7. From restaurant hours to booking assistance, the AI bot handles front-desk work."
                    },
                    {
                      title: lang === "ro" ? "Website-uri de Hotel" : "Hotel Websites",
                      desc: lang === "ro" ? "Construim website-uri rapide, cu un design premium și responsive, optimizate pentru a transforma vizitatorii în clienți." : "We build fast, premium, and responsive websites optimized to turn visitors into guests."
                    },
                    {
                      title: lang === "ro" ? "Digital Compendium" : "Digital Compendium",
                      desc: lang === "ro" ? "O platformă web accesibilă printr-un simplu scan de QR cod în cameră, unde oaspeții pot explora serviciile hotelului și meniul restaurantului." : "A web platform accessible via in-room QR scan, where guests can explore hotel services and restaurant menus."
                    },
                    {
                      title: lang === "ro" ? "Review Automator" : "Review Automator",
                      desc: lang === "ro" ? "Campanii automate care încurajează oaspeții mulțumiți să lase o recenzie pe Google/Booking, filtrând feedback-ul intern." : "Automated campaigns encouraging happy guests to leave reviews on Google/Booking while filtering internal feedback."
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
                  <span className="text-muted-2 block">{lang === "ro" ? "Tehnologie Backend" : "Backend Tech"}</span>
                  <span className="text-foreground font-medium">Python, FastAPI</span>
                </div>
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Inteligență Artificială" : "AI Provider"}</span>
                  <span className="text-foreground font-medium">Claude AI, Meta API</span>
                </div>
                <div>
                  <span className="text-muted-2 block">{lang === "ro" ? "Impact" : "Impact"}</span>
                  <span className="text-foreground font-medium">Reducerea timpului de suport cu peste 80%</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Gallery section */}
        <div className="mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {lang === "ro" ? "Galerie" : "Gallery"}
              </h2>
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
