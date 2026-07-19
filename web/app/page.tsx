"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../lib/api";
import EventCard from "../components/EventCard";
import ArtistSpotlight from "../components/ArtistSpotlight";
import ArtistSearchBox from "../components/ArtistSearchBox";
import HeroBanner from "../components/HeroBanner";
import FaqSection from "../components/FaqSection";
import HowItWorks from "../components/HowItWorks";
import TrustBadges from "../components/TrustBadges";
import LastChanceEvents from "../components/LastChanceEvents";
import OrganizerCta from "../components/OrganizerCta";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
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
      <OrganizerCta />

      <HeroBanner />

      <Reveal>
        <section
          id="evenements"
          className="mb-10 scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="mb-4 font-serif text-2xl font-semibold text-slate-900">{t("nav.events")}</h2>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("home.searchPlaceholder")}
              className="w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-brand/50 focus:outline-none sm:w-auto"
            />
            <div className="flex flex-wrap gap-2">
              {TYPES.map((tp) => (
                <button
                  key={tp.value}
                  onClick={() => setType(tp.value)}
                  className={`rounded-full px-3 py-1.5 text-sm transition hover:scale-105 ${
                    type === tp.value
                      ? "bg-gradient-to-r from-brand to-brand-dark font-medium text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {loading ? (
            <p className="text-slate-500">{t("common.loading")}</p>
          ) : events.length === 0 ? (
            <p className="text-slate-500">{t("home.noEvents")}</p>
          ) : (
            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {events.map((e, i) => (
                <RevealItem key={e.id}>
                  <EventCard event={e} accentIndex={i} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </section>
      </Reveal>

      <LastChanceEvents events={events} />

      <HowItWorks />

      <ArtistSearchBox />

      <ArtistSpotlight />

      <TrustBadges />

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
