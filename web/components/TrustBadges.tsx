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
      <section className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <it.icon size={16} strokeWidth={2} className="text-brand" />
            {it.label}
          </div>
        ))}
      </section>
    </Reveal>
  );
}
