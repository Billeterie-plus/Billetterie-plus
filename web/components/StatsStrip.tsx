"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Ticket, Users } from "lucide-react";
import { api } from "../lib/api";
import { ARTISTS } from "../lib/artists";
import { useT } from "../lib/i18n/LanguageContext";

export default function StatsStrip() {
  const t = useT();
  const [stats, setStats] = useState<{ eventCount: number; ticketsSold: number } | null>(null);

  useEffect(() => {
    api("/events/stats", { auth: false })
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const items = [
    { icon: CalendarCheck, value: stats.eventCount, label: t("stats.events") },
    { icon: Ticket, value: stats.ticketsSold, label: t("stats.tickets") },
    { icon: Users, value: ARTISTS.length, label: t("stats.artists") },
  ];

  return (
    <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-xl font-bold text-slate-900">{t("stats.title")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50/60 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <it.icon size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-2xl font-bold text-slate-900">{it.value}</p>
              <p className="text-xs text-slate-500">{it.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
