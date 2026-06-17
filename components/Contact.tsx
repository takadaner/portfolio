"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";

export default function Contact() {
  const { dict } = useLanguage();

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-2 transition-colors duration-300 focus:border-muted";

  return (
    <section className="px-6 pb-28 pt-32 sm:pt-40">
      <div className="mx-auto grid max-w-content items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
            {dict.contact.label}
          </span>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            <span className="text-foreground">{dict.contact.title1} </span>
            <span className="text-muted-2">{dict.contact.title2}</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted">
            {dict.contact.subtitle}
          </p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-wide text-muted-2">
              {dict.contact.emailLabel}
            </p>
            <a
              href={`mailto:${dict.contact.email}`}
              className="mt-1 inline-flex items-center gap-2 text-lg font-medium transition-colors duration-300 hover:text-muted"
            >
              <Mail size={18} className="text-muted" />
              {dict.contact.email}
            </a>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-wide text-muted-2">
              {dict.contact.socialsLabel}
            </p>
            <div className="mt-3 flex gap-3">
              {dict.about.socials.map((social) => {
                const Icon = social.label === "GitHub" ? Github : Linkedin;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* availability / info widget */}
          <div className="mt-10 rounded-card border border-line bg-surface/50 p-5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              <span className="text-sm font-medium text-foreground">
                {dict.hero.badge}
              </span>
            </div>
            <div className="mt-4 grid gap-3 border-t border-line pt-4 text-sm text-muted">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0 text-muted-2" />
                Constanța, România
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="shrink-0 text-muted-2" />
                {dict.contact.form.note}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-card border border-line bg-surface/50 p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs uppercase tracking-wide text-muted-2"
                >
                  {dict.contact.form.name}
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={dict.contact.form.namePlaceholder}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs uppercase tracking-wide text-muted-2"
                >
                  {dict.contact.form.email}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={dict.contact.form.emailPlaceholder}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="message"
                className="mb-2 block text-xs uppercase tracking-wide text-muted-2"
              >
                {dict.contact.form.message}
              </label>
              <textarea
                id="message"
                rows={6}
                placeholder={dict.contact.form.messagePlaceholder}
                className={`${inputClass} resize-none`}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-colors duration-300 hover:bg-white"
            >
              {dict.contact.form.submit}
            </motion.button>
            <p className="mt-3 text-center text-xs text-muted-2">
              {dict.contact.form.note}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
