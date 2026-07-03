"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "../../lib/api";

export default function MyTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    api("/tickets/mine")
      .then(setTickets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <p className="text-slate-500">Chargement…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Mes billets</h1>
      {tickets.length === 0 ? (
        <p className="text-slate-500">Vous n'avez pas encore de billet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
              <img src={t.qrDataUrl} alt="QR code" className="h-28 w-28 rounded" />
              <div>
                <p className="font-semibold">{t.event.title}</p>
                <p className="text-sm text-slate-500">{t.ticketType.name}</p>
                {t.seatInfo && <p className="text-sm text-slate-500">{t.seatInfo}</p>}
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(t.event.startDateTime).toLocaleString("fr-FR")}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    t.status === "VALID"
                      ? "bg-green-100 text-green-700"
                      : t.status === "USED"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t.status === "VALID" ? "Valide" : t.status === "USED" ? "Scanné" : "Annulé"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
