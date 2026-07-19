"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Ticket } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Stage = "logo" | "scene" | "tagline" | "exit";

export default function IntroCinematic({ onDone }: { onDone: () => void }) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("logo");

  useEffect(() => {
    if (reduceMotion) {
      onDone();
      return;
    }
    const timers = [
      setTimeout(() => setStage("scene"), 900),
      setTimeout(() => setStage("tagline"), 3600),
      setTimeout(() => setStage("exit"), 4700),
      setTimeout(() => onDone(), 5300),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  function skip() {
    setStage("exit");
    setTimeout(() => onDone(), 500);
  }

  if (reduceMotion) return null;

  const sceneOn = stage === "scene" || stage === "tagline" || stage === "exit";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "exit" ? 0 : 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-brand-dark text-white ${
        stage === "exit" ? "pointer-events-none" : ""
      }`}
      aria-hidden={stage === "exit"}
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/25 blur-[110px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-500/20 blur-[110px]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
        aria-hidden
      />

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        onClick={skip}
        className="absolute right-5 top-5 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
      >
        {t("intro.skip")}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative z-10 mb-6 flex items-center gap-2 text-4xl font-extrabold tracking-tight will-change-transform sm:text-5xl"
      >
        <Ticket size={32} strokeWidth={2.3} className="text-gold-light" />
        Ticket<span className="text-gold-light">Area</span>
      </motion.div>

      {/* Scène : une personne arrive à l'entrée du concert, présente son billet, la porte s'ouvre */}
      <svg viewBox="0 0 320 150" className="relative z-10 h-32 w-full max-w-xs sm:h-36 sm:max-w-sm" aria-hidden>
        <defs>
          <radialGradient id="concertGlow">
            <stop offset="0%" stopColor="#d4af5a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d4af5a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Lueur du concert derrière la porte, révélée à l'ouverture */}
        <motion.circle
          cx="160"
          cy="70"
          r="6"
          fill="url(#concertGlow)"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={sceneOn ? { opacity: 1, scale: 9 } : {}}
          transition={{ duration: 1, delay: 1.5, ease: EASE }}
        />
        {/* Points lumineux de foule, à peine visibles derrière la porte ouverte */}
        {[
          { x: 148, y: 55 },
          { x: 168, y: 48 },
          { x: 178, y: 62 },
          { x: 152, y: 68 },
          { x: 172, y: 72 },
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.6"
            fill="#d4af5a"
            initial={{ opacity: 0 }}
            animate={sceneOn ? { opacity: [0, 1, 0.5] } : {}}
            transition={{ duration: 0.6, delay: 1.8 + i * 0.08, ease: EASE }}
          />
        ))}

        {/* Battants de la porte du venue */}
        <motion.rect
          y="30"
          width="10"
          height="80"
          rx="1.5"
          fill="#10152b"
          initial={{ x: 150 }}
          animate={sceneOn ? { x: 118 } : { x: 150 }}
          transition={{ duration: 0.6, delay: 1.4, ease: EASE }}
        />
        <motion.rect
          y="30"
          width="10"
          height="80"
          rx="1.5"
          fill="#10152b"
          initial={{ x: 160 }}
          animate={sceneOn ? { x: 192 } : { x: 160 }}
          transition={{ duration: 0.6, delay: 1.4, ease: EASE }}
        />
        {/* Cadre de l'entrée */}
        <rect x="112" y="26" width="96" height="6" rx="2" fill="#3b4a7a" opacity="0.6" />
        <rect x="112" y="26" width="6" height="88" rx="2" fill="#3b4a7a" opacity="0.6" />
        <rect x="202" y="26" width="6" height="88" rx="2" fill="#3b4a7a" opacity="0.6" />

        {/* Sol */}
        <rect x="10" y="112" width="300" height="1.5" fill="#ffffff" opacity="0.12" />

        {/* Silhouette qui marche vers l'entrée puis y entre */}
        <motion.g
          initial={{ x: 16 }}
          animate={sceneOn ? { x: [16, 100, 100, 150], y: [0, 0, 0, -1] } : { x: 16 }}
          transition={{ duration: 2.6, delay: 0, times: [0, 0.5, 0.62, 1], ease: EASE }}
          style={{ willChange: "transform" }}
        >
          <motion.g
            animate={sceneOn ? { opacity: [1, 1, 1, 0] } : { opacity: 1 }}
            transition={{ duration: 2.6, times: [0, 0.75, 0.85, 1], ease: "easeInOut" }}
          >
            <circle cx="0" cy="86" r="7" fill="#d4af5a" />
            <rect x="-6" y="93" width="12" height="22" rx="5" fill="#f5f1e6" />
            <rect x="-6" y="112" width="5" height="14" rx="2.2" fill="#10152b" />
            <rect x="1" y="112" width="5" height="14" rx="2.2" fill="#10152b" />
            {/* Bras levé tenant le billet */}
            <motion.rect
              x="6"
              y="90"
              width="4"
              height="14"
              rx="2"
              fill="#f5f1e6"
              initial={{ rotate: 60 }}
              animate={sceneOn ? { rotate: [60, 60, -25, -25] } : { rotate: 60 }}
              transition={{ duration: 2.6, times: [0, 0.5, 0.62, 1], ease: EASE }}
              style={{ transformOrigin: "6px 90px" }}
            />
            {/* Billet / téléphone présenté */}
            <motion.g
              initial={{ opacity: 0, y: 0 }}
              animate={sceneOn ? { opacity: [0, 0, 1, 1], y: [4, 4, -14, -14] } : { opacity: 0 }}
              transition={{ duration: 2.6, times: [0, 0.5, 0.62, 1], ease: EASE }}
            >
              <rect x="2" y="88" width="10" height="15" rx="2" fill="#ffffff" stroke="#b8912f" strokeWidth="1" />
              <rect x="4.5" y="91" width="2" height="2" fill="#1e2749" />
              <rect x="7.5" y="91" width="2" height="2" fill="#1e2749" />
              <rect x="4.5" y="94" width="2" height="2" fill="#1e2749" />
              <rect x="4.5" y="97" width="5" height="1.2" fill="#b8912f" />
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={stage === "tagline" || stage === "exit" ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-10 mt-6 max-w-md px-6 text-center text-sm text-white/70 sm:text-base"
      >
        {t("intro.tagline")}
      </motion.p>
    </motion.div>
  );
}
