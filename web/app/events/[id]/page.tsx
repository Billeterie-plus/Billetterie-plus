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

const TYPE_EMOJI: Record<string, string> = {
  CONCERT: "🎵",
  SOIREE: "🎉",
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api(`/events/${id}`, { auth: false }).then(setEvent).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!event) {
    return (
      <div className="animate-pulse">
        <div className="h-72 w-full rounded-2xl bg-slate-200 sm:h-96" />
        <div className="mt-5 h-6 w-32 rounded-full bg-slate-200" />
        <div className="mt-3 h-9 w-2/3 rounded bg-slate-200" />
      </div>
    );
  }

  const total = event.ticketTypes.reduce(
    (sum: number, t: any) => sum + (quantities[t.id] || 0) * t.price,
    0
  );
  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);

  const matchedArtist = ARTISTS.find((a) => event.title.toLowerCase().includes(a.name.toLowerCase()));
  const venue = event.type === "TRAIN" ? null : event.venue;
  const mapQuery = venue ? encodeURIComponent(venue) : "";
  const emoji = TYPE_EMOJI[event.type] || "🎫";

  const eventDate = new Date(event.startDateTime);
  const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

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

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      {/* Fil d'ariane */}
      <Link
        href={event.type === "SOIREE" ? "/evenements/soirees-tamoules" : "/evenements/concerts-tamouls"}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-brand"
      >
        ← Retour aux {event.type === "SOIREE" ? "soirées" : "concerts"}
      </Link>

      {/* En-tête : affiche portrait centrée + informations */}
      <div className="mb-8 flex flex-col items-center text-center animate-fadeInUp">
        <div className="w-64 shrink-0 overflow-hidden rounded-2xl shadow-lg sm:w-80">
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt={event.title}
              className="aspect-[3/4] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center bg-gradient-to-br from-brand via-brand-light to-brand-dark bg-200 animate-gradientMove">
              <span className="text-7xl">{emoji}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex max-w-2xl flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand">
              {TYPE_LABELS[event.type] || event.type}
            </span>
            {daysUntil >= 0 && daysUntil <= 30 && (
              <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                {daysUntil === 0 ? "Aujourd'hui" : daysUntil === 1 ? "Demain" : `Dans ${daysUntil} jours`}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            {event.title}
          </h1>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-sm text-slate-600">
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
              {eventDate.toLocaleString("fr-FR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {event.description && (
            <section className="rounded-xl border bg-white p-5">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-sm">📝</span>
                À propos de l'événement
              </h2>
              <p className="leading-relaxed text-slate-700">{event.description}</p>
            </section>
          )}

          <div className="mt-4 flex items-center justify-between rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">
              Organisé par <span className="font-medium text-slate-700">{event.organization?.name}</span>
            </p>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {copied ? "✅ Lien copié" : "🔗 Partager"}
            </button>
          </div>
        </div>

        {/* Sélection des billets */}
        <div className="rounded-xl border bg-white p-5 shadow-sm h-fit lg:sticky lg:top-20">
          <h2 className="mb-1 text-lg font-bold text-slate-900">Choisissez vos billets</h2>
          <p className="mb-4 text-xs text-slate-400">Sélectionnez une catégorie et ajustez la quantité.</p>

          <div className="space-y-3">
            {event.ticketTypes.map((t: any) => {
              const remaining = t.quota - t.sold;
              const soldOut = remaining <= 0;
              const percentSold = t.quota > 0 ? Math.round((t.sold / t.quota) * 100) : 0;
              const isLow = !soldOut && remaining <= t.quota * 0.15;
              const qty = quantities[t.id] || 0;

              function setQty(next: number) {
                setQuantities((q) => ({ ...q, [t.id]: Math.max(0, Math.min(remaining, next)) }));
              }

              return (
                <div
                  key={t.id}
                  className={`rounded-lg border p-3 transition ${
                    qty > 0 ? "border-brand bg-brand/5" : "border-slate-200"
                  } ${soldOut ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{t.name}</p>
                      <p className="text-sm font-semibold text-slate-700">{t.price}€</p>
                    </div>

                    {soldOut ? (
                      <span className="whitespace-nowrap rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                        Épuisé
                      </span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setQty(qty - 1)}
                          disabled={qty === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-full border text-lg font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-semibold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(qty + 1)}
                          disabled={qty >= remaining}
                          className="flex h-8 w-8 items-center justify-center rounded-full border text-lg font-semibold text-brand transition hover:bg-brand/10 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {!soldOut && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${isLow ? "bg-red-500" : "bg-brand"}`}
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                      <p className={`mt-1 text-xs ${isLow ? "font-medium text-red-600" : "text-slate-400"}`}>
                        {isLow ? `Plus que ${remaining} places !` : `${remaining} places restantes`}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="🏷️ Code promo (optionnel)"
            className="mt-4 w-full rounded-lg border px-3 py-2 text-sm"
          />

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="text-xl font-bold text-brand">{total.toFixed(2)}€</span>
          </div>
          {totalQty > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              {totalQty} billet{totalQty > 1 ? "s" : ""} sélectionné{totalQty > 1 ? "s" : ""}
            </p>
          )}

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleBuy}
            disabled={totalQty === 0 || submitting}
            className="mt-4 w-full rounded-lg bg-brand py-2.5 font-medium text-white transition hover:scale-[1.01] hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? "Traitement…" : totalQty === 0 ? "Sélectionnez vos billets" : `Acheter (${total.toFixed(2)}€)`}
          </button>
        </div>
      </div>

      {/* --- Infos complémentaires en bas de page --- */}
      <div className="mt-12 grid grid-cols-1 gap-6 border-t pt-8 lg:grid-cols-2">
        {/* À propos de l'artiste */}
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-sm">🎤</span>
            À propos de l'artiste
          </h2>
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
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-sm">📍</span>
            Où se déroule l'événement
          </h2>
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
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-sm">🧭</span>
              Comment s'y rendre
            </h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=transit`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                🚇 Transports en commun
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                🚗 En voiture
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand/5 hover:text-brand"
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
