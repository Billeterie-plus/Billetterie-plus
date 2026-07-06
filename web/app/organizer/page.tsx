"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getToken, getUser } from "../../lib/api";

export default function OrganizerDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!getToken() || user?.role !== "ORGANIZER") {
      router.push("/login");
      return;
    }
    api("/organizer/events")
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  async function togglePublish(event: any) {
    const newStatus = event.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const updated = await api(`/organizer/events/${event.id}`, { method: "PATCH", body: { status: newStatus } });
    setEvents((evts) => evts.map((e) => (e.id === event.id ? updated : e)));
  }

  const totalTicketsSold = events.reduce(
    (sum, e) => sum + (e.ticketTypes?.reduce((s: number, t: any) => s + t.sold, 0) || 0),
    0
  );
  const totalQuota = events.reduce(
    (sum, e) => sum + (e.ticketTypes?.reduce((s: number, t: any) => s + t.quota, 0) || 0),
    0
  );
  const totalRevenue = events.reduce(
    (sum, e) => sum + (e.ticketTypes?.reduce((s: number, t: any) => s + t.sold * t.price, 0) || 0),
    0
  );
  const publishedCount = events.filter((e) => e.status === "PUBLISHED").length;
  const fillRate = totalQuota > 0 ? Math.round((totalTicketsSold / totalQuota) * 100) : 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Espace organisateur</h1>
        <div className="flex gap-2">
          <Link href="/organizer/scan" className="rounded-lg bg-slate-100 px-4 py-2 hover:bg-slate-200">
            Scanner un billet
          </Link>
          <Link href="/organizer/events/new" className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-dark">
            + Nouvel événement
          </Link>
        </div>
      </div>

      {/* Flux des billets : vue d'ensemble */}
      {!loading && events.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-slate-500">Événements publiés</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{publishedCount}<span className="text-sm font-normal text-slate-400">/{events.length}</span></p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-slate-500">Billets vendus</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{totalTicketsSold}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-slate-500">Revenu estimé</p>
            <p className="mt-1 text-2xl font-bold text-brand">{totalRevenue.toFixed(0)}€</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-slate-500">Taux de remplissage</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{fillRate}%</p>
          </div>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : events.length === 0 ? (
        <p className="text-slate-500">Aucun événement pour l'instant. Créez-en un !</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className="text-sm text-slate-500">
                  {e.type} · {new Date(e.startDateTime).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    e.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : e.status === "DRAFT"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {e.status}
                </span>
                <button
                  onClick={() => togglePublish(e)}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200"
                >
                  {e.status === "PUBLISHED" ? "Dépublier" : "Publier"}
                </button>
                <Link
                  href={`/organizer/events/${e.id}/edit`}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200"
                >
                  Modifier
                </Link>
                <Link
                  href={`/organizer/events/${e.id}`}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200"
                >
                  Statistiques
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
