"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, getToken } from "../../../lib/api";
import { ARTISTS } from "../../../lib/artists";
import ArtistAvatar from "../../../components/ArtistAvatar";

const TYPE_LABELS: Record<string, string> = {
  CONCERT: "🎵 Concert",
  SOIREE: "🎉 Soirée tamoule",
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api(`/events/${id}`, { auth: false }).then(setEvent).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!event) return <p className="text-slate-500">Chargement…</p>;

  const total = event.ticketTypes.reduce(
    (sum: number, t: any) => sum + (quantities[t.id] || 0) * t.price,
    0
  );
  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);

  const matchedArtist = ARTISTS.find((a) => event.title.toLowerCase().includes(a.name.toLowerCase()));
  const venue = event.type === "TRAIN" ? null : event.venue;
  const mapQuery = venue ? encodeURIComponent(venue) : "";

  async function handleBuy() {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const items = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

      const res = await api("/orders", {
        method: "POST",
        body: { eventId: event.id, items, promoCode: promoCode || undefined },
      });

      if (res.mode === "demo") {
        router.push(`/my-tickets?order=${res.orderId}`);
      } else {
        window.location.href = res.redirectUrl;
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {event.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt={event.title}
              className="mb-5 h-72 w-full rounded-2xl object-cover object-[center_20%] shadow-sm sm:h-96 animate-fadeInUp"
            />
          )}
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand">
            {TYPE_LABELS[event.type] || event.type}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            {event.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {venue && (
              <span className="flex items-center gap-1.5">
                <span aria-hidden>📍</span> {venue}
              </span>
            )}
            {event.type === "TRAIN" && (
              <span className="flex items-center gap-1.5">
                <span aria-hidden>🚆</span> {event.departureStation} → {event.arrivalStation}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span aria-hidden>📅</span>
              {new Date(event.startDateTime).toLocaleString("fr-FR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {event.description && (
            <p className="mt-5 leading-relaxed text-slate-700">{event.description}</p>
          )}
          <p className="mt-4 text-sm text-slate-400">Organisé par {event.organization?.name}</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm h-fit lg:sticky lg:top-20">
          <h2 className="mb-3 font-semibold">Choisissez vos billets</h2>
          <div className="space-y-3">
            {event.ticketTypes.map((t: any) => {
              const remaining = t.quota - t.sold;
              return (
                <div key={t.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-slate-500">
                      {t.price}€ · {remaining > 0 ? `${remaining} places restantes` : "Épuisé"}
                    </p>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={remaining}
                    disabled={remaining === 0}
                    value={quantities[t.id] || 0}
                    onChange={(e) =>
                      setQuantities((q) => ({ ...q, [t.id]: Math.max(0, Number(e.target.value)) }))
                    }
                    className="w-16 rounded border px-2 py-1 text-center"
                  />
                </div>
              );
            })}
          </div>

          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Code promo (optionnel)"
            className="mt-4 w-full rounded-lg border px-3 py-2 text-sm"
          />

          <div className="mt-4 flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>{total.toFixed(2)}€</span>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleBuy}
            disabled={totalQty === 0 || submitting}
            className="mt-4 w-full rounded-lg bg-brand py-2.5 text-white transition hover:scale-[1.01] hover:bg-brand-dark disabled:opacity-50"
          >
            {submitting ? "Traitement…" : "Acheter"}
          </button>
        </div>
      </div>

      {/* --- Infos complémentaires en bas de page --- */}
      <div className="mt-12 grid grid-cols-1 gap-6 border-t pt-8 lg:grid-cols-2">
        {/* À propos de l'artiste */}
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-3 text-lg font-bold text-slate-900">À propos de l'artiste</h2>
          {matchedArtist ? (
            <Link href={`/artistes/${matchedArtist.slug}`} className="group flex gap-4">
              <ArtistAvatar
                image={matchedArtist.image}
                icon={matchedArtist.icon}
                color={matchedArtist.color}
                name={matchedArtist.name}
              />
              <div>
                <p className="font-semibold text-slate-900 group-hover:underline">{matchedArtist.name}</p>
                <p className="text-xs font-medium text-brand">{matchedArtist.tag}</p>
                <p className="mt-1 text-sm text-slate-600">{matchedArtist.short}</p>
                <span className="mt-1 inline-block text-xs font-medium text-brand">Voir la fiche complète →</span>
              </div>
            </Link>
          ) : (
            <div>
              <p className="text-sm text-slate-600">
                Cet événement met à l'honneur la scène musicale tamoule (Kollywood, playback, Gana...).
                Retrouvez tous les compositeurs, chanteurs et artistes tamouls référencés sur My Ticket.
              </p>
              <Link href="/artistes" className="mt-2 inline-block text-xs font-medium text-brand hover:underline">
                Découvrir les artistes tamouls →
              </Link>
            </div>
          )}
        </section>

        {/* Carte de la salle */}
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Où se déroule l'événement</h2>
          {venue ? (
            <>
              <p className="mb-3 flex items-center gap-1.5 text-sm text-slate-600">
                <span aria-hidden>📍</span> {venue}
              </p>
              <div className="overflow-hidden rounded-lg border">
                <iframe
                  title="Carte de la salle"
                  src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">Lieu à confirmer par l'organisateur.</p>
          )}
        </section>

        {/* Comment s'y rendre */}
        {venue && (
          <section className="rounded-xl border bg-white p-5 lg:col-span-2">
            <h2 className="mb-3 text-lg font-bold text-slate-900">Comment s'y rendre</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=transit`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
              >
                🚇 Transports en commun
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
              >
                🚗 En voiture
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
              >
                🚶 À pied
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Pensez à vérifier les derniers horaires de transport le soir de l'événement, notamment pour les soirées tardives.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
