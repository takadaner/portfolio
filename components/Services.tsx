"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  MotionConfig,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  Globe,
  Bot,
  Hotel,
  Server,
  Palette,
  Workflow,
  Plug,
  LayoutDashboard,
  Search,
  Code2,
  Database,
  MessageCircle,
  PanelTop,
  Zap,
  Radio,
  Smartphone,
  Cpu,
  Check,
  X,
  ArrowUpRight,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAnimationToggle } from "@/lib/AnimationContext";
import Reveal from "./Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const serviceIcons: Record<string, LucideIcon> = {
  globe: Globe,
  bot: Bot,
  hotel: Hotel,
  server: Server,
  palette: Palette,
};

const tagIcons: Record<string, LucideIcon> = {
  workflow: Workflow,
  plug: Plug,
  layout: LayoutDashboard,
  search: Search,
  code: Code2,
  database: Database,
  message: MessageCircle,
  panel: PanelTop,
  zap: Zap,
  radio: Radio,
  smartphone: Smartphone,
  cpu: Cpu,
};

type ServiceItem = {
  icon: string;
  title: string;
  description: string;
  media: string;
  image?: string;
  imageAlt?: string;
  gallery?: { image: string; imageAlt: string }[];
};

type Tag = { icon: string; label: string };

type WhyRowData = {
  pro: { title: string; description: string };
  con: { title: string; description: string };
};

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-muted" />
      </span>
      {label}
    </span>
  );
}

function ContactButton({ label }: { label: string }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Link
        href="/contact"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#2c2c2c] bg-gradient-to-b from-[#242424] to-[#141414] px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:from-[#2c2c2c] hover:to-[#1a1a1a]"
      >
        <Sparkle size={15} className="fill-foreground" />
        {label}
      </Link>
    </motion.div>
  );
}

function GhostButton({ label, href }: { label: string; href: string }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
      >
        {label}
      </Link>
    </motion.div>
  );
}

function SectionHead({
  label,
  title1,
  title2,
  subtitle,
  center = false,
  action,
  headingArrow = false,
  subtitleNoWrap = false,
}: {
  label: string;
  title1: string;
  title2: string;
  subtitle: string;
  center?: boolean;
  action?: ReactNode;
  headingArrow?: boolean;
  subtitleNoWrap?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={
          center
            ? "flex flex-col items-center text-center"
            : "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        }
      >
        <div className={center ? "flex flex-col items-center" : ""}>
          <Pill label={label} />
          <h2 className="mt-5 flex items-center gap-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            <span>
              <span className="text-foreground">{title1} </span>
              <span className="text-muted-2">{title2}</span>
            </span>
            {headingArrow && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted">
                <ArrowUpRight size={18} strokeWidth={1.6} />
              </span>
            )}
          </h2>
          <p
            className={`mt-4 max-w-xl text-base text-muted ${
              center ? "mx-auto" : ""
            } ${subtitleNoWrap ? "lg:max-w-none lg:whitespace-nowrap" : ""}`}
          >
            {subtitle}
          </p>
        </div>
        {action && (
          <div className="flex flex-wrap gap-3 sm:pb-2">{action}</div>
        )}
      </div>
    </Reveal>
  );
}

function ServiceCard({
  item,
  delay,
  showMedia = false,
}: {
  item: ServiceItem;
  delay: number;
  showMedia?: boolean;
}) {
  const Icon = serviceIcons[item.icon] ?? Globe;
  const { paused } = useAnimationToggle();

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      whileHover={{ y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface p-6 transition-colors duration-300 hover:border-[#333] sm:p-7"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted transition-colors duration-300 group-hover:text-foreground">
          <Icon size={17} strokeWidth={1.6} />
        </span>
        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
      </div>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        {item.description}
      </p>

      {showMedia && item.media === "image" && item.image && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line">
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            initial="rest"
            whileHover="hover"
            animate="rest"
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Image
              src={item.image}
              alt={item.imageAlt ?? item.title}
              width={1200}
              height={760}
              className="h-auto w-full"
            />
          </motion.div>
        </div>
      )}

      {showMedia && item.media === "gallery" && item.gallery && (
        <div className="relative mt-6 flex-1">
          <motion.div
            className="-mr-7 flex gap-4 sm:-mr-8"
            animate={paused ? { x: 0 } : { x: [0, -28, 0] }}
            transition={paused ? { duration: 0 } : { duration: 10, ease: "easeInOut", repeat: Infinity }}
          >
            {item.gallery.map((g) => (
              <div
                key={g.image + g.imageAlt}
                className="w-[62%] shrink-0 overflow-hidden rounded-xl border border-line"
              >
                <Image
                  src={g.image}
                  alt={g.imageAlt}
                  width={800}
                  height={560}
                  className="h-auto w-full"
                />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.article>
  );
}

function MarqueeRow({
  tags,
  reverse = false,
  duration = 32,
}: {
  tags: Tag[];
  reverse?: boolean;
  duration?: number;
}) {
  const { paused } = useAnimationToggle();
  const loop = [...tags, ...tags];

  const animClass = reverse ? "animate-marquee-x-reverse" : "animate-marquee-x";

  return (
    <div className="select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] hover:[&>div]:[animation-play-state:paused]">
      <div
        className={`flex w-max gap-3 py-1 ${paused ? "" : animClass}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((tag, i) => {
          const Icon = tagIcons[tag.icon] ?? Code2;
          return (
            <span
              key={`${tag.label}-${i}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted"
            >
              <Icon size={15} strokeWidth={1.6} className="text-muted-2" />
              {tag.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function RecentCard({
  title,
  alt,
  image,
  ratio,
  cursor,
  delay,
  href,
}: {
  title: string;
  alt: string;
  image: string;
  ratio: string;
  cursor: string;
  delay: number;
  href?: string;
}) {
  const content = (
    <Reveal delay={delay}>
      <motion.div
        whileHover="hover"
        initial="rest"
        animate="rest"
        data-cursor={cursor}
        className={`group relative w-full cursor-pointer overflow-hidden rounded-card border border-line bg-surface ${ratio}`}
      >
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          variants={{ rest: { opacity: 0.25 }, hover: { opacity: 0.7 } }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background to-transparent"
        />

        <span className="absolute bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-background/70 text-foreground backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
          <ArrowUpRight size={17} strokeWidth={1.7} />
        </span>

        <span className="pointer-events-none absolute bottom-5 right-5 text-sm font-medium text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {title}
        </span>
      </motion.div>
    </Reveal>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
        {content}
      </a>
    );
  }

  return content;
}

function EmptyCard({ ratio, delay }: { ratio: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div
        className={`flex w-full flex-col items-center justify-center overflow-hidden rounded-card border-2 border-dashed border-line bg-surface/30 text-muted transition-colors duration-300 hover:border-muted-2 hover:bg-surface/50 ${ratio}`}
      >
        <span className="text-sm font-medium tracking-wide">Slot Liber</span>
      </div>
    </Reveal>
  );
}

function WhyRow({ row, index }: { row: WhyRowData; index: number }) {
  const delay = index * 0.1;

  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ amount: 0.3, margin: "-10% 0px" }}
      className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2"
    >
      {/* PRO */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -56 },
          shown: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.6, ease: EASE, delay }}
        className="bg-surface p-6 sm:p-8"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-foreground ring-1 ring-line">
          <Check size={15} strokeWidth={2.4} />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-foreground">
          {row.pro.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {row.pro.description}
        </p>
      </motion.div>

      {/* CON */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 56 },
          shown: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.6, ease: EASE, delay }}
        className="bg-surface p-6 sm:p-8"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-muted-2 ring-1 ring-line">
          <X size={15} strokeWidth={2.4} />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-muted">
          {row.con.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-2">
          {row.con.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

function WhyMe() {
  const { dict } = useLanguage();
  const why = dict.services.why;
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.7", "end 0.7"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="px-6 pb-28 pt-24 sm:pt-32">
      <div className="mx-auto max-w-content">
        <SectionHead
          label={why.label}
          title1={why.title1}
          title2={why.title2}
          subtitle={why.subtitle}
          center
        />

        <div ref={railRef} className="relative mt-14">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-line sm:block">
            <motion.div
              style={{ scaleY: railScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-foreground/70 via-foreground/30 to-transparent"
            />
          </div>

          <div className="flex flex-col gap-5">
            {why.rows.map((row, i) => (
              <WhyRow key={row.pro.title} row={row} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionDivider() {
  return (
    <div className="px-6" aria-hidden>
      <div className="h-12 overflow-hidden">
        <div className="h-24 rounded-t-[3rem] border-x border-t border-line [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>
    </div>
  );
}

export default function Services() {
  const { dict } = useLanguage();
  const s = dict.services;
  const items = s.items as ServiceItem[];

  const half = Math.ceil(s.tags.length / 2);
  const rowA = s.tags.slice(0, half);
  const rowB = s.tags.slice(half);

  const recent = dict.projects.items.slice(0, 4);
  const ratios = ["aspect-[16/13]", "aspect-[16/11]", "aspect-[16/11]", "aspect-[16/13]"];

  return (
    <>
      <section className="px-6 pb-20 pt-32 sm:pt-40">
        <div className="mx-auto max-w-content">
          <SectionHead
            label={s.label}
            title1={s.title1}
            title2={s.title2}
            subtitle={s.subtitle}
            subtitleNoWrap
            action={<ContactButton label={s.cta} />}
          />

          <div className="mt-14 flex flex-col gap-6">
            {/* featured card keeps its visual; the rest form a symmetric grid */}
            <ServiceCard item={items[0]} delay={0} showMedia />
            <div className="grid gap-6 [grid-auto-rows:1fr] sm:grid-cols-2">
              {items.slice(1).map((item, i) => (
                <ServiceCard
                  key={item.title}
                  item={item}
                  delay={0.05 + i * 0.05}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <MarqueeRow tags={rowA} duration={30} />
            <MarqueeRow tags={rowB} reverse duration={36} />
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-content">
          <SectionHead
            label={s.recent.label}
            title1={s.recent.title1}
            title2={s.recent.title2}
            subtitle={s.recent.subtitle}
            headingArrow
            action={
              <>
                <GhostButton label={s.recent.seeAll} href="/projects" />
                <ContactButton label={s.recent.cta} />
              </>
            }
          />

          <div className="mt-14 grid items-start gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-6">
              <EmptyCard ratio={ratios[0]} delay={0} />
              <EmptyCard ratio={ratios[3]} delay={0.15} />
            </div>
            <div className="flex flex-col gap-6">
              {recent[1] && (
                <RecentCard
                  title={recent[1].title}
                  alt={recent[1].imageAlt}
                  image={recent[1].image}
                  ratio={ratios[1]}
                  cursor={dict.projects.view}
                  delay={0.1}
                  href={(recent[1] as any).href}
                />
              )}
              {recent[0] && (
                <RecentCard
                  title={recent[0].title}
                  alt={recent[0].imageAlt}
                  image={recent[0].image}
                  ratio={ratios[2]}
                  cursor={dict.projects.view}
                  delay={0.2}
                  href={(recent[0] as any).href}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <MotionConfig reducedMotion="never">
        <WhyMe />
      </MotionConfig>
    </>
  );
}
