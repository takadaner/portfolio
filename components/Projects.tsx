"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Projects() {
  const { dict, lang } = useLanguage();

  // Scroll to the correct project when arriving via hash (e.g. /projects#terasa-florilor)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Small delay to let the page render and Reveal animations initialize
    const timeout = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="px-6 pb-28 pt-32 sm:pt-40">
      <div className="mx-auto max-w-content">
        {/* Header */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
            </span>
            {dict.projects.label}
          </span>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="text-foreground block">{dict.projects.title1}</span>
            <span className="text-muted-2 block">{dict.projects.title2}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted">
            {dict.projects.subtitle}
          </p>
        </Reveal>

        {/* Alternating feature rows */}
        <div className="mt-20 flex flex-col gap-20 sm:gap-28">
          {dict.projects.items.map((project, i) => {
            const reversed = i % 2 === 1;
            const slug = slugify(project.title);
            const href = (project as any).href as string | undefined;

            return (
              <Reveal key={project.title}>
                <article
                  id={slug}
                  className="scroll-mt-32 grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  {/* Image */}
                  {(() => {
                    const content = (
                      <motion.div
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                        data-cursor={dict.projects.view}
                        className={`group relative w-full cursor-pointer overflow-hidden rounded-card border border-line bg-surface ${
                          reversed && !href ? "lg:order-2" : ""
                        }`}
                      >
                        <motion.div
                          variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <Image
                            src={project.image}
                            alt={project.imageAlt}
                            width={1200}
                            height={900}
                            className="h-auto w-full"
                          />
                        </motion.div>
                        <motion.div
                          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                          transition={{ duration: 0.3 }}
                          className="pointer-events-none absolute inset-0 bg-background/30"
                        />
                      </motion.div>
                    );

                    return href ? (
                      href.startsWith("/") ? (
                        <Link
                          href={href}
                          className={`block w-full ${reversed ? "lg:order-2" : ""}`}
                        >
                          {content}
                        </Link>
                      ) : (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block w-full ${reversed ? "lg:order-2" : ""}`}
                        >
                          {content}
                        </a>
                      )
                    ) : (
                      content
                    );
                  })()}

                  {/* Text */}
                  <div className={reversed ? "lg:order-1" : ""}>
                    <span className="font-mono text-sm text-muted-2">
                      0{i + 1} / 0{dict.projects.items.length}
                    </span>
                    <h2 className="mt-3 flex items-center gap-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                      {project.title}
                      <ArrowUpRight
                        className="h-6 w-6 text-muted-2"
                        strokeWidth={1.5}
                      />
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                      {project.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    {/* View Website / View Details button */}
                    {href && (
                      href.startsWith("/") ? (
                        <Link
                          href={href}
                          className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground hover:text-background"
                        >
                          <ArrowUpRight size={16} strokeWidth={1.8} />
                          {lang === "ro" ? "Vezi detalii proiect" : "View project details"}
                        </Link>
                      ) : (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground hover:text-background"
                        >
                          <ExternalLink size={16} strokeWidth={1.8} />
                          {(dict.projects as any).viewWebsite ?? "View website"}
                        </a>
                      )
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
