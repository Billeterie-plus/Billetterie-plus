"use client";

import { CreditCard, QrCode, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "../lib/i18n/LanguageContext";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";

export default function HowItWorks() {
  const t = useT();
  const steps = [
    { icon: Search, title: t("howItWorks.step1Title"), desc: t("howItWorks.step1Desc") },
    { icon: CreditCard, title: t("howItWorks.step2Title"), desc: t("howItWorks.step2Desc") },
    { icon: QrCode, title: t("howItWorks.step3Title"), desc: t("howItWorks.step3Desc") },
  ];

  return (
    <Reveal>
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-8 text-2xl font-bold text-slate-900">{t("howItWorks.title")}</h2>
        <RevealGroup className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6" stagger={0.15}>
          {/* Ligne de connexion entre les étapes, visible en desktop */}
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-[22px] hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent sm:block"
            aria-hidden
          />
          {steps.map((s, i) => (
            <RevealItem key={i}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                <div className="relative flex items-center gap-3">
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-md shadow-brand/20">
                    <s.icon size={19} strokeWidth={2.2} />
                  </span>
                  <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-white text-xs font-bold text-gold-dark">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </Reveal>
  );
}
