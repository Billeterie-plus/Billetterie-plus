"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Film, Music, PartyPopper, Ticket } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TICKETS: { icon: typeof Music; key: "concert" | "soiree" | "film" }[] = [
  { icon: Music, key: "concert" },
  { icon: PartyPopper, key: "soiree" },
  { icon: Film, key: "film" },
];

const ticketVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

export default function IntroCinematic({ onDone }: { onDone: () => void }) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<"logo" | "tickets" | "tagline" | "exit">("logo");

  useEffect(() => {
    if (reduceMotion) {
      onDone();
      return;
    }
    const timers = [
      setTimeout(() => setStage("tickets"), 900),
      setTimeout(() => setStage("tagline"), 2600),
      setTimeout(() => setStage("exit"), 4400),
      setTimeout(() => onDone(), 5000),
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
        className="relative z-10 mb-9 flex items-center gap-2 text-4xl font-extrabold tracking-tight will-change-transform sm:text-5xl"
      >
        <Ticket size={32} strokeWidth={2.3} className="text-gold-light" />
        Ticket<span className="text-gold-light">Area</span>
      </motion.div>

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 px-6">
        {TICKETS.map((tk, i) => (
          <motion.div
            key={tk.key}
            custom={i}
            variants={ticketVariants}
            initial="hidden"
            animate={stage === "logo" ? "hidden" : "visible"}
            className="relative flex w-36 flex-col items-center gap-2 rounded-2xl border border-white/15 bg-brand-light/40 px-5 py-6 shadow-xl will-change-transform sm:w-40"
          >
            <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-brand-dark" aria-hidden />
            <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-brand-dark" aria-hidden />
            <tk.icon size={24} strokeWidth={2} className="text-gold-light" />
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">{t(`intro.${tk.key}`)}</span>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={stage === "tagline" || stage === "exit" ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-10 mt-9 max-w-md px-6 text-center text-sm text-white/70 sm:text-base"
      >
        {t("intro.tagline")}
      </motion.p>
    </motion.div>
  );
}
