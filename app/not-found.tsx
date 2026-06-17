"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import FuzzyText from "@/components/FuzzyText";

export default function NotFound() {
  const { lang } = useLanguage();

  const isRo = lang === "ro";

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.02] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Fuzzy 404 */}
        <div className="-mb-4">
          <FuzzyText
            fontSize="clamp(6rem, 20vw, 16rem)"
            fontWeight={900}
            color="#ffffff"
            baseIntensity={0.15}
            hoverIntensity={0.6}
            fuzzRange={40}
            enableHover
            clickEffect
            glitchMode
            glitchInterval={4000}
            glitchDuration={300}
            direction="horizontal"
          >
            404
          </FuzzyText>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-xl font-medium text-foreground sm:text-2xl"
        >
          {isRo ? "Pagina nu a fost găsită" : "Page not found"}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-3 max-w-md text-base leading-relaxed text-muted"
        >
          {isRo
            ? "Se pare că te-ai rătăcit. Linkul pe care l-ai accesat nu există sau a fost mutat."
            : "Looks like you got lost. The link you followed doesn\u2019t exist or has been moved."}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#2c2c2c] bg-gradient-to-b from-[#242424] to-[#141414] px-6 py-3 text-[15px] font-medium text-foreground shadow-lg transition-colors duration-300 hover:from-[#2c2c2c] hover:to-[#1a1a1a]"
            >
              <Home size={16} />
              {isRo ? "Acasă" : "Home"}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-[#555555] bg-gradient-to-b from-[#4a4a4a] to-[#2e2e2e] px-6 py-3 text-[15px] font-medium text-foreground shadow-lg transition-colors duration-300 hover:from-[#555555] hover:to-[#383838]"
            >
              <ArrowLeft size={16} />
              {isRo ? "Înapoi" : "Go Back"}
            </button>
          </motion.div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 h-px w-48 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
        />
      </motion.div>
    </section>
  );
}
