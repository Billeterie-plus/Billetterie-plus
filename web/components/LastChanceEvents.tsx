"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";

// Un événement est considéré "dernières places" quand il reste 15% ou moins
// de la jauge totale (tous tarifs confondus), le même seuil que celui utilisé
// sur la page événement pour l'alerte de stock bas — pas de chiffre inventé,
// tout est calculé depuis les vraies quantités vendues/disponibles.
function computeRemaining(event: any) {
  const totals = event.ticketTypes.reduce(
    (acc: { quota: number; sold: number }, tt: any) => ({ quota: acc.quota + tt.quota, sold: acc.sold + tt.sold }),
    { quota: 0, sold: 0 }
  );
  return { remaining: totals.quota - totals.sold, quota: totals.quota };
}

export default function LastChanceEvents({ events }: { events: any[] }) {
  const t = useT();

  const lowStock = events
    .filter((e) => new Date(e.endDateTime || e.startDateTime).getTime() >= Date.now())
    .map((e) => ({ event: e, ...computeRemaining(e) }))
    .filter(({ remaining, quota }) => quota > 0 && remaining > 0 && remaining <= quota * 0.15)
    .sort((a, b) => a.remaining - b.remaining)
    .slice(0, 4);

  if (lowStock.length === 0) return null;

  return (
    <Reveal>
      <section className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand via-brand to-brand-dark p-5 text-white shadow-xl shadow-black/30 sm:p-6">
        <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-red-500/15 blur-[70px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-fuchsia-500/15 blur-[70px]" aria-hidden />
        <div className="relative mb-4 flex items-center gap-2">
          <Flame size={20} strokeWidth={2} className="text-gold-light" />
          <div>
            <h2 className="font-serif text-2xl font-semibold text-gold-light">{t("lastChance.title")}</h2>
            <p className="text-sm text-white/70">{t("lastChance.subtitle")}</p>
          </div>
        </div>
        <RevealGroup className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {lowStock.map(({ event, remaining }) => (
            <RevealItem key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="group block overflow-hidden rounded-xl bg-white text-slate-900 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  {event.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-32 w-full object-cover object-[center_20%] transition duration-700 group-hover:scale-110"
                    />
                  )}
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                    <Flame size={11} strokeWidth={2.5} /> {t("lastChance.remaining", { n: remaining })}
                  </span>
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{event.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{event.venue}</p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </Reveal>
  );
}
