"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

type Item = {
  role: string;
  company: string;
  period: string;
  description: string;
  tags?: string[];
};

/** A single timeline entry. All cards share the same left-aligned layout. */
function TimelineCard({
  item,
  index,
  highlight,
}: {
  item: Item;
  index: number;
  highlight: boolean;
}) {
  const delay = index * 0.12;

  return (
    <li className="relative pl-12">
      {/* dot on the line */}
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: delay + 0.15, type: "spring", stiffness: 300, damping: 18 }}
        className="absolute left-[7px] top-7 flex h-4 w-4 items-center justify-center rounded-full border border-muted-2 bg-background"
      >
        {highlight && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
        )}
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </motion.span>

      <motion.article
        initial={{ opacity: 0, x: -28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE, delay }}
        whileHover={{ y: -4 }}
        className="rounded-card border border-line bg-surface p-6 transition-colors duration-300 hover:border-muted-2/40 sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground">{item.role}</h3>
          <span className="inline-block rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-xs text-muted-2">
            {item.period}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-2">{item.company}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>

        {item.tags && item.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag, i) => (
              <motion.li
                key={tag}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, ease: EASE, delay: delay + 0.3 + i * 0.05 }}
                className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-muted transition-colors hover:bg-line/50 hover:text-foreground"
              >
                {tag}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.article>
    </li>
  );
}

/** One labelled section (Work / Education) with its own animated timeline. */
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
  return (
    <div>
      <Reveal className="mb-8 flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-foreground">
          <Icon size={18} />
        </span>
        <h2 className="text-2xl font-semibold text-foreground">{label}</h2>
        <span className="ml-2 h-px flex-1 bg-line" />
      </Reveal>

      <div className="relative">
        {/* animated vertical line that draws downward */}
        <motion.span
          aria-hidden
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute left-[15px] top-2 bottom-4 w-px origin-top bg-gradient-to-b from-line via-line to-transparent"
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

export default function Experience() {
  const { dict } = useLanguage();
  const e = dict.experience;

  return (
    <section className="px-6 pb-28 pt-32 sm:pt-40">
      <div className="mx-auto max-w-content">
        {/* Header — centered */}
        <Reveal className="text-center">
          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            <span className="text-foreground">{e.title1}</span>{" "}
            <span className="text-muted-2">{e.title2}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">{e.subtitle}</p>
        </Reveal>

        <div className="mx-auto mt-20 max-w-3xl">
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
