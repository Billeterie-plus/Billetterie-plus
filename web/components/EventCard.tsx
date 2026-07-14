"use client";

import Link from "next/link";
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
    <Link
      href={`/events/${event.id}`}
      className={`block overflow-hidden rounded-xl border-2 border-brand/30 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl animate-fadeInUp ${
        isPast ? "opacity-70" : ""
      }`}
    >
      <div className="relative">
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`h-52 w-full object-cover object-[center_20%] ${isPast ? "grayscale" : ""}`}
          />
        )}
        {isPast && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {t("event.ended")}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs font-medium text-brand">{t(`event.type.${event.type}`) || event.type}</div>
        <h3 className="mt-1 text-lg font-semibold">{event.title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {event.type === "TRAIN"
            ? `${event.departureStation} → ${event.arrivalStation}`
            : event.venue}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">{date}</span>
          <span className="font-semibold">{t("event.from", { price: minPrice })}</span>
        </div>
      </div>
    </Link>
  );
}
