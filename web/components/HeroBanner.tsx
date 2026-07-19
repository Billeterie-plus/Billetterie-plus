"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronDown, Sparkles, Ticket } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function HeroBanner() {
  const [videoOk, setVideoOk] = useState(true);
  const t = useT();

  function scrollToEvents() {
    document.getElementById("evenements")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative mb-12 -mt-8 overflow-hidden rounded-b-[3rem] text-white shadow-2xl shadow-black/60 sm:-mt-8">
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
          videoOk ? "opacity-75" : "opacity-100"
        }`}
      />
      {/* Vignette pour la profondeur cinématique + lisibilité du texte */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_105%,rgba(184,145,47,0.3),transparent)]" />

      {/* Orbes décoratives floues, purement esthétiques */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold/25 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-light/40 blur-[110px]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "3px 3px",
      }} aria-hidden />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex min-h-[70vh] flex-col justify-center px-6 py-20 sm:px-14 sm:py-28"
      >
        <motion.div variants={item} className="mb-5 flex items-center gap-2.5">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-light" />
          <Sparkles size={14} strokeWidth={2} className="text-gold-light" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">{t("hero.label")}</p>
        </motion.div>

        <motion.h1
          variants={item}
          className="max-w-3xl text-balance font-serif text-5xl font-semibold italic leading-[1.05] tracking-tight drop-shadow-lg sm:text-7xl"
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          {t("hero.subtitle")}
        </motion.p>

        <motion.div variants={item} className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/60">
          <span>{t("hero.stat1")}</span>
          <span className="hidden text-white/25 sm:inline">/</span>
          <span>{t("hero.stat2")}</span>
          <span className="hidden text-white/25 sm:inline">/</span>
          <span>{t("hero.stat3")}</span>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.045, boxShadow: "0 20px 40px -10px rgba(184,145,47,0.55)" }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToEvents}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-8 py-4 text-sm font-semibold text-brand-dark shadow-xl shadow-gold/25"
          >
            <Ticket size={16} strokeWidth={2.2} />
            {t("hero.cta1")}
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.045, backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(212,175,90,0.6)" }}
            whileTap={{ scale: 0.97 }}
            href="/artistes"
            className="rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm"
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
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/50 transition hover:text-gold-light"
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="block">
          <ChevronDown size={26} strokeWidth={1.5} />
        </motion.span>
      </motion.button>
    </div>
  );
}
