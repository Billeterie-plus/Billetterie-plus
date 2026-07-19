"use client";

import { ShieldCheck, Wallet, Zap } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";
import Reveal from "./Reveal";

export default function TrustBadges() {
  const t = useT();
  const items = [
    { icon: ShieldCheck, label: t("trust.securePayment") },
    { icon: Zap, label: t("trust.instantTicket") },
    { icon: Wallet, label: t("trust.methods") },
  ];

  return (
    <Reveal>
      <section className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-xl shadow-black/20 backdrop-blur-xl sm:px-6">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium text-white/75">
            <it.icon size={16} strokeWidth={2} className="text-gold-light" />
            {it.label}
          </div>
        ))}
      </section>
    </Reveal>
  );
}
