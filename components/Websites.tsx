"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ExternalLink,
  FileText,
  Hotel,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Live demo sites, keyed by the `id` of each locale entry. */
const DEMOS: Record<string, { href: string; image: string; icon: LucideIcon }> = {
  hotel: {
    href: "https://hotel-demo-seven-flame.vercel.app",
    image: "/images/websites/hotel-demo.webp",
    icon: Hotel,
  },
  estate: {
    href: "https://estate-demo-mauve.vercel.app",
    image: "/images/websites/estate-demo.webp",
    icon: Building2,
  },
};

/** One-page offer PDFs (Romanian), keyed by the `id` of each locale entry. */
const OFFER_PDFS: Record<string, string> = {
  hotel: "/oferta/Daner-oferta-hotel.pdf",
  developer: "/oferta/Daner-oferta-dezvoltatori.pdf",
};

const PHONE_DISPLAY = "+40 756 333 392";
const WHATSAPP_HREF = "https://wa.me/40756333392";
const PHONE_HREF = "tel:+40756333392";
const EMAIL = "office@daner.app";

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-2 text-foreground ring-1 ring-line">
        <Check size={10} strokeWidth={2.6} />
      </span>
      <span>{children}</span>
    </li>
  );
}

function ListLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">
      {children}
    </h3>
  );
}

export default function Websites() {
  const { dict } = useLanguage();
  const w = dict.websites;

  const contactTiles = [
    { label: w.contact.whatsapp, value: PHONE_DISPLAY, href: WHATSAPP_HREF, icon: MessageCircle, external: true },
    { label: w.contact.phone, value: PHONE_DISPLAY, href: PHONE_HREF, icon: Phone, external: false },
    { label: w.contact.email, value: EMAIL, href: `mailto:${EMAIL}`, icon: Mail, external: false },
  ];

  return (
    <section className="px-6 pb-28 pt-32 sm:pt-40">
      <div className="mx-auto max-w-content">
        {/* Header */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {w.label}
          </span>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="block text-foreground">{w.title1}</span>
            <span className="block text-muted-2">{w.title2}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {w.intro}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors duration-300 hover:bg-white sm:px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <MessageCircle size={16} strokeWidth={1.8} />
              {w.ctaPrimary}
            </a>
            <a
              href="#oferta"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-muted-2 sm:px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {w.ctaSecondary}
              <ArrowRight size={16} strokeWidth={1.8} />
            </a>
          </div>
        </Reveal>

        {/* Key facts */}
        <Reveal delay={0.1}>
          <ul className="mt-14 grid divide-y divide-line overflow-hidden rounded-card border border-line bg-surface/50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {w.facts.map((fact) => (
              <li key={fact.value} className="p-6 sm:p-7">
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {fact.value}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{fact.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Live demos */}
        <section id="demo" className="mt-24 sm:mt-32">
          <SectionHeader
            label={w.demos.label}
            title1={w.demos.title1}
            title2={w.demos.title2}
            subtitle={w.demos.subtitle}
            align="left"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {w.demos.items.map((item, i) => {
              const demo = DEMOS[item.id];
              if (!demo) return null;
              const Icon = demo.icon;
              const domain = demo.href.replace(/^https?:\/\//, "");
              return (
                <Reveal key={item.id} delay={i * 0.08} className="h-full">
                  <article className="group flex h-full flex-col rounded-card border border-line bg-surface/70 p-3 transition-colors duration-300 hover:border-muted-2/50">
                    {/* Screenshot — mouse shortcut to the demo; keyboard and
                        screen-reader users get the labelled button below. */}
                    <a
                      href={demo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={-1}
                      aria-hidden
                      className="relative block aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface-2"
                    >
                      <Image
                        src={demo.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 560px, 100vw"
                        className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                      />
                      <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-background/80 text-foreground backdrop-blur-sm transition-colors duration-300 group-hover:bg-foreground group-hover:text-background">
                        <ArrowUpRight size={15} />
                      </span>
                    </a>

                    <div className="flex flex-1 flex-col px-3 pb-3 pt-6">
                      <p className="flex items-center gap-2 text-xs text-muted">
                        <Icon size={14} strokeWidth={1.8} className="shrink-0" />
                        {item.kind}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 break-all font-mono text-xs text-muted-2">{domain}</p>

                      <ul className="mt-5 flex flex-col gap-2.5">
                        {item.features.map((feature) => (
                          <CheckItem key={feature}>{feature}</CheckItem>
                        ))}
                      </ul>

                      <div className="mt-auto pt-7">
                        <a
                          href={demo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <ExternalLink size={16} strokeWidth={1.8} />
                          {w.demos.open}
                          <span className="sr-only">
                            {" "}
                            {item.kind} {w.demos.newTab}
                          </span>
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Launch offer */}
        <section id="oferta" className="mt-24 sm:mt-32">
          <SectionHeader
            label={w.offer.label}
            title1={w.offer.title1}
            title2={w.offer.title2}
            subtitle={w.offer.subtitle}
            align="left"
          />

          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <Reveal className="h-full">
              <div className="flex h-full flex-col rounded-card border border-line bg-surface/70 p-7 sm:p-9">
                <span className="inline-flex max-w-fit items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs text-foreground">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {w.offer.availability}
                </span>
                {w.offer.prices.map((price, i) => (
                  <div
                    key={price.amount}
                    className={i > 0 ? "mt-7 border-t border-line pt-7" : "mt-auto pt-8"}
                  >
                    <p className="flex items-baseline gap-1 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                      {price.amount}
                      {price.suffix && (
                        <span className="text-xl font-medium tracking-normal text-muted-2 sm:text-2xl">
                          {price.suffix}
                        </span>
                      )}
                    </p>
                    <p className="mt-3 text-sm font-medium text-foreground">{price.period}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{price.note}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col rounded-card border border-line bg-surface/70 p-7 sm:p-9">
                <div className="grid gap-9 sm:grid-cols-2">
                  <div>
                    <ListLabel>{w.offer.termsTitle}</ListLabel>
                    <ul className="mt-4 flex flex-col gap-3">
                      {w.offer.terms.map((term) => (
                        <CheckItem key={term}>{term}</CheckItem>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <ListLabel>{w.offer.includesTitle}</ListLabel>
                    <ul className="mt-4 flex flex-col gap-3">
                      {w.offer.includes.map((item) => (
                        <CheckItem key={item}>{item}</CheckItem>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-9">
                  <div className="border-t border-line pt-7">
                    <ListLabel>{w.offer.pdfTitle}</ListLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {w.offer.pdfs.map((pdf) => {
                        const href = OFFER_PDFS[pdf.id];
                        if (!href) return null;
                        return (
                          <a
                            key={pdf.id}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            type="application/pdf"
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            <FileText size={15} strokeWidth={1.8} />
                            {pdf.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-24 sm:mt-32">
          <SectionHeader
            label={w.process.label}
            title1={w.process.title1}
            title2={w.process.title2}
            subtitle={w.process.subtitle}
            align="left"
          />

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {w.process.steps.map((step, i) => (
              <motion.li
                key={step.day}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border border-line bg-surface/65 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-foreground">
                    {step.day}
                  </span>
                  <span aria-hidden className="font-mono text-xs text-muted-2">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="mt-24 sm:mt-32">
          <Reveal>
            <div className="grid gap-10 rounded-card border border-line bg-surface/50 p-7 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
              <div>
                <span className="inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
                  {w.contact.label}
                </span>
                <h2
                  id="contact-title"
                  className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
                >
                  <span className="block text-foreground">{w.contact.title1}</span>
                  <span className="block text-muted-2">{w.contact.title2}</span>
                </h2>
                <p className="mt-4 max-w-md text-base text-muted">{w.contact.subtitle}</p>
              </div>

              <div>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {contactTiles.map(({ label, value, href, icon: Icon, external }) => (
                    <li key={label}>
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-surface-2/60 p-4 transition-colors duration-300 hover:border-muted-2/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-col sm:items-start sm:p-5"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-foreground transition-colors duration-300 group-hover:bg-foreground group-hover:text-background">
                          <Icon size={18} strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0 sm:mt-3">
                          <span className="block text-xs uppercase tracking-wide text-muted-2">
                            {label}
                          </span>
                          <span className="mt-1 block whitespace-nowrap text-sm font-medium text-foreground">
                            {value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-muted">
                  {w.contact.formHint}{" "}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 font-medium text-foreground underline decoration-line underline-offset-4 transition-colors duration-300 hover:decoration-foreground"
                  >
                    {w.contact.form}
                    <ArrowRight size={14} strokeWidth={1.8} />
                  </Link>
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </section>
  );
}
