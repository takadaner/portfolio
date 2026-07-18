"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import ExperienceBackground from "./ExperienceBackground";

const EASE = [0.16, 1, 0.3, 1] as const;

type Item = {
  role: string;
  company: string;
  period: string;
  description: string;
  tags?: string[];
};

/* ------------------------------------------------------------------ */
/* Entrance orchestration (first paint of the page)                    */
/* ------------------------------------------------------------------ */

const headerStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const riseIn: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

/** One word of the headline, revealed through an overflow mask. */
function MaskedWord({ word, className }: { word: string; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        variants={{
          hidden: { opacity: 0, y: "100%" },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, ease: EASE },
          },
        }}
        className={`inline-block ${className ?? ""}`}
      >
        {word}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

const cardStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const cardChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function TimelineCard({
  item,
  index,
  highlight,
}: {
  item: Item;
  index: number;
  highlight: boolean;
}) {
  const delay = index * 0.1;

  return (
    <li className="relative pl-12">
      {/* dot on the line */}
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 320, damping: 17 }}
        className="absolute left-[7px] top-8 flex h-4 w-4 items-center justify-center rounded-full border border-muted-2 bg-background"
      >
        {highlight && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
        )}
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </motion.span>

      <motion.article
        initial={{ opacity: 0, x: -28, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE, delay }}
        whileHover={{ y: -5 }}
        className="group relative overflow-hidden rounded-card border border-line bg-surface/70 p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-muted-2/50 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] sm:p-7"
      >
        {/* top-edge highlight that brightens on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        />
        {/* soft corner glow on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/[0.07] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <motion.div
          variants={cardStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <motion.h3
              variants={cardChild}
              className="text-lg font-semibold text-foreground"
            >
              {item.role}
            </motion.h3>
            <motion.span
              variants={{
                hidden: { opacity: 0, x: 12 },
                show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
              }}
              className="inline-block rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-xs text-muted-2"
            >
              {item.period}
            </motion.span>
          </div>

          <motion.p variants={cardChild} className="mt-1 text-sm text-muted-2">
            {item.company}
          </motion.p>
          <motion.p
            variants={cardChild}
            className="mt-3 text-sm leading-relaxed text-muted"
          >
            {item.description}
          </motion.p>

          {item.tags && item.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <motion.li
                  key={tag}
                  variants={cardChild}
                  className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-muted transition-colors duration-300 hover:bg-line/50 hover:text-foreground"
                >
                  {tag}
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </motion.article>
    </li>
  );
}

/** One labelled section (Work / Education) with a scroll-drawn timeline. */
function TimelineSection({
  icon: Icon,
  label,
  items,
  highlightFirst = false,
}: {
  icon: LucideIcon;
  label: string;
  items: Item[];
  highlightFirst?: boolean;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.45"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  return (
    <div>
      <motion.div
        variants={headerStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-8 flex items-center gap-4"
      >
        <motion.span
          variants={{
            hidden: { opacity: 0, scale: 0, rotate: -70 },
            show: {
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { type: "spring", stiffness: 220, damping: 16 },
            },
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-foreground"
        >
          <Icon size={18} />
        </motion.span>
        <motion.h2
          variants={riseIn}
          className="text-2xl font-semibold text-foreground"
        >
          {label}
        </motion.h2>
        <motion.span
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.4 } },
          }}
          className="font-mono text-xs text-muted-2"
        >
          {String(items.length).padStart(2, "0")}
        </motion.span>
        <motion.span
          variants={{
            hidden: { opacity: 0, scaleX: 0 },
            show: {
              opacity: 1,
              scaleX: 1,
              transition: { duration: 0.8, ease: EASE },
            },
          }}
          className="ml-2 h-px flex-1 origin-left bg-line"
        />
      </motion.div>

      <div ref={listRef} className="relative">
        {/* static track + scroll-driven progress line */}
        <span
          aria-hidden
          className="absolute bottom-4 left-[15px] top-2 w-px bg-line/60"
        />
        <motion.span
          aria-hidden
          style={{ scaleY }}
          className="absolute bottom-4 left-[15px] top-2 w-px origin-top bg-gradient-to-b from-accent/80 via-accent/40 to-transparent"
        />
        <ol className="flex flex-col gap-6">
          {items.map((item, i) => (
            <TimelineCard
              key={item.role}
              item={item}
              index={i}
              highlight={highlightFirst && i === 0}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Experience() {
  const { dict } = useLanguage();
  const e = dict.experience;

  return (
    <section className="relative isolate overflow-hidden px-6 pb-28 pt-32 sm:pt-40">
      <ExperienceBackground />

      <div className="relative z-10 mx-auto max-w-content">
        {/* Header — orchestrated entrance on first paint */}
        <motion.div
          variants={headerStagger}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.span
            variants={riseIn}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs text-muted backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {e.label}
          </motion.span>

          <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            {e.title1.split(" ").map((word, i) => (
              <MaskedWord
                key={`t1-${i}`}
                word={word}
                className="mr-[0.25em] text-foreground"
              />
            ))}
            {e.title2.split(" ").map((word, i) => (
              <MaskedWord
                key={`t2-${i}`}
                word={word}
                className="mr-[0.25em] text-muted-2"
              />
            ))}
          </h1>

          <motion.p
            variants={riseIn}
            className="mx-auto mt-5 max-w-xl text-base text-muted"
          >
            {e.subtitle}
          </motion.p>

          {/* short connector line pointing down to the timeline */}
          <motion.span
            variants={{
              hidden: { opacity: 0, scaleY: 0 },
              show: {
                opacity: 1,
                scaleY: 1,
                transition: { duration: 0.9, ease: EASE, delay: 0.2 },
              },
            }}
            className="mx-auto mt-10 block h-16 w-px origin-top bg-gradient-to-b from-muted-2/60 to-transparent"
          />
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl">
          <TimelineSection
            icon={Briefcase}
            label={e.workLabel}
            items={e.work as Item[]}
            highlightFirst
          />

          <div className="mt-20">
            <TimelineSection
              icon={GraduationCap}
              label={e.educationLabel}
              items={e.education as Item[]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
