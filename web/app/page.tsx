"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../lib/api";
import EventCard from "../components/EventCard";
import ArtistSpotlight from "../components/ArtistSpotlight";
import ArtistSearchBox from "../components/ArtistSearchBox";
import FaqSection from "../components/FaqSection";
import HowItWorks from "../components/HowItWorks";
import TrustBadges from "../components/TrustBadges";
import LastChanceEvents from "../components/LastChanceEvents";
import OrganizerCta from "../components/OrganizerCta";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import IntroCinematic from "../components/IntroCinematic";
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

      <HowItWorks />

      <Reveal>
        <section
          id="evenements"
          className="relative mb-10 scroll-mt-20 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand via-brand to-brand-dark p-5 text-white shadow-xl shadow-black/30 sm:p-6"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-emerald-500/15 blur-[80px]" aria-hidden />
          <h2 className="relative mb-4 text-2xl font-bold text-gold-light">{t("nav.events")}</h2>

          <div className="relative mb-6 flex flex-wrap items-center gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("home.searchPlaceholder")}
              className="w-full max-w-sm rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-gold-light/50 focus:bg-white/15 focus:outline-none sm:w-auto"
            />
            <div className="flex flex-wrap gap-2">
              {TYPES.map((tp) => (
                <button
                  key={tp.value}
                  onClick={() => setType(tp.value)}
                  className={`rounded-full px-3 py-1.5 text-sm transition hover:scale-105 ${
                    type === tp.value
                      ? "bg-gradient-to-r from-gold-light to-gold font-medium text-brand-dark"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="relative text-red-300">{error}</p>}
          {loading ? (
            <p className="relative text-white/70">{t("common.loading")}</p>
          ) : events.length === 0 ? (
            <p className="relative text-white/70">{t("home.noEvents")}</p>
          ) : (
            <RevealGroup className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
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

      <ArtistSearchBox />

      <ArtistSpotlight />

      <TrustBadges />

      <FaqSection />
    </div>
  );
}

// sessionStorage (et non localStorage) : l'intro se rejoue à chaque nouvelle visite (nouvel onglet/session),
// mais ni un simple rafraîchissement de page ni un clic sur le logo "Ticket Area" (retour à l'accueil dans
// la même session) ne la redéclenchent.
const INTRO_SESSION_KEY = "ticketarea_intro_played";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);

  useEffect(() => {
    try {
      const alreadyPlayed = window.sessionStorage.getItem(INTRO_SESSION_KEY);
      if (!alreadyPlayed) {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
        setShowIntro(true);
      }
    } catch {
      // sessionStorage indisponible (navigation privée, etc.) : on ne joue pas l'intro par prudence
    } finally {
      setIntroChecked(true);
    }
  }, []);

  return (
    <>
      {introChecked && showIntro && <IntroCinematic onDone={() => setShowIntro(false)} />}
      {introChecked && !showIntro && (
        <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
          <HomeContent />
        </Suspense>
      )}
    </>
  );
}
