"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function HeroBanner() {
  const [videoOk, setVideoOk] = useState(true);
  const t = useT();

  function scrollToEvents() {
    document.getElementById("evenements")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative mb-10 -mt-8 overflow-hidden rounded-b-[2.5rem] text-white sm:-mt-8">
      {/* Fond : vidéo si disponible (public/videos/hero.mp4), sinon dégradé animé */}
      {videoOk && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoOk(false)}
        />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-dark bg-200 animate-gradientMove ${
          videoOk ? "opacity-70" : "opacity-100"
        }`}
      />
      {/* Vignette pour la profondeur cinématique + lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(184,145,47,0.25),transparent)]" />

      {/* Orbes décoratives floues, purement esthétiques */}
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-gold/20 blur-[90px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-light/30 blur-[100px]" aria-hidden />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex min-h-[64vh] flex-col justify-center px-6 py-16 sm:px-12 sm:py-24"
      >
        <motion.p variants={item} className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold-light">
          {t("hero.label")}
        </motion.p>
        <motion.h1 variants={item} className="max-w-2xl text-balance text-4xl font-bold leading-[1.1] drop-shadow-sm sm:text-6xl">
          {t("hero.title")}
        </motion.h1>
        <motion.p variants={item} className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
          {t("hero.subtitle")}
        </motion.p>

        <motion.div variants={item} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
          <span>{t("hero.stat1")}</span>
          <span>{t("hero.stat2")}</span>
          <span>{t("hero.stat3")}</span>
        </motion.div>

        <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToEvents}
            className="rounded-full bg-gradient-to-r from-gold-light to-gold px-7 py-3.5 text-sm font-semibold text-brand-dark shadow-lg shadow-gold/20"
          >
            {t("hero.cta1")}
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.97 }}
            href="/artistes"
            className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white"
          >
            {t("hero.cta2")}
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={scrollToEvents}
        aria-label={t("nav.events")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60 transition hover:text-white"
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="block">
          <ChevronDown size={26} strokeWidth={1.5} />
        </motion.span>
      </motion.button>
    </div>
  );
}
