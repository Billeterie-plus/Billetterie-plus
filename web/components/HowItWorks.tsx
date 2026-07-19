"use client";

import { CreditCard, QrCode, Search } from "lucide-react";
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
      <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
        <h2 className="mb-5 text-xl font-bold text-white">{t("howItWorks.title")}</h2>
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3" stagger={0.15}>
          {steps.map((s, i) => (
            <RevealItem key={i} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-light ring-1 ring-gold/20">
                  <s.icon size={20} strokeWidth={2} />
                </span>
                <span className="text-2xl font-bold text-white/15">{i + 1}</span>
              </div>
              <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{s.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </Reveal>
  );
}
