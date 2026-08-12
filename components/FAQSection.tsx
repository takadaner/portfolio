"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";

export default function FAQSection() {
  const { dict } = useLanguage();
  const faqData = dict.faq;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqData) return null;

  return (
    <section className="relative py-24 bg-background">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-2">
              {faqData.label}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {faqData.title1} <span className="text-muted">{faqData.title2}</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {faqData.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-4">
          {faqData.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={index} delay={index * 0.05}>
                <div
                  className={`group rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-foreground/30 bg-surface/80 shadow-lg"
                      : "border-line bg-surface/30 hover:border-line/80 hover:bg-surface/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-medium text-foreground sm:text-lg">
                      {item.q}
                    </span>
                    <div
                      className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "border-foreground bg-foreground text-background"
                          : "border-line bg-surface text-muted group-hover:border-muted group-hover:text-foreground"
                      }`}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-line/50 px-6 pb-6 pt-4 text-sm leading-relaxed text-muted sm:text-base">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
