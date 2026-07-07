"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useT } from "../../lib/i18n/LanguageContext";
import EventsMap from "../../components/EventsMap";

export default function MapPage() {
  const t = useT();
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/events", { auth: false })
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-brand to-brand-light p-8 text-white">
        <h1 className="text-3xl font-bold">{t("map.title")}</h1>
        <p className="mt-2 max-w-2xl text-white/90">{t("map.subtitle")}</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading ? <p className="text-slate-500">{t("common.loading")}</p> : <EventsMap events={events} />}
    </div>
  );
}
