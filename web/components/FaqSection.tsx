"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../lib/i18n/LanguageContext";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";

const QUESTION_KEYS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function FaqSection() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(1);

  return (
    <Reveal>
      <section
        id="faq"
        className="relative mb-10 mt-16 scroll-mt-20 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand via-brand to-brand-dark p-5 text-white shadow-xl shadow-black/30 sm:p-6"
      >
        <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold/15 blur-[90px]" aria-hidden />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-emerald-500/15 blur-[90px]" aria-hidden />
        <h2 className="relative mb-2 text-3xl font-bold text-gold-light">{t("faq.title")}</h2>
        <p className="relative mb-8 text-sm text-white/70">{t("faq.subtitle")}</p>

        <RevealGroup className="relative mx-auto max-w-3xl space-y-3" stagger={0.06}>
          {QUESTION_KEYS.map((n) => {
            const isOpen = open === n;
            return (
              <RevealItem key={n} className="overflow-hidden rounded-xl border border-white/10 bg-white">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : n)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-medium text-slate-900">{t(`faq.q${n}`)}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-lg text-brand"
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t px-5 py-4 text-sm leading-relaxed text-slate-600">{t(`faq.a${n}`)}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>
    </Reveal>
  );
}
