"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../../lib/api";
import { useT } from "../../../../lib/i18n/LanguageContext";

export default function OrganizerEventStats() {
  const { id } = useParams<{ id: string }>();
  const t = useT();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/organizer/events/${id}/stats`).then(setStats).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <p className="text-slate-500">{t("common.loading")}</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{stats.title}</h1>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t("orgStats.revenue")} value={`${stats.revenue.toFixed(2)} ${stats.currency}`} />
        <StatCard label={t("orgStats.ticketsSold")} value={stats.ticketsSold} />
        <StatCard label={t("orgStats.checkedIn")} value={stats.checkedIn} />
      </div>

      <h2 className="mb-3 font-semibold">{t("orgStats.byTier")}</h2>
      <div className="space-y-2">
        {stats.perTier.map((tier: any) => (
          <div key={tier.name} className="flex items-center justify-between rounded-lg border bg-white p-3">
            <span>{tier.name}</span>
            <span className="text-sm text-slate-500">
              {t("orgStats.sold", { sold: tier.sold, quota: tier.quota, price: tier.price })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
