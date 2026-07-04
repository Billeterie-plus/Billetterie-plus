"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, getToken } from "../../../lib/api";

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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            className="mb-4 h-72 w-full rounded-xl object-cover object-[center_20%] sm:h-96"
          />
        )}
        <p className="text-sm font-medium text-brand">{event.type}</p>
        <h1 className="mt-1 text-3xl font-bold">{event.title}</h1>
        <p className="mt-2 text-slate-500">
          {event.type === "TRAIN"
            ? `${event.departureStation} → ${event.arrivalStation}`
            : event.venue}
        </p>
        <p className="mt-1 text-slate-500">
          {new Date(event.startDateTime).toLocaleString("fr-FR")}
        </p>
        {event.description && <p className="mt-4">{event.description}</p>}
        <p className="mt-4 text-sm text-slate-400">Organisé par {event.organization?.name}</p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm h-fit">
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
          className="mt-4 w-full rounded-lg bg-brand py-2.5 text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {submitting ? "Traitement…" : "Acheter"}
        </button>
      </div>
    </div>
  );
}
