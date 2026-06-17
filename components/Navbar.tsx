"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkle, Pause, Play } from "lucide-react";
import { useLanguage, type Lang } from "@/lib/LanguageContext";
import { useAnimationToggle } from "@/lib/AnimationContext";
import Logo from "@/components/Logo";
import NavPreview from "@/components/NavPreview";

export default function Navbar() {
  const { lang, setLang, dict } = useLanguage();
  const { paused, toggle } = useAnimationToggle();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLang = (next: Lang) => setLang(next);
  const isActive = (href: string) => pathname === href;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 border-b bg-background transition-all duration-300 ${
        scrolled ? "border-line shadow-lg shadow-black/40" : "border-transparent"
      }`}
    >
      <nav className="flex h-16 w-full items-center justify-between px-6 sm:px-8">
        {/* far-left extremity — logo + nav links */}
        <div className="flex items-center gap-8">
          <Link href="/" aria-label={dict.nav.logo} className="text-base font-semibold">
            <Logo label={dict.nav.logo} size={26} shiny />
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {dict.nav.links.map((link, i) => (
              <li key={link.href} className="group relative">
                <motion.span
                  className="inline-block"
                  animate={paused ? { y: 0 } : { y: [0, -6, 0] }}
                  transition={
                    paused
                      ? { duration: 0 }
                      : { duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 4.5, delay: i * 0.14 }
                  }
                >
                  <Link
                    href={link.href}
                    className={`text-[15px] transition-colors duration-300 hover:text-foreground ${
                      isActive(link.href) ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.span>

                {/* hover preview of the section */}
                <div className="pointer-events-none absolute left-0 top-full z-50 w-80 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="translate-y-1 rounded-2xl border border-line bg-background/95 p-4 shadow-2xl backdrop-blur-md transition-transform duration-200 group-hover:translate-y-0">
                    <NavPreview href={link.href} label={link.label} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* far-right extremity — language + Contact */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-line bg-surface p-0.5 text-xs">
            {(["ro", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => toggleLang(l)}
                className={`rounded-full px-2.5 py-1 uppercase transition-colors duration-300 ${
                  lang === l
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={toggle}
            aria-label={paused ? "Pornește animația" : "Oprește animația"}
            title={paused ? "Pornește animația" : "Oprește animația"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors duration-300 hover:text-foreground"
          >
            {paused ? (
              <Play size={15} className="fill-current" />
            ) : (
              <Pause size={15} className="fill-current" />
            )}
          </button>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="hidden md:block">
            <Link
              href={dict.nav.ctaHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2c2c2c] bg-gradient-to-b from-[#242424] to-[#141414] px-4 py-2 text-sm font-medium text-foreground transition-colors duration-300 hover:from-[#2c2c2c] hover:to-[#1a1a1a]"
            >
              <Sparkle size={15} className="fill-foreground" />
              {dict.nav.cta}
            </Link>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}
