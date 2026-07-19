"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Ticket } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Stage = "logo" | "scene" | "tagline" | "exit";

// Foule de silhouettes en fond de scène, à différentes profondeurs (échelle/opacité variables)
const CROWD = [
  { x: 190, y: 78, s: 0.7 },
  { x: 205, y: 82, s: 0.8 },
  { x: 220, y: 76, s: 0.65 },
  { x: 235, y: 84, s: 0.85 },
  { x: 250, y: 79, s: 0.7 },
  { x: 265, y: 86, s: 0.9 },
  { x: 280, y: 80, s: 0.75 },
  { x: 200, y: 92, s: 0.95 },
  { x: 222, y: 95, s: 1 },
  { x: 244, y: 91, s: 1 },
  { x: 266, y: 96, s: 1.05 },
  { x: 288, y: 90, s: 0.9 },
];

function CrowdPerson({ x, y, s, delay, armUp }: { x: number; y: number; s: number; delay: number; armUp?: boolean }) {
  return (
    <motion.g
      transform={`translate(${x} ${y}) scale(${s})`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.85] }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <circle cx="0" cy="0" r="3.2" fill="#10152b" />
      <path d="M -4 3 Q 0 22 4 3 Z" fill="#10152b" />
      {armUp && (
        <motion.rect
          x="2.5"
          y="1"
          width="1.6"
          height="9"
          rx="0.8"
          fill="#10152b"
          style={{ transformOrigin: "2.5px 1px" }}
          animate={{ rotate: [-8, 18, -8] }}
          transition={{ duration: 1.1, delay: delay + 0.3, repeat: 2, repeatType: "mirror", ease: "easeInOut" }}
        />
      )}
    </motion.g>
  );
}

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
      setTimeout(() => setStage("tagline"), 4200),
      setTimeout(() => setStage("exit"), 5300),
      setTimeout(() => onDone(), 5900),
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
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/20 blur-[110px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-500/15 blur-[110px]" aria-hidden />
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
        className="relative z-10 mb-2 flex items-center gap-2 text-2xl font-extrabold tracking-tight will-change-transform sm:mb-3 sm:text-4xl"
      >
        <Ticket size={26} strokeWidth={2.3} className="text-gold-light" />
        Ticket<span className="text-gold-light">Area</span>
      </motion.div>

      {/* Scène : une silhouette rejoint la foule d'un vrai concert, spots et scène en fond */}
      <svg viewBox="0 0 320 155" className="relative z-10 h-[46vh] w-full max-w-2xl sm:h-[54vh] sm:max-w-4xl" aria-hidden>
        <defs>
          <radialGradient id="stageGlow" cx="50%" cy="20%">
            <stop offset="0%" stopColor="#d4af5a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d4af5a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beamGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af5a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d4af5a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beamEmerald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beamBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fa0e0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8fa0e0" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Lueur générale de la scène */}
        <motion.circle
          cx="235"
          cy="35"
          r="14"
          fill="url(#stageGlow)"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={sceneOn ? { opacity: 1, scale: 5.5 } : {}}
          transition={{ duration: 1.3, delay: 0.1, ease: EASE }}
        />

        {/* Faisceaux de spots qui balaient une fois, depuis la scène */}
        <motion.polygon
          points="235,10 210,90 260,90"
          fill="url(#beamGold)"
          style={{ transformOrigin: "235px 10px" }}
          initial={{ opacity: 0, rotate: -14 }}
          animate={sceneOn ? { opacity: [0, 0.9, 0.6], rotate: [-14, 10, -4] } : { opacity: 0 }}
          transition={{ duration: 2.6, delay: 0.2, ease: EASE }}
        />
        <motion.polygon
          points="235,10 195,95 240,95"
          fill="url(#beamEmerald)"
          style={{ transformOrigin: "235px 10px" }}
          initial={{ opacity: 0, rotate: 18 }}
          animate={sceneOn ? { opacity: [0, 0.8, 0.5], rotate: [18, -12, 6] } : { opacity: 0 }}
          transition={{ duration: 2.8, delay: 0.35, ease: EASE }}
        />
        <motion.polygon
          points="235,10 250,95 290,95"
          fill="url(#beamBlue)"
          style={{ transformOrigin: "235px 10px" }}
          initial={{ opacity: 0, rotate: -6 }}
          animate={sceneOn ? { opacity: [0, 0.7, 0.45], rotate: [-6, 16, 2] } : { opacity: 0 }}
          transition={{ duration: 2.4, delay: 0.45, ease: EASE }}
        />

        {/* Scène + rampe de projecteurs */}
        <rect x="205" y="28" width="60" height="6" rx="1.5" fill="#3b4a7a" opacity="0.7" />
        {[212, 224, 236, 248, 258].map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy="31"
            r="1.6"
            fill="#d4af5a"
            initial={{ opacity: 0.15 }}
            animate={sceneOn ? { opacity: [0.15, 1, 0.4] } : {}}
            transition={{ duration: 1, delay: 0.5 + i * 0.12, ease: EASE }}
          />
        ))}
        <rect x="196" y="98" width="78" height="5" rx="1.5" fill="#10152b" />

        {/* Foule au pied de la scène */}
        {CROWD.map((p, i) => (
          <CrowdPerson key={i} x={p.x} y={p.y} s={p.s} delay={0.6 + i * 0.05} armUp={i % 3 === 0} />
        ))}

        {/* Marquise lumineuse de l'entrée */}
        <motion.g initial={{ opacity: 0 }} animate={sceneOn ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.9, ease: EASE }}>
          <path d="M 96 40 L 130 32 L 130 40 L 96 48 Z" fill="#3b4a7a" opacity="0.75" />
          {[100, 108, 116, 124].map((cx, i) => (
            <motion.circle
              key={cx}
              cx={cx}
              cy={44 - i * 2}
              r="1.3"
              fill="#d4af5a"
              initial={{ opacity: 0.2 }}
              animate={sceneOn ? { opacity: [0.2, 1, 0.5] } : {}}
              transition={{ duration: 0.8, delay: 1.1 + i * 0.1, ease: EASE }}
            />
          ))}
        </motion.g>

        {/* Sol */}
        <rect x="8" y="118" width="304" height="1.5" fill="#ffffff" opacity="0.12" />
        {/* Voile de fumée légère, statique une fois apparue */}
        <motion.ellipse
          cx="220"
          cy="100"
          rx="90"
          ry="16"
          fill="#ffffff"
          initial={{ opacity: 0 }}
          animate={sceneOn ? { opacity: 0.045 } : {}}
          transition={{ duration: 2, delay: 0.6, ease: EASE }}
        />

        {/* Silhouette : marche réaliste (jambes alternées) vers la foule, billet levé au passage de l'entrée */}
        <motion.g
          initial={{ x: 20 }}
          animate={sceneOn ? { x: [20, 108, 108, 190] } : { x: 20 }}
          transition={{ duration: 3.1, times: [0, 0.42, 0.52, 1], ease: EASE }}
          style={{ willChange: "transform" }}
        >
          <motion.g
            initial={{ scale: 1, opacity: 1 }}
            animate={
              sceneOn
                ? { opacity: [1, 1, 1, 0.85, 0], scale: [1, 1, 1, 0.72, 0.55] }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 3.1, times: [0, 0.6, 0.75, 0.9, 1], ease: "easeInOut" }}
            style={{ transformOrigin: "0px 105px" }}
          >
            <circle cx="0" cy="82" r="6.5" fill="#d4af5a" />
            <rect x="-5.5" y="88.5" width="11" height="18" rx="4.5" fill="#f5f1e6" />

            {/* Jambes en alternance : vraie démarche */}
            <motion.rect
              x="-5.5"
              y="106"
              width="4.5"
              height="15"
              rx="2"
              fill="#10152b"
              style={{ transformOrigin: "-3.2px 106px" }}
              animate={sceneOn ? { rotate: [-16, 16, -16] } : { rotate: 0 }}
              transition={{ duration: 0.42, delay: 0.05, repeat: 6, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.rect
              x="1"
              y="106"
              width="4.5"
              height="15"
              rx="2"
              fill="#10152b"
              style={{ transformOrigin: "3.2px 106px" }}
              animate={sceneOn ? { rotate: [16, -16, 16] } : { rotate: 0 }}
              transition={{ duration: 0.42, delay: 0.05, repeat: 6, repeatType: "mirror", ease: "easeInOut" }}
            />

            {/* Bras levé tenant le billet au passage de l'entrée */}
            <motion.rect
              x="5.5"
              y="90"
              width="3.6"
              height="13"
              rx="1.8"
              fill="#f5f1e6"
              initial={{ rotate: 55 }}
              animate={sceneOn ? { rotate: [55, 55, -20, -20] } : { rotate: 55 }}
              transition={{ duration: 3.1, times: [0, 0.42, 0.52, 1], ease: EASE }}
              style={{ transformOrigin: "5.5px 90px" }}
            />
            {/* Billet / téléphone présenté */}
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={sceneOn ? { opacity: [0, 0, 1, 1, 0], y: [4, 4, -13, -13, -13] } : { opacity: 0 }}
              transition={{ duration: 3.1, times: [0, 0.42, 0.52, 0.85, 1], ease: EASE }}
            >
              <rect x="1.5" y="86" width="9" height="14" rx="2" fill="#ffffff" stroke="#b8912f" strokeWidth="1" />
              <rect x="3.8" y="89" width="1.8" height="1.8" fill="#1e2749" />
              <rect x="6.5" y="89" width="1.8" height="1.8" fill="#1e2749" />
              <rect x="3.8" y="91.8" width="1.8" height="1.8" fill="#1e2749" />
              <rect x="3.8" y="94.5" width="4.5" height="1.1" fill="#b8912f" />
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={stage === "tagline" || stage === "exit" ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-10 mt-2 max-w-md px-6 text-center text-sm text-white/70 sm:mt-3 sm:text-base"
      >
        {t("intro.tagline")}
      </motion.p>
    </motion.div>
  );
}
