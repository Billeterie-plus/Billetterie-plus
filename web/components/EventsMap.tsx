"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "../lib/i18n/LanguageContext";
import "leaflet/dist/leaflet.css";

type GeoEvent = {
  id: string;
  title: string;
  venue: string;
  type: string;
  startDateTime: string;
  imageUrl?: string;
  lat: number;
  lng: number;
};

const GEOCODE_CACHE_KEY = "myticket_geocode_cache_v1";

function loadCache(): Record<string, { lat: number; lng: number } | null> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(GEOCODE_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, { lat: number; lng: number } | null>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // stockage plein / indisponible : tant pis, pas bloquant
  }
}

// Géocode une adresse via Nominatim (OpenStreetMap) — gratuit, sans clé API.
// On respecte la politique d'usage (1 requête/seconde max) via un délai entre
// chaque appel, et on met les résultats en cache (mémoire + localStorage)
// pour ne géocoder chaque lieu qu'une seule fois.
async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function EventsMap({ events }: { events: any[] }) {
  const t = useT();
  const [geoEvents, setGeoEvents] = useState<GeoEvent[] | null>(null);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const cacheRef = useRef<Record<string, { lat: number; lng: number } | null>>(loadCache());

  // Charge react-leaflet dynamiquement côté client uniquement (Leaflet a besoin de `window`).
  useEffect(() => {
    let cancelled = false;
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, L]) => {
      if (cancelled) return;
      setMapComponents({ ...rl, L: L.default });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const withVenue = events.filter((e) => e.venue);
      const results: GeoEvent[] = [];
      for (const e of withVenue) {
        if (cancelled) return;
        const key = e.venue.trim().toLowerCase();
        let coords = cacheRef.current[key];
        if (coords === undefined) {
          coords = await geocode(e.venue);
          cacheRef.current[key] = coords;
          saveCache(cacheRef.current);
          await sleep(1100); // politesse envers l'API gratuite Nominatim
        }
        if (coords) {
          results.push({
            id: e.id,
            title: e.title,
            venue: e.venue,
            type: e.type,
            startDateTime: e.startDateTime,
            imageUrl: e.imageUrl,
            lat: coords.lat,
            lng: coords.lng,
          });
          // Mise à jour progressive : les repères apparaissent au fur et à mesure.
          if (!cancelled) setGeoEvents([...results]);
        }
      }
      if (!cancelled && results.length === 0) setGeoEvents([]);
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const center = useMemo<[number, number]>(() => {
    if (geoEvents && geoEvents.length > 0) {
      return [geoEvents[0].lat, geoEvents[0].lng];
    }
    return [46.6, 2.4]; // centre approximatif de la France
  }, [geoEvents && geoEvents.length > 0 ? geoEvents[0].id : null]);

  if (!MapComponents || geoEvents === null) {
    return (
      <div className="flex h-[32rem] items-center justify-center rounded-2xl border bg-white">
        <p className="text-sm text-slate-400">{t("map.loading")}</p>
      </div>
    );
  }

  if (geoEvents.length === 0) {
    return (
      <div className="flex h-[32rem] items-center justify-center rounded-2xl border bg-white">
        <p className="text-sm text-slate-400">{t("map.noLocated")}</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, L } = MapComponents;

  function pinIcon(color: string) {
    return L.divIcon({
      className: "",
      html: `<div style="background:${color};width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 16],
    });
  }

  return (
    <div className="h-[32rem] overflow-hidden rounded-2xl border shadow-sm">
      <MapContainer center={center} zoom={5} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoEvents.map((e) => {
          const isPast = new Date(e.startDateTime).getTime() < Date.now();
          return (
            <Marker key={e.id} position={[e.lat, e.lng]} icon={pinIcon(isPast ? "#94a3b8" : "#1e2749")}>
              <Popup>
                <div className="min-w-[160px]">
                  <p className="text-xs font-semibold text-brand">{t(`event.type.${e.type}`) || e.type}</p>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-slate-500">{e.venue}</p>
                  {isPast && <p className="mt-1 text-xs font-semibold text-red-600">{t("event.ended")}</p>}
                  <Link href={`/events/${e.id}`} className="mt-1 inline-block text-xs font-medium text-brand hover:underline">
                    {t("map.viewEvent")}
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
