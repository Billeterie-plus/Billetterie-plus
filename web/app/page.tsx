"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import EventCard from "../components/EventCard";
import ArtistSpotlight from "../components/ArtistSpotlight";
import ArtistSearchBox from "../components/ArtistSearchBox";
import HeroBanner from "../components/HeroBanner";
import ArtistMarquee from "../components/ArtistMarquee";

const TYPES = [
  { value: "", label: "Tous" },
  { value: "TRAIN", label: "Train" },
  { value: "CONCERT", label: "Concert" },
  { value: "SPORT", label: "Sport" },
  { value: "THEATRE", label: "Théâtre" },
  { value: "OTHER", label: "Autre" },
];

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (q) params.set("q", q);
    api(`/events?${params.toString()}`, { auth: false })
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type, q]);

  return (
    <div>
      <HeroBanner />

      <ArtistSearchBox />

      <p className="mb-8 max-w-2xl text-slate-600">
        My Ticket réunit tous vos billets au même endroit : trains, concerts, sport et spectacles.
        Achetez en quelques clics, retrouvez vos e-billets à tout moment, et si vous organisez des
        événements, gérez-les depuis votre propre espace organisateur.
      </p>

      <ArtistMarquee />

      <ArtistSpotlight />

      <div id="evenements" className="mb-6 flex flex-wrap items-center gap-3 scroll-mt-20">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un événement..."
          className="w-full max-w-sm rounded-lg border px-3 py-2 sm:w-auto"
        />
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`rounded-full px-3 py-1.5 text-sm transition hover:scale-105 ${
                type === t.value ? "bg-brand text-white" : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : events.length === 0 ? (
        <p className="text-slate-500">Aucun événement trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <div key={e.id} style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}>
              <EventCard event={e} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
