"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../../lib/api";

export default function OrganizerEventStats() {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/organizer/events/${id}/stats`).then(setStats).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <p className="text-slate-500">Chargement…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{stats.title}</h1>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Revenu" value={`${stats.revenue.toFixed(2)} ${stats.currency}`} />
        <StatCard label="Billets vendus" value={stats.ticketsSold} />
        <StatCard label="Scannés à l'entrée" value={stats.checkedIn} />
      </div>

      <h2 className="mb-3 font-semibold">Détail par tarif</h2>
      <div className="space-y-2">
        {stats.perTier.map((t: any) => (
          <div key={t.name} className="flex items-center justify-between rounded-lg border bg-white p-3">
            <span>{t.name}</span>
            <span className="text-sm text-slate-500">
              {t.sold} / {t.quota} vendus · {t.price}€
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
