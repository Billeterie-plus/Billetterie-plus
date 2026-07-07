"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, getToken, getUser } from "../../lib/api";
import { useT } from "../../lib/i18n/LanguageContext";

type Draft = { eventId: string; quantities: Record<string, number>; promoCode?: string };

function CheckoutContent() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "true";
  const [draft, setDraft] = useState<Draft | null>(null);
  const [event, setEvent] = useState<any>(null);
  const [promoCode, setPromoCode] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = getUser<{ name: string; email: string }>();

  useEffect(() => {
    if (!getToken()) {
      router.push("/login?redirect=" + encodeURIComponent("/checkout"));
      return;
    }
    const raw = sessionStorage.getItem("checkoutDraft");
    if (!raw) {
      router.push("/");
      return;
    }
    const parsed: Draft = JSON.parse(raw);
    setDraft(parsed);
    setPromoCode(parsed.promoCode || "");
    api(`/events/${parsed.eventId}`, { auth: false })
      .then(setEvent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="text-slate-500">{t("common.loading")}</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!draft || !event) return null;

  const lines = event.ticketTypes
    .map((t: any) => ({ ...t, qty: draft.quantities[t.id] || 0 }))
    .filter((t: any) => t.qty > 0);
  const total = lines.reduce((sum: number, t: any) => sum + t.qty * t.price, 0);
  const totalQty = lines.reduce((sum: number, t: any) => sum + t.qty, 0);

  async function handleConfirm() {
    if (!accepted || !draft) return;
    setSubmitting(true);
    setError("");
    try {
      const items = Object.entries(draft.quantities)
        .filter(([, qty]) => qty > 0)
        .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

      const res = await api("/orders", {
        method: "POST",
        body: { eventId: draft.eventId, items, promoCode: promoCode || undefined },
      });

      if (res.mode === "demo") {
        // Paiement démo confirmé immédiatement : le panier a servi, on peut le vider.
        sessionStorage.removeItem("checkoutDraft");
        router.push(`/my-tickets?order=${res.orderId}&success=true`);
      } else {
        // On part sur la page de paiement Stripe : on garde le panier en cas d'annulation,
        // il sera nettoyé au retour en cas de succès (page "Mes billets").
        window.location.href = res.redirectUrl;
      }
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/events/${event.id}`} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand">
        {t("checkout.back")}
      </Link>

      <h1 className="mb-1 text-2xl font-bold text-slate-900">{t("checkout.title")}</h1>
      <p className="mb-4 text-sm text-slate-500">{t("checkout.subtitle")}</p>

      {cancelled && (
        <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">{t("checkout.cancelled")}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Récapitulatif de commande */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-slate-900">{t("checkout.summary")}</h2>
            <div className="flex gap-3">
              {event.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.imageUrl} alt={event.title} className="h-16 w-16 shrink-0 rounded-lg object-cover object-[center_20%]" />
              )}
              <div>
                <p className="font-medium text-slate-900">{event.title}</p>
                <p className="text-sm text-slate-500">{event.venue}</p>
                <p className="text-xs text-slate-400">
                  {new Date(event.startDateTime).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-4 divide-y border-t pt-3">
              {lines.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-700">
                    {t.name} <span className="text-slate-400">× {t.qty}</span>
                  </span>
                  <span className="font-medium text-slate-900">{(t.qty * t.price).toFixed(2)}€</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 border-t pt-3">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={t("checkout.promoCode")}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="font-semibold text-slate-900">{t("checkout.total", { n: totalQty })}</span>
              <span className="text-xl font-bold text-brand">{total.toFixed(2)}€</span>
            </div>
          </section>

          {/* Informations acheteur */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-slate-900">{t("checkout.yourInfo")}</h2>
            <p className="text-sm text-slate-600">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="mt-2 text-xs text-slate-400">{t("checkout.emailNote")}</p>
          </section>
        </div>

        {/* Protection des données & paiement */}
        <div className="space-y-4">
          <section className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 text-base font-semibold text-slate-900">{t("checkout.paymentTitle")}</h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {t("checkout.bullet1")}
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {t("checkout.bullet2")}
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {t("checkout.bullet3")}
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {t("checkout.bullet4")}
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {t("checkout.bullet5")}
              </li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <Link href="/cgv" className="underline hover:text-brand">{t("footer.cgv")}</Link>
              <Link href="/confidentialite" className="underline hover:text-brand">{t("footer.privacy")}</Link>
            </div>

            <label className="mt-4 flex items-start gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5"
              />
              {t("checkout.acceptTerms")}
            </label>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              onClick={handleConfirm}
              disabled={!accepted || submitting}
              className="mt-4 w-full rounded-lg bg-brand py-2.5 font-medium text-white transition hover:scale-[1.01] hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting ? t("checkout.redirecting") : t("checkout.submit", { total: total.toFixed(2) })}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
      <CheckoutContent />
    </Suspense>
  );
}
