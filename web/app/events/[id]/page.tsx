"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Car,
  Check,
  Compass,
  Footprints,
  Info,
  Link2,
  Map,
  MapPin,
  Mic2,
  ParkingCircle,
  Ticket,
  TrainFront,
  type LucideIcon,
} from "lucide-react";
import { api, getToken } from "../../../lib/api";
import { ARTISTS } from "../../../lib/artists";
import ArtistAvatar from "../../../components/ArtistAvatar";
import { useT } from "../../../lib/i18n/LanguageContext";

const SEAT_TIER_COLORS = ["#1e2749", "#b8912f", "#0f766e", "#be185d", "#2563eb", "#7c3aed"];

const SECTION_CARD = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition sm:p-6";

function SectionHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="h-4.5 w-4.5" strokeWidth={2} size={18} />
      </span>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium leading-snug text-slate-700">{value}</p>
      </div>
    </div>
  );
}

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
  const [seatMapData, setSeatMapData] = useState<{ seatMapEnabled: boolean; seatMapImageUrl: string | null; seats: any[] } | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  useEffect(() => {
    api(`/events/${id}`, { auth: false }).then(setEvent).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (!event?.seatMapEnabled) return;
    api(`/events/${event.id}/seats`, { auth: false }).then(setSeatMapData).catch(() => {});
  }, [event?.id, event?.seatMapEnabled]);

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
        setSelectedSeatIds(new Set(pending.selectedSeatIds || []));
      }
    } catch {
      // ignore
    } finally {
      sessionStorage.removeItem("pendingPurchase");
    }
  }, [event]);

  function toggleSeat(seat: any) {
    if (seat.status !== "AVAILABLE" && !selectedSeatIds.has(seat.id)) return;
    setSelectedSeatIds((prev) => {
      const next = new Set(prev);
      if (next.has(seat.id)) next.delete(seat.id);
      else next.add(seat.id);
      return next;
    });
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!event) {
    return (
      <div className="animate-pulse">
        <div className="h-72 w-full rounded-3xl bg-slate-200 sm:h-[26rem]" />
        <div className="mt-5 h-6 w-32 rounded-full bg-slate-200" />
        <div className="mt-3 h-9 w-2/3 rounded bg-slate-200" />
      </div>
    );
  }

  const allSeats: any[] = seatMapData?.seats || [];
  const seatedTierIds = new Set(allSeats.map((s) => s.ticketTypeId));
  const selectedSeats = allSeats.filter((s) => selectedSeatIds.has(s.id));
  const seatQuantitiesByTier: Record<string, number> = {};
  for (const s of selectedSeats) seatQuantitiesByTier[s.ticketTypeId] = (seatQuantitiesByTier[s.ticketTypeId] || 0) + 1;

  const total = event.ticketTypes.reduce((sum: number, tt: any) => {
    const qty = seatedTierIds.has(tt.id) ? seatQuantitiesByTier[tt.id] || 0 : quantities[tt.id] || 0;
    return sum + qty * tt.price;
  }, 0);
  const totalQty =
    Object.values(quantities).reduce((a: number, b: number) => a + b, 0) + selectedSeats.length;

  const matchedArtist = ARTISTS.find((a) => event.title.toLowerCase().includes(a.name.toLowerCase()));
  const venue = event.type === "TRAIN" ? null : event.venue;
  const mapQuery = venue ? encodeURIComponent(venue) : "";

  const eventDate = new Date(event.startDateTime);
  const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isPast = new Date(event.endDateTime || event.startDateTime).getTime() < Date.now();

  const formattedDate = eventDate.toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const backHref =
    event.type === "SOIREE"
      ? "/evenements/soirees-tamoules"
      : event.type === "FILM"
      ? "/evenements/films"
      : "/evenements/concerts-tamouls";
  const backLabel =
    event.type === "SOIREE"
      ? t("eventDetail.backSoirees")
      : event.type === "FILM"
      ? t("eventDetail.backFilms")
      : t("eventDetail.backConcerts");

  function handleBuy() {
    const seatIds = Array.from(selectedSeatIds);
    if (!getToken()) {
      sessionStorage.setItem(
        "pendingPurchase",
        JSON.stringify({ eventId: event.id, quantities, promoCode, selectedSeatIds: seatIds })
      );
      const redirect = encodeURIComponent(`/events/${event.id}`);
      router.push(`/login?redirect=${redirect}`);
      return;
    }
    // On passe par une page de paiement dédiée (récapitulatif, CGV/RGPD, paiement sécurisé)
    sessionStorage.setItem(
      "checkoutDraft",
      JSON.stringify({ eventId: event.id, quantities, promoCode, selectedSeatIds: seatIds })
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
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-500 shadow-sm transition hover:border-brand/30 hover:text-brand"
      >
        <ArrowLeft size={14} strokeWidth={2.5} /> {backLabel}
      </Link>

      {/* Bannière avec titre incrusté */}
      <div className="relative mb-6 h-72 w-full overflow-hidden rounded-3xl shadow-xl sm:h-[28rem] animate-fadeInUp">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`h-full w-full object-cover object-[center_20%] transition duration-700 ${isPast ? "grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand to-brand-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

        <button
          onClick={handleShare}
          className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-white/25"
        >
          {copied ? <Check size={14} strokeWidth={2.5} /> : <Link2 size={14} strokeWidth={2} />}
          {copied ? t("eventDetail.shareCopied") : t("eventDetail.share")}
        </button>

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
                <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {daysUntil === 0 ? t("eventDetail.today") : daysUntil === 1 ? t("eventDetail.tomorrow") : t("eventDetail.inDays", { n: daysUntil })}
                </span>
              )
            )}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-5xl">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Récap infos pratiques : nom, heure, adresse, transport, parking */}
      <section className={`${SECTION_CARD} mb-6`}>
        <SectionHeader icon={Info} title={t("eventDetail.practicalInfo")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile icon={Ticket} label={t("eventDetail.eventLabel")} value={event.title} />
          <InfoTile icon={Calendar} label={t("eventDetail.dateTime")} value={formattedDate} />
          <InfoTile icon={MapPin} label={t("eventDetail.address")} value={venue || t("eventDetail.addressUnknown")} />
          <InfoTile
            icon={TrainFront}
            label={t("eventDetail.transport")}
            value={event.transportInfo || t("eventDetail.transportUnknown")}
          />
        </div>

        {(event.parkingInfo || event.parkingFree === true || event.parkingFree === false) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                event.parkingFree === true
                  ? "bg-green-100 text-green-700"
                  : event.parkingFree === false
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <ParkingCircle size={13} strokeWidth={2.5} />
              {event.parkingFree === true ? t("eventDetail.parkingFree") : event.parkingFree === false ? t("eventDetail.parkingPaid") : t("eventDetail.parking")}
            </span>
            {event.parkingInfo && <span className="text-sm text-slate-600">{event.parkingInfo}</span>}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {event.description && (
            <section className={SECTION_CARD}>
              <h2 className="mb-2 text-lg font-bold text-slate-900">{t("eventDetail.about")}</h2>
              <p className="leading-relaxed text-slate-700">{event.description}</p>
            </section>
          )}

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">
              {t("eventDetail.organizedByPrefix")} <span className="font-medium text-slate-700">{event.organization?.name}</span>
            </p>
          </div>
        </div>

        {/* Sélection des billets */}
        <div className={`${SECTION_CARD} h-fit lg:sticky lg:top-20`}>
          <h2 className="mb-1 text-lg font-bold text-slate-900">{t("eventDetail.chooseTickets")}</h2>
          <p className="mb-4 text-xs text-slate-400">{t("eventDetail.chooseTicketsHint")}</p>

          <div className="space-y-3">
            {event.ticketTypes.map((tt: any, idx: number) => {
              if (seatedTierIds.has(tt.id)) return null; // affiché dans le plan de salle ci-dessous
              const remaining = tt.quota - tt.sold;
              const soldOut = remaining <= 0;
              const percentSold = tt.quota > 0 ? Math.round((tt.sold / tt.quota) * 100) : 0;
              const isLow = !soldOut && remaining <= tt.quota * 0.15;
              const qty = quantities[tt.id] || 0;
              const tierColor = SEAT_TIER_COLORS[idx % SEAT_TIER_COLORS.length];

              function setQty(next: number) {
                setQuantities((q) => ({ ...q, [tt.id]: Math.max(0, Math.min(remaining, next)) }));
              }

              return (
                <div
                  key={tt.id}
                  className={`relative overflow-hidden rounded-xl border pl-4 pr-3 py-3 transition ${
                    qty > 0 ? "border-brand bg-brand/5" : "border-slate-200"
                  } ${soldOut ? "opacity-60" : ""}`}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1.5"
                    style={{ backgroundColor: tierColor }}
                    aria-hidden
                  />
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
                          className={`h-full rounded-full transition-all ${isLow ? "bg-red-500" : "bg-brand"}`}
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

          {seatMapData?.seatMapEnabled && allSeats.length > 0 && (
            <div className="mt-4 rounded-xl border border-slate-200 p-3">
              <p className="mb-1 text-sm font-semibold text-slate-800">{t("eventDetail.seatMapTitle")}</p>
              <p className="mb-2 text-xs text-slate-400">{t("eventDetail.seatMapHint")}</p>

              <div className="mb-2 flex flex-wrap gap-2">
                {Array.from(seatedTierIds).map((ttId, i) => {
                  const tt = event.ticketTypes.find((x: any) => x.id === ttId);
                  if (!tt) return null;
                  return (
                    <span key={ttId} className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SEAT_TIER_COLORS[i % SEAT_TIER_COLORS.length] }} />
                      {tt.name} — {tt.price}€
                    </span>
                  );
                })}
              </div>

              <div className="relative overflow-hidden rounded-lg border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={seatMapData.seatMapImageUrl || ""} alt="" className="block w-full" draggable={false} />
                {allSeats.map((seat) => {
                  const tierIdx = Array.from(seatedTierIds).indexOf(seat.ticketTypeId);
                  const selected = selectedSeatIds.has(seat.id);
                  const takenByOther = seat.status !== "AVAILABLE" && !selected;
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      title={`${seat.row}${seat.number}`}
                      onClick={() => toggleSeat(seat)}
                      disabled={takenByOther}
                      className={`absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[9px] font-bold text-white shadow ring-2 transition ${
                        takenByOther ? "cursor-not-allowed opacity-40 ring-white" : "cursor-pointer ring-white hover:scale-125"
                      } ${selected ? "scale-125 ring-4 ring-brand" : ""}`}
                      style={{
                        left: `${seat.x}%`,
                        top: `${seat.y}%`,
                        backgroundColor: takenByOther ? "#94a3b8" : SEAT_TIER_COLORS[tierIdx % SEAT_TIER_COLORS.length],
                      }}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-brand" /> {t("eventDetail.seatLegendSelected")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-400 opacity-40" /> {t("eventDetail.seatLegendTaken")}
                </span>
              </div>

              {selectedSeats.length > 0 && (
                <p className="mt-2 text-xs font-medium text-brand">{t("eventDetail.seatsSelectedCount", { n: selectedSeats.length })}</p>
              )}
            </div>
          )}

          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder={t("eventDetail.promoCode")}
            className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
          />

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
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
            className="mt-4 w-full rounded-xl bg-brand py-3 font-medium text-white shadow-sm transition hover:scale-[1.01] hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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
      <div className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-100 pt-8 lg:grid-cols-2">
        {/* À propos de l'artiste */}
        <section className={SECTION_CARD}>
          <SectionHeader icon={Mic2} title={t("eventDetail.aboutArtist")} />
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
        <section className={SECTION_CARD}>
          <SectionHeader icon={Map} title={t("eventDetail.whereItHappens")} />
          {venue ? (
            <>
              <p className="mb-3 flex items-center gap-1.5 text-sm text-slate-600">
                <MapPin size={14} strokeWidth={2} /> {venue}
              </p>
              <div className="overflow-hidden rounded-xl border border-slate-100">
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
          <section className={`${SECTION_CARD} lg:col-span-2`}>
            <SectionHeader icon={Compass} title={t("eventDetail.howToGetThere")} />
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
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                <TrainFront size={14} strokeWidth={2} /> {t("eventDetail.publicTransit")}
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                <Car size={14} strokeWidth={2} /> {t("eventDetail.byCar")}
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition hover:border-brand hover:bg-brand/5 hover:text-brand"
              >
                <Footprints size={14} strokeWidth={2} /> {t("eventDetail.byFoot")}
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-400">{t("eventDetail.transitTip")}</p>
          </section>
        )}
      </div>
    </div>
  );
}
