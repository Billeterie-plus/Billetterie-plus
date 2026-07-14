"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../lib/api";
import EventCard from "../components/EventCard";
import ArtistSpotlight from "../components/ArtistSpotlight";
import ArtistSearchBox from "../components/ArtistSearchBox";
import HeroBanner from "../components/HeroBanner";
import ArtistMarquee from "../components/ArtistMarquee";
import FaqSection from "../components/FaqSection";
import { useT } from "../lib/i18n/LanguageContext";

function HomeContent() {
  const t = useT();
  const TYPES = [
    { value: "", label: t("home.typeAll") },
    { value: "CONCERT", label: t("home.typeConcert") },
    { value: "SOIREE", label: t("home.typeSoiree") },
    { value: "FILM", label: t("home.typeFilm") },
  ];
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("q")) {
      document.getElementById("evenements")?.scrollIntoView({ behavior: "smooth" });
    } else if (typeof window !== "undefined" && window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <section id="evenements" className="mb-10 scroll-mt-20 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-lg sm:p-6">
        <h2 className="mb-4 text-xl font-bold text-gold-light">{t("nav.events")}</h2>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("home.searchPlaceholder")}
            className="w-full max-w-sm rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none sm:w-auto"
          />
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`rounded-full px-3 py-1.5 text-sm transition hover:scale-105 ${
                  type === t.value ? "bg-white text-brand" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-300">{error}</p>}
        {loading ? (
          <p className="text-white/70">{t("common.loading")}</p>
        ) : events.length === 0 ? (
          <p className="text-white/70">{t("home.noEvents")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e, i) => (
              <div key={e.id} style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}>
                <EventCard event={e} />
              </div>
            ))}
          </div>
        )}
      </section>

      <ArtistSearchBox />

      <ArtistMarquee />

      <ArtistSpotlight />

      <FaqSection />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
      <HomeContent />
    </Suspense>
  );
}
