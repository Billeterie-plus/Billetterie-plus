"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import EventCard from "./EventCard";
import { useT } from "../lib/i18n/LanguageContext";

export default function EventTypeListing({
  type,
  titleKey,
  introKey,
  emptyKey,
}: {
  type: string;
  titleKey: string;
  introKey: string;
  emptyKey: string;
}) {
  const t = useT();
  const title = t(titleKey);
  const intro = t(introKey);
  const emptyMessage = t(emptyKey);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api(`/events?type=${type}`, { auth: false })
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div>
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-brand to-brand-light p-8 text-white animate-fadeInUp">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 max-w-2xl text-white/90">{intro}</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p className="text-slate-500">{t("common.loading")}</p>
      ) : events.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center">
          <p className="text-slate-500">{emptyMessage}</p>
          <Link
            href="/organizer"
            className="mt-3 inline-block rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            {t("listing.organize")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/artistes" className="text-sm font-medium text-brand hover:underline">
          {t("listing.discoverArtists")}
        </Link>
      </div>
    </div>
  );
}
