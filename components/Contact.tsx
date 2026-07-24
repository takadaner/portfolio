"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Clock, ArrowRight, ArrowLeft, Check, Instagram, Phone } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Reveal from "./Reveal";

export default function Contact() {
  const { dict } = useLanguage();
  const [step, setStep] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [formData, setFormData] = useState({
    interest: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  // Honeypot: a decoy field hidden from real users but auto-filled by many
  // spam bots. Kept out of `formData` on purpose. NOTE: the form currently
  // only console.logs, so this is inert scaffolding — once submit is wired
  // to an email/API endpoint, the guard below already drops bot submissions.
  const [botTrap, setBotTrap] = useState("");

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-2 transition-colors duration-300 focus:border-muted outline-none focus:ring-1 focus:ring-muted";

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleInterestSelect = (interest: string) => {
    setFormData((prev) => ({ ...prev, interest }));
    setTimeout(nextStep, 300); // Auto proceed
  };

  const interests = [
    { id: "web", label: dict.contact.form.interests.web },
    { id: "uiux", label: dict.contact.form.interests.uiux },
    { id: "seo", label: dict.contact.form.interests.seo },
    { id: "consulting", label: dict.contact.form.interests.consulting },
    { id: "other", label: dict.contact.form.interests.other },
  ];

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Silently drop submissions that filled the hidden honeypot — a real
    // user can't see or reach it, so anything here is almost certainly a bot.
    if (botTrap) return;
    console.log(formData);
  };

  const isStepValid = () => {
    if (step === 1) return formData.interest !== "";
    if (step === 2) return formData.name.trim() !== "" && formData.email.trim() !== "";
    if (step === 3) return formData.message.trim() !== "";
    return true;
  };

  const getSocialIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "github": return Github;
      case "linkedin": return Linkedin;
      case "instagram": return Instagram;
      case "email": return Mail;
      default: return Linkedin;
    }
  };

  return (
    <section className="px-6 pb-28 pt-32 sm:pt-40">
      <div className="mx-auto grid max-w-content items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="sticky top-32">
            <span className="inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
              {dict.contact.label}
            </span>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
              <span className="text-foreground">{dict.contact.title1} </span>
              <span className="text-muted-2">{dict.contact.title2}</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted">
              Ai un proiect sau o idee?<br />
              Scrie-mi și revin în maximum 48 de ore.
            </p>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:gap-12">
              <div>
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

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-2">
                  Telefon
                </p>
                <div 
                  className="mt-1 relative inline-flex items-center gap-2 cursor-pointer group"
                  onClick={() => setPhoneRevealed(true)}
                >
                  <Phone size={18} className="text-muted" />
                  <div className="relative overflow-hidden rounded-md">
                    <span className={`text-lg font-medium transition-all duration-500 block ${!phoneRevealed ? 'blur-md opacity-40 select-none' : 'blur-0 opacity-100 select-auto'}`}>
                      +40 756 333 392
                    </span>
                    {!phoneRevealed && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground group-hover:scale-105 transition-transform bg-surface/50 backdrop-blur-[2px]">
                        Arată
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-wide text-muted-2">
                {dict.contact.socialsLabel}
              </p>
              <div className="mt-3 flex gap-3">
                {dict.about.socials.map((social) => {
                  const Icon = getSocialIcon(social.label);
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
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
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative rounded-card border border-line bg-surface/50 p-6 sm:p-8 min-h-[520px] flex flex-col justify-between overflow-hidden">
            
            {!hasStarted && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/20 backdrop-blur-[6px]">
                <button onClick={() => setHasStarted(true)} className="pearl-button">
                  <div className="wrap">
                    <p>
                      <span>✧</span>
                      <span>✦</span>
                      Let's begin!
                    </p>
                  </div>
                </button>
              </div>
            )}

            <div className={`flex flex-col h-full transition-all duration-700 ${!hasStarted ? 'opacity-30 blur-[4px] pointer-events-none select-none' : 'opacity-100 blur-0'}`}>
              {/* Progress Bar */}
              <div className="mb-8 flex items-center justify-between gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 flex flex-col gap-2">
                    <div className={`h-1.5 rounded-full transition-colors duration-500 ${step >= i ? 'bg-foreground' : 'bg-line'}`} />
                    <span className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-wide transition-colors duration-500 ${step >= i ? 'text-foreground' : 'text-muted-2'}`}>
                      {i === 1 && dict.contact.form.step1Title}
                      {i === 2 && dict.contact.form.step2Title}
                      {i === 3 && dict.contact.form.step3Title}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={submitForm} className="flex-1 flex flex-col relative overflow-hidden">
                {/* Honeypot — hidden from users (and screen readers), a lure
                    for bots that blindly fill every field. Must not use
                    display:none alone, which some bots skip; keep it in-flow
                    but visually removed and untabbable. */}
                <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" tabIndex={-1}>
                  <label htmlFor="company-website">Company website</label>
                  <input
                    id="company-website"
                    name="company-website"
                    type="text"
                    autoComplete="off"
                    tabIndex={-1}
                    value={botTrap}
                    onChange={(e) => setBotTrap(e.target.value)}
                  />
                </div>

                <AnimatePresence mode="wait" custom={step}>
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col gap-4"
                    >
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {dict.contact.form.step1Title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {interests.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleInterestSelect(item.label)}
                            className={`flex items-center justify-between p-4 rounded-xl border text-sm transition-all duration-300
                              ${formData.interest === item.label 
                                ? 'border-foreground bg-foreground/5 text-foreground' 
                                : 'border-line bg-surface text-muted hover:border-muted hover:text-foreground'}`}
                          >
                            {item.label}
                            {formData.interest === item.label && (
                              <Check size={16} className="text-foreground" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col gap-5"
                    >
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {dict.contact.form.step2Title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wide text-muted-2">
                          {dict.contact.form.name}
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={dict.contact.form.namePlaceholder}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wide text-muted-2">
                          {dict.contact.form.email}
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={dict.contact.form.emailPlaceholder}
                          className={inputClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-wide text-muted-2">
                          {dict.contact.form.phone}
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={dict.contact.form.phonePlaceholder}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col gap-5"
                    >
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {dict.contact.form.step3Title}
                      </h3>
                      <div className="flex-1 flex flex-col">
                        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-wide text-muted-2">
                          {dict.contact.form.message}
                        </label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={dict.contact.form.messagePlaceholder}
                          className={`${inputClass} resize-none flex-1 min-h-[150px]`}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-line">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors duration-300"
                    >
                      <ArrowLeft size={16} />
                      {dict.contact.form.back}
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {dict.contact.form.next}
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {dict.contact.form.submit}
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
