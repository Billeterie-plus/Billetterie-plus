"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, getToken } from "../../lib/api";

function MyTicketsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const success = searchParams.get("success") === "true";

  const [tickets, setTickets] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(success);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    // Une commande vient d'être payée : on nettoie le panier temporaire et on
    // attend la confirmation (le webhook Stripe peut arriver avec un léger délai).
    if (success && orderId) {
      sessionStorage.removeItem("checkoutDraft");
      sessionStorage.removeItem("pendingPurchase");
      pollOrder(orderId);
    } else {
      loadTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function pollOrder(id: string, attempt = 0) {
    try {
      const o = await api(`/orders/${id}`);
      setOrder(o);
      if (o.status === "PAID" || attempt >= 6) {
        setConfirming(false);
        await loadTickets();
      } else {
        setTimeout(() => pollOrder(id, attempt + 1), 1500);
      }
    } catch (e: any) {
      setConfirming(false);
      await loadTickets();
    }
  }

  async function loadTickets() {
    setLoading(true);
    try {
      const data = await api("/tickets/mine");
      setTickets(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="mx-auto max-w-md rounded-xl border bg-white p-8 text-center">
        <p className="font-medium text-slate-900">Confirmation de votre paiement…</p>
        <p className="mt-2 text-sm text-slate-500">
          Merci de patienter quelques secondes, nous finalisons votre commande.
        </p>
      </div>
    );
  }

  if (loading) return <p className="text-slate-500">Chargement…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {success && order && (
        <div className="mb-6 rounded-xl bg-green-50 p-5 text-green-800">
          <p className="font-semibold">Paiement confirmé — merci pour votre achat !</p>
          <p className="mt-1 text-sm">
            Commande #{order.id.slice(0, 8)} — {order.event?.title} — {order.totalAmount.toFixed(2)}€. Vos e-billets
            sont prêts ci-dessous et ont également été envoyés par email.
          </p>
        </div>
      )}

      <h1 className="mb-6 text-2xl font-bold">Mes billets</h1>
      {tickets.length === 0 ? (
        <p className="text-slate-500">Vous n'avez pas encore de billet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
              <img src={t.qrDataUrl} alt="QR code" className="h-28 w-28 rounded" />
              <div>
                <p className="font-semibold">{t.event.title}</p>
                <p className="text-sm text-slate-500">{t.ticketType.name}</p>
                {t.seatInfo && <p className="text-sm text-slate-500">{t.seatInfo}</p>}
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(t.event.startDateTime).toLocaleString("fr-FR")}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    t.status === "VALID"
                      ? "bg-green-100 text-green-700"
                      : t.status === "USED"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t.status === "VALID" ? "Valide" : t.status === "USED" ? "Scanné" : "Annulé"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyTicketsPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
      <MyTicketsContent />
    </Suspense>
  );
}
