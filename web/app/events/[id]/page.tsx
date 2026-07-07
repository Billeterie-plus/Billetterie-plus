"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, getToken } from "../../../lib/api";
import { ARTISTS } from "../../../lib/artists";
import ArtistAvatar from "../../../components/ArtistAvatar";
import { useT } from "../../../lib/i18n/LanguageContext";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const t = useT();
  const [event, setEvent] = useState<any>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  useEffect(() => {
    api(`/events/${id}`, { auth: false }).then(setEvent).catch((e) => setError(e.message));
  }, [id]);

  // Restaure le panier si la personne vient de se connecter/s'inscrire après avoir choisi ses billets
  useEffect(() => {
    if (!event || typeof window === "undefined") return;
    const raw = sessionStorage.getItem("pendingPurchase");
    if (!raw) return;
    try {
      const pending = JSON.parse(raw);
      if (pending.eventId === event.id) {
        setQuantities(pending.quantities || {});
        setPromoCode(pending.promoCode || "");
      }
    } catch {
      // ignore
    } finally {
      sessionStorage.removeItem("pendingPurchase");
    }
  }, [event]);

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

  const eventDate = new Date(event.startDateTime);
  const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isPast = new Date(event.endDateTime || event.startDateTime).getTime() < Date.now();

  function handleBuy() {
    if (!getToken()) {
      sessionStorage.setItem(
        "pendingPurchase",
        JSON.stringify({ eventId: event.id, quantities, promoCode })
      );
      const redirect = encodeURIComponent(`/events/${event.id}`);
      router.push(`/login?redirect=${redirect}`);
      return;
    }
    // On passe par une page de paiement dédiée (récapitulatif, CGV/RGPD, paiement sécurisé)
    sessionStorage.setItem(
      "checkoutDraft",
      JSON.stringify({ eventId: event.id, quantities, promoCode })
    );
    router.push("/checkout");
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
        {event.type === "SOIREE" ? t("eventDetail.backSoirees") : t("eventDetail.backConcerts")}
      </Link>

      {/* Bannière avec titre incrusté */}
      <div className="relative mb-8 h-72 w-full overflow-hidden rounded-2xl shadow-lg sm:h-[26rem] animate-fadeInUp">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`h-full w-full object-cover object-[center_20%] ${isPast ? "grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
              {t(`event.type.${event.type}`) || event.type}
            </span>
            {isPast ? (
              <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                {t("event.ended")}
              </span>
            ) : (
              daysUntil >= 0 &&
              daysUntil <= 30 && (
                <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                  {daysUntil === 0 ? t("eventDetail.today") : daysUntil === 1 ? t("eventDetail.tomorrow") : t("eventDetail.inDays", { n: daysUntil })}
                </span>
              )
            )}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-4xl">
            {event.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/90">
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
            <span>
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

      {/* Récap infos pratiques : nom, heure, adresse, transport, parking */}
      <section className="mb-8 rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-lg font-bold text-slate-900">{t("eventDetail.practicalInfo")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("eventDetail.eventLabel")}</p>
            <p className="mt-1 text-sm text-slate-700">{event.title}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("eventDetail.dateTime")}</p>
            <p className="mt-1 text-sm text-slate-700">
              {eventDate.toLocaleString("fr-FR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("eventDetail.address")}</p>
            <p className="mt-1 text-sm text-slate-700">{venue || t("eventDetail.addressUnknown")}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("eventDetail.transport")}</p>
            <p className="mt-1 text-sm text-slate-700">
              {event.transportInfo || t("eventDetail.transportUnknown")}
            </p>
          </div>
        </div>

        {(event.parkingInfo || event.parkingFree === true || event.parkingFree === false) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                event.parkingFree === true
                  ? "bg-green-100 text-green-700"
                  : event.parkingFree === false
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {event.parkingFree === true ? t("eventDetail.parkingFree") : event.parkingFree === false ? t("eventDetail.parkingPaid") : t("eventDetail.parking")}
            </span>
            {event.parkingInfo && <span className="text-sm text-slate-600">{event.parkingInfo}</span>}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {event.description && (
            <section className="rounded-xl border bg-white p-5">
              <h2 className="mb-2 text-lg font-bold text-slate-900">{t("eventDetail.about")}</h2>
              <p className="leading-relaxed text-slate-700">{event.description}</p>
            </section>
          )}

          <div className="mt-4 flex items-center justify-between rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">
              {t("eventDetail.organizedByPrefix")} <span className="font-medium text-slate-700">{event.organization?.name}</span>
            </p>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {copied ? t("eventDetail.shareCopied") : t("eventDetail.share")}
            </button>
          </div>
        </div>

        {/* Sélection des billets */}
        <div className="rounded-xl border bg-white p-5 shadow-sm h-fit lg:sticky lg:top-20">
          <h2 className="mb-1 text-lg font-bold text-slate-900">{t("eventDetail.chooseTickets")}</h2>
          <p className="mb-4 text-xs text-slate-400">{t("eventDetail.chooseTicketsHint")}</p>

          <div className="space-y-3">
            {event.ticketTypes.map((tt: any) => {
              const remaining = tt.quota - tt.sold;
              const soldOut = remaining <= 0;
              const percentSold = tt.quota > 0 ? Math.round((tt.sold / tt.quota) * 100) : 0;
              const isLow = !soldOut && remaining <= tt.quota * 0.15;
              const qty = quantities[tt.id] || 0;

              function setQty(next: number) {
                setQuantities((q) => ({ ...q, [tt.id]: Math.max(0, Math.min(remaining, next)) }));
              }

              return (
                <div
                  key={tt.id}
                  className={`rounded-lg border p-3 transition ${
                    qty > 0 ? "border-brand bg-brand/5" : "border-slate-200"
                  } ${soldOut ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{tt.name}</p>
                      <p className="text-sm font-semibold text-slate-700">{tt.price}€</p>
                    </div>

                    {soldOut ? (
                      <span className="whitespace-nowrap rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                        {t("eventDetail.soldOut")}
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
                        {isLow ? t("eventDetail.lowStock", { n: remaining }) : t("eventDetail.remaining", { n: remaining })}
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
            placeholder={t("eventDetail.promoCode")}
            className="mt-4 w-full rounded-lg border px-3 py-2 text-sm"
          />

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="font-semibold text-slate-900">{t("eventDetail.total")}</span>
            <span className="text-xl font-bold text-brand">{total.toFixed(2)}€</span>
          </div>
          {totalQty > 0 && (
            <p className="mt-1 text-xs text-slate-400">{t("eventDetail.ticketsSelected", { n: totalQty })}</p>
          )}

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleBuy}
            disabled={totalQty === 0}
            className="mt-4 w-full rounded-lg bg-brand py-2.5 font-medium text-white transition hover:scale-[1.01] hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {totalQty === 0
              ? t("eventDetail.selectTickets")
              : !loggedIn
              ? t("eventDetail.loginAndContinue", { total: total.toFixed(2) })
              : t("eventDetail.continueToPayment", { total: total.toFixed(2) })}
          </button>
          <p className="mt-2 text-center text-xs text-slate-400">
            {totalQty > 0 && !loggedIn ? t("eventDetail.cartKeptLoggedOut") : t("eventDetail.securePayment")}
          </p>
        </div>
      </div>

      {/* --- Infos complémentaires en bas de page --- */}
      <div className="mt-12 grid grid-cols-1 gap-6 border-t pt-8 lg:grid-cols-2">
        {/* À propos de l'artiste */}
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-3 text-lg font-bold text-slate-900">{t("eventDetail.aboutArtist")}</h2>
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
                <span className="mt-1 inline-block text-xs font-medium text-brand">{t("eventDetail.viewFullProfile")}</span>
              </div>
            </Link>
          ) : (
            <div>
              <p className="text-sm text-slate-600">{t("eventDetail.artistFallback")}</p>
              <Link href="/artistes" className="mt-2 inline-block text-xs font-medium text-brand hover:underline">
                {t("listing.discoverArtists")}
              </Link>
            </div>
          )}
        </section>

        {/* Carte de la salle */}
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-3 text-lg font-bold text-slate-900">{t("eventDetail.whereItHappens")}</h2>
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
            <p className="text-sm text-slate-500">{t("eventDetail.venueUnknown")}</p>
          )}
        </section>

        {/* Comment s'y rendre */}
        {venue && (
          <section className="rounded-xl border bg-white p-5 lg:col-span-2">
            <h2 className="mb-3 text-lg font-bold text-slate-900">{t("eventDetail.howToGetThere")}</h2>
            {(event.transportInfo || event.parkingInfo) && (
              <div className="mb-3 space-y-1 text-sm text-slate-600">
                {event.transportInfo && (
                  <p>
                    <span className="font-medium text-slate-800">{t("eventDetail.transportLabel")}</span>
                    {event.transportInfo}
                  </p>
                )}
                {event.parkingInfo && (
                  <p>
                    <span className="font-medium text-slate-800">
                      {t("eventDetail.parkingLabel")}
                      {event.parkingFree === true ? `(${t("eventDetail.parkingFree").toLowerCase()}) ` : event.parkingFree === false ? `(${t("eventDetail.parkingPaid").toLowerCase()}) ` : ""}
                    </span>
                    {event.parkingInfo}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=transit`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                {t("eventDetail.publicTransit")}
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                {t("eventDetail.byCar")}
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                {t("eventDetail.byFoot")}
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-400">{t("eventDetail.transitTip")}</p>
          </section>
        )}
      </div>
    </div>
  );
}
