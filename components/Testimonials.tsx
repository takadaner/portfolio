"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

// Gender-correct photos: male names get male photos, female names get female photos
// Order matches locale items:
// 0 - Andrei Popescu (M)
// 1 - Cristina Marinescu (F)
// 2 - Mihai Constantinescu (M)
// 3 - Denisa Vasilescu (F)
// 4 - Vlad Georgescu (M)
// 5 - Elena Dumitru (F)
// 6 - Radu Stanescu (M)
// 7 - Ioana Preda (F)
// 8 - Ovidiu Secoșan (M)
const defaultImages = [
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80", // male
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80", // female
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80", // male
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80", // female
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80", // male
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80", // female
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80", // male
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80", // female
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&q=80", // male
];

export default function Testimonials() {
  const { dict } = useLanguage();
  const [spotlightItem, setSpotlightItem] = useState<any | null>(null);

  // Use all 9 items directly — no more repeating
  const allItems = dict.testimonials.items.map((item: any, i: number) => ({
    ...item,
    image: defaultImages[i] || defaultImages[0],
  }));

  const firstColumn = allItems.slice(0, 3);
  const secondColumn = allItems.slice(3, 6);
  const thirdColumn = allItems.slice(6, 9);

  const onSpotlight = useCallback((item: any | null) => {
    setSpotlightItem(item);
  }, []);

  return (
    <section className="px-6 pb-28 pt-20 sm:pt-28 relative">
      <div className="mx-auto max-w-content z-10">
        <Reveal className="flex flex-col items-center justify-center max-w-[640px] mx-auto text-center">
          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            <span className="text-foreground">{dict.testimonials.title1}</span>{" "}
            <span className="text-muted-2">{dict.testimonials.title2}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            {dict.testimonials.subtitle}
          </p>
        </Reveal>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] h-[600px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} onSpotlight={onSpotlight} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} onSpotlight={onSpotlight} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} onSpotlight={onSpotlight} />
        </div>
      </div>

      {/* Spotlight overlay */}
      <AnimatePresence>
        {spotlightItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="p-10 sm:p-14 rounded-3xl border border-line shadow-2xl shadow-black/20 bg-surface max-w-lg w-full mx-4 pointer-events-none"
            >
              <div className="text-foreground/90 text-lg sm:text-xl leading-relaxed">
                &ldquo;{spotlightItem.quote}&rdquo;
              </div>
              <div className="flex items-center gap-4 mt-8">
                <img
                  width={48}
                  height={48}
                  src={spotlightItem.image}
                  alt={spotlightItem.author}
                  className="h-12 w-12 rounded-full object-cover border border-line"
                />
                <div className="flex flex-col">
                  <div className="font-semibold tracking-tight leading-5 text-foreground text-base">
                    {spotlightItem.author}
                  </div>
                  <div className="text-sm text-muted leading-5 tracking-tight">
                    {spotlightItem.role}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
