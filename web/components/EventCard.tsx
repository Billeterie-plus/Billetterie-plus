import Link from "next/link";

const TYPE_LABELS: Record<string, string> = {
  CONCERT: "🎵 Concert",
  SOIREE: "🎉 Soirée tamoule",
};

export default function EventCard({ event }: { event: any }) {
  const minPrice = Math.min(...event.ticketTypes.map((t: any) => t.price));
  const date = new Date(event.startDateTime).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${event.id}`}
      className="block overflow-hidden rounded-xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-fadeInUp"
    >
      {event.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.imageUrl} alt={event.title} className="h-36 w-full object-cover" />
      )}
      <div className="p-4">
        <div className="text-xs font-medium text-brand">{TYPE_LABELS[event.type] || event.type}</div>
        <h3 className="mt-1 text-lg font-semibold">{event.title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {event.type === "TRAIN"
            ? `${event.departureStation} → ${event.arrivalStation}`
            : event.venue}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">{date}</span>
          <span className="font-semibold">à partir de {minPrice}€</span>
        </div>
      </div>
    </Link>
  );
}
