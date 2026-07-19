"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useT } from "../lib/i18n/LanguageContext";

export default function EventCard({ event }: { event: any }) {
  const t = useT();
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
        className={`group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20 backdrop-blur-xl transition-colors duration-300 hover:border-gold-light/40 ${
          isPast ? "opacity-60" : ""
        }`}
      >
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
          {isPast && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow">
              {t("event.ended")}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-gold-light">
            {t(`event.type.${event.type}`) || event.type}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-white">{event.title}</h3>
          <p className="mt-1 text-sm text-white/50">
            {event.type === "TRAIN" ? `${event.departureStation} → ${event.arrivalStation}` : event.venue}
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
            <span className="text-white/50">{date}</span>
            <span className="font-semibold text-white">{t("event.from", { price: minPrice })}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
