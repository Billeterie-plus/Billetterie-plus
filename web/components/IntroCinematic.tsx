"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "../lib/i18n/LanguageContext";
import IntroScene3D from "./IntroScene3D";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Stage = "logo" | "tagline" | "exit";

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

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "exit" ? 0 : 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#10152b] text-white ${
        stage === "exit" ? "pointer-events-none" : ""
      }`}
      aria-hidden={stage === "exit"}
    >
      {/* Scène 3D (WebGL) : caméra qui avance vers un concert, spots, foule en particules, billet 3D */}
      <IntroScene3D />

      {/* Vignette cinématique pour renforcer la profondeur */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 78% 78% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
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
        className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-black/20 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm transition hover:border-white/40 hover:text-white"
      >
        {t("intro.skip")}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative z-10 flex items-center gap-2 text-3xl font-extrabold tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] will-change-transform sm:text-5xl"
      >
        Ticket<span className="text-gold-light">Area</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={stage === "tagline" || stage === "exit" ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-10 mt-4 max-w-md px-6 text-center text-sm text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:mt-5 sm:text-base"
      >
        {t("intro.tagline")}
      </motion.p>
    </motion.div>
  );
}
