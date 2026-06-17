"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const defaultImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80"
];

export default function Testimonials() {
  const { dict } = useLanguage();

  // Create 9 testimonials by repeating dict.testimonials.items
  const rawItems = dict.testimonials.items;
  const expandedItems = [];
  for (let i = 0; i < 9; i++) {
    expandedItems.push({
      ...rawItems[i % rawItems.length],
      image: defaultImages[i]
    });
  }

  const firstColumn = expandedItems.slice(0, 3);
  const secondColumn = expandedItems.slice(3, 6);
  const thirdColumn = expandedItems.slice(6, 9);

  return (
    <section className="px-6 pb-28 pt-32 sm:pt-40 relative">
      <div className="mx-auto max-w-content z-10">
        <Reveal className="flex flex-col items-center justify-center max-w-[640px] mx-auto text-center">
          <span className="inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted mb-5">
            {dict.testimonials.label}
          </span>
          <h1 className="mt-2 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            <span className="text-foreground">{dict.testimonials.title1}</span>{" "}
            <span className="text-muted-2">{dict.testimonials.title2}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            {dict.testimonials.subtitle}
          </p>
        </Reveal>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] h-[600px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
