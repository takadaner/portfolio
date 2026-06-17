"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";

const socialIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
} as const;

export default function About() {
  const { dict } = useLanguage();

  return (
    <section className="px-6 pb-28 pt-32 sm:pt-40">
      <div className="mx-auto max-w-content">
        {/* Header — centered */}
        <Reveal className="text-center">
          <span className="inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
            {dict.about.label}
          </span>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            <span className="text-foreground">{dict.about.title1}</span>{" "}
            <span className="text-muted-2">{dict.about.title2}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            {dict.about.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* LEFT — portrait card */}
          <Reveal>
            <div className="flex h-full flex-col rounded-card border border-line bg-surface p-3">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/images/placeholder-portrait.svg"
                  alt={dict.about.photoGreeting}
                  width={800}
                  height={1000}
                  className="h-auto w-full"
                />
                {/* available badge overlay */}
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-line bg-background/80 px-3 py-1.5 text-xs text-foreground backdrop-blur-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                  </span>
                  {dict.about.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col px-3 pb-2 pt-5">
                <p className="text-xl font-semibold">{dict.about.photoGreeting}</p>
                <p className="mt-1 text-sm text-muted">{dict.about.photoRole}</p>

                <div className="mt-auto flex items-center gap-3 pt-6">
                  {dict.about.socials.map((social) => {
                    const Icon =
                      socialIcons[social.label as keyof typeof socialIcons];
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition-colors duration-300 hover:text-foreground"
                      >
                        {Icon && <Icon size={18} />}
                      </motion.a>
                    );
                  })}
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="ml-auto"
                  >
                    <Link
                      href={dict.nav.ctaHref}
                      className="inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors duration-300 hover:bg-white"
                    >
                      {dict.about.connect}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — bio + tags + experience table */}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col rounded-card border border-line bg-surface p-7 sm:p-9">
              <p className="text-lg leading-relaxed text-muted">
                {dict.about.bio}
              </p>

              <div className="my-7 h-px bg-line" />

              <div className="flex flex-col gap-6">
                {dict.skills.categories.map((cat: any) => (
                  <div key={cat.category}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-2">
                      {cat.category}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {cat.tags.map((tag: string) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line bg-surface-2 px-3 py-1 text-[11px] text-muted transition-colors hover:bg-line/50 hover:text-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="my-7 h-px bg-line" />

              {/* experience table */}
              <div className="flex flex-col">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-2">
                  {dict.experience.workLabel}
                </p>
                {dict.experience.work.map((job: any, i: number) => (
                  <div
                    key={job.role}
                    className={`grid grid-cols-[1fr_auto] items-baseline gap-4 py-4 sm:grid-cols-[1.4fr_1.4fr_auto] ${
                      i > 0 ? "border-t border-line" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {job.role}
                    </span>
                    <span className="hidden text-sm text-muted sm:block">
                      {job.company}
                    </span>
                    <span className="text-right font-mono text-xs text-muted-2">
                      {job.period}
                    </span>
                  </div>
                ))}

                <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-muted-2">
                  {dict.experience.educationLabel}
                </p>
                {dict.experience.education.map((edu: any, i: number) => (
                  <div
                    key={edu.role}
                    className={`grid grid-cols-[1fr_auto] items-baseline gap-4 py-4 sm:grid-cols-[1.4fr_1.4fr_auto] ${
                      i > 0 ? "border-t border-line" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {edu.role}
                    </span>
                    <span className="hidden text-sm text-muted sm:block">
                      {edu.company}
                    </span>
                    <span className="text-right font-mono text-xs text-muted-2">
                      {edu.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
