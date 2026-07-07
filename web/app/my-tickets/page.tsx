"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, getToken } from "../../lib/api";
import { useT } from "../../lib/i18n/LanguageContext";

function MyTicketsContent() {
  const t = useT();
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
        <p className="font-medium text-slate-900">{t("myTickets.confirming")}</p>
        <p className="mt-2 text-sm text-slate-500">{t("myTickets.confirmingHint")}</p>
      </div>
    );
  }

  if (loading) return <p className="text-slate-500">{t("common.loading")}</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {success && order && (
        <div className="mb-6 rounded-xl bg-green-50 p-5 text-green-800">
          <p className="font-semibold">{t("myTickets.paymentConfirmed")}</p>
          <p className="mt-1 text-sm">
            {t("myTickets.orderSummary", {
              id: order.id.slice(0, 8),
              event: order.event?.title,
              amount: order.totalAmount.toFixed(2),
            })}
          </p>
        </div>
      )}

      <h1 className="mb-6 text-2xl font-bold">{t("myTickets.title")}</h1>
      {tickets.length === 0 ? (
        <p className="text-slate-500">{t("myTickets.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tickets.map((tk) => (
            <div key={tk.id} className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
              <img src={tk.qrDataUrl} alt="QR code" className="h-28 w-28 rounded" />
              <div>
                <p className="font-semibold">{tk.event.title}</p>
                <p className="text-sm text-slate-500">{tk.ticketType.name}</p>
                {tk.seatInfo && <p className="text-sm text-slate-500">{tk.seatInfo}</p>}
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(tk.event.startDateTime).toLocaleString("fr-FR")}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    tk.status === "VALID"
                      ? "bg-green-100 text-green-700"
                      : tk.status === "USED"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {tk.status === "VALID" ? t("myTickets.valid") : tk.status === "USED" ? t("myTickets.used") : t("myTickets.cancelled")}
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
