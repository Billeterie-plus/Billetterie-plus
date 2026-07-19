"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useT } from "../lib/i18n/LanguageContext";

const ACCENTS = [
  "from-brand to-brand-light",
  "from-gold to-gold-light",
  "from-emerald-500 to-emerald-300",
  "from-brand-light to-emerald-400",
];

export default function EventCard({ event, accentIndex = 0 }: { event: any; accentIndex?: number }) {
  const t = useT();
  const accent = ACCENTS[accentIndex % ACCENTS.length];
  const minPrice = Math.min(...event.ticketTypes.map((t: any) => t.price));
  const date = new Date(event.startDateTime).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const isPast = new Date(event.endDateTime || event.startDateTime).getTime() < Date.now();

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <Link
        href={`/events/${event.id}`}
        className={`group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl ${
          isPast ? "opacity-60" : ""
        }`}
      >
        <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} aria-hidden />
        <div className="relative overflow-hidden">
          {event.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt={event.title}
              className={`h-52 w-full object-cover object-[center_20%] transition duration-700 group-hover:scale-110 ${
                isPast ? "grayscale" : ""
              }`}
            />
          )}
          {isPast && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow">
              {t("event.ended")}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-gold-dark">
            {t(`event.type.${event.type}`) || event.type}
          </div>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {event.type === "TRAIN" ? `${event.departureStation} → ${event.arrivalStation}` : event.venue}
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
            <span className="text-slate-500">{date}</span>
            <span className="font-semibold text-brand">{t("event.from", { price: minPrice })}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
