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
    <div className="relative mb-12 -mt-8 overflow-hidden rounded-b-[3rem] text-white shadow-2xl shadow-black/40 sm:-mt-8">
      {/* Fond : vidéo si disponible (public/videos/hero.mp4), sinon dégradé multicolore animé, esprit affiche de festival */}
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
        className={`absolute inset-0 bg-gradient-to-br from-brand via-brand-light to-brand-dark ${
          videoOk ? "opacity-85" : "opacity-100"
        }`}
      />
      {/* Halos colorés superposés pour un rendu "affiche de festival" */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_10%_15%,rgba(59,74,122,0.7),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_90%_10%,rgba(16,185,129,0.35),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_105%,rgba(212,175,90,0.5),transparent)]" />
      {/* Vignette légère pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

      {/* Orbes décoratives floues, statiques (pas d'animation en boucle pour la fluidité) */}
      <div
        className="pointer-events-none absolute -left-16 top-8 h-72 w-72 rounded-full bg-gold/35 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-emerald-500/30 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-brand-light/50 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
        aria-hidden
      />

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
          className="max-w-3xl text-balance text-6xl font-extrabold leading-[1.02] tracking-tight drop-shadow-lg sm:text-8xl"
        >
          <span className="bg-gradient-to-r from-white to-gold-light bg-clip-text text-transparent">
            {t("hero.title")}
          </span>
        </motion.h1>

        <motion.p variants={item} className="mt-7 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {t("hero.subtitle")}
        </motion.p>

        <motion.div variants={item} className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/70">
          <span>{t("hero.stat1")}</span>
          <span className="hidden text-white/30 sm:inline">/</span>
          <span>{t("hero.stat2")}</span>
          <span className="hidden text-white/30 sm:inline">/</span>
          <span>{t("hero.stat3")}</span>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 20px 45px -10px rgba(184,145,47,0.55)" }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToEvents}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-light to-gold px-8 py-4 text-sm font-bold text-brand-dark shadow-xl shadow-gold/30"
          >
            <Ticket size={16} strokeWidth={2.4} />
            {t("hero.cta1")}
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(212,175,90,0.7)" }}
            whileTap={{ scale: 0.97 }}
            href="/artistes"
            className="rounded-full border-2 border-white/30 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm"
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
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/60 transition hover:text-gold-light"
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="block">
          <ChevronDown size={26} strokeWidth={1.5} />
        </motion.span>
      </motion.button>
    </div>
  );
}
