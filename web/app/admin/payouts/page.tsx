"use client";

import { useEffect, useState } from "react";
import { api, getUser } from "../../../lib/api";
import { useT } from "../../../lib/i18n/LanguageContext";

type Payout = {
  id: string;
  grossRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  status: "PENDING" | "PAID";
  paidAt: string | null;
  event: { id: string; title: string; type: string; startDateTime: string; endDateTime: string | null };
  organization: { name: string; owner: { name: string; email: string } };
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminPayoutsPage() {
  const t = useT();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [rateDrafts, setRateDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser<{ role: string }>();
    setAuthorized(user?.role === "ADMIN");
  }, []);

  function load() {
    setLoading(true);
    api("/admin/payouts")
      .then((res) => {
        setSummary(res.summary);
        setPayouts(res.payouts);
        setRateDrafts(Object.fromEntries(res.payouts.map((p: Payout) => [p.id, String(p.commissionRate)])));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (authorized) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  async function saveCommission(id: string) {
    const draft = rateDrafts[id];
    const rate = Number(draft);
    if (Number.isNaN(rate) || rate < 0 || rate > 100) return;
    setBusyId(id);
    try {
      const updated = await api(`/admin/payouts/${id}`, { method: "PATCH", body: { commissionRate: rate } });
      setPayouts((ps) => ps.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function markPaid(p: Payout) {
    const ok = window.confirm(
      t("admin.markPaidConfirm", { amount: p.netAmount.toFixed(2), name: p.organization.name })
    );
    if (!ok) return;
    setBusyId(p.id);
    try {
      const updated = await api(`/admin/payouts/${p.id}/mark-paid`, { method: "POST" });
      setPayouts((ps) => ps.map((x) => (x.id === p.id ? { ...x, ...updated } : x)));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  if (authorized === null) return null;
  if (!authorized) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
        {t("admin.accessDenied")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">{t("admin.payoutsTitle")}</h1>
      <p className="mb-6 max-w-2xl text-sm text-slate-500">{t("admin.payoutsSubtitle")}</p>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-slate-500">{t("common.loading")}</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label={t("admin.payoutsPendingCount")} value={summary.pendingCount} />
            <StatCard label={t("admin.payoutsPendingTotal")} value={`${summary.pendingNetTotal.toFixed(2)}€`} />
            <StatCard label={t("admin.payoutsPaidTotal")} value={`${summary.paidNetTotal.toFixed(2)}€`} />
            <StatCard label={t("admin.payoutsCommissionEarned")} value={`${summary.commissionEarnedTotal.toFixed(2)}€`} />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">{t("admin.colEvent")}</th>
                  <th className="px-4 py-3">{t("admin.colOrganizer")}</th>
                  <th className="px-4 py-3">{t("admin.colEndDate")}</th>
                  <th className="px-4 py-3 text-right">{t("admin.colGross")}</th>
                  <th className="px-4 py-3 text-right">{t("admin.colCommissionRate")}</th>
                  <th className="px-4 py-3 text-right">{t("admin.colCommission")}</th>
                  <th className="px-4 py-3 text-right">{t("admin.colNet")}</th>
                  <th className="px-4 py-3">{t("admin.colStatus")}</th>
                  <th className="px-4 py-3">{t("admin.colAction")}</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => {
                  const isPending = p.status === "PENDING";
                  const rateChanged = rateDrafts[p.id] !== undefined && Number(rateDrafts[p.id]) !== p.commissionRate;
                  const endDate = p.event.endDateTime || p.event.startDateTime;
                  return (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-medium text-slate-900">{p.event.title}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {p.organization.name}
                        <div className="text-xs text-slate-400">{p.organization.owner.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(endDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">{p.grossRevenue.toFixed(2)}€</td>
                      <td className="px-4 py-3 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="0.1"
                              value={rateDrafts[p.id] ?? ""}
                              onChange={(e) => setRateDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                              className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm"
                            />
                            <span className="text-slate-400">%</span>
                            {rateChanged && (
                              <button
                                onClick={() => saveCommission(p.id)}
                                disabled={busyId === p.id}
                                className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand transition hover:bg-brand/20 disabled:opacity-50"
                              >
                                {t("admin.saveCommission")}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">{p.commissionRate}%</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">{p.commissionAmount.toFixed(2)}€</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{p.netAmount.toFixed(2)}€</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {p.status === "PAID" ? t("admin.payoutStatusPaid") : t("admin.payoutStatusPending")}
                        </span>
                        {p.status === "PAID" && p.paidAt && (
                          <div className="mt-1 text-[11px] text-slate-400">
                            {t("admin.paidOn", {
                              date: new Date(p.paidAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isPending ? (
                          <button
                            onClick={() => markPaid(p)}
                            disabled={busyId === p.id}
                            className="whitespace-nowrap rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-dark disabled:opacity-50"
                          >
                            {t("admin.markPaid")}
                          </button>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {payouts.length === 0 && <p className="p-6 text-center text-sm text-slate-400">{t("admin.noPayouts")}</p>}
          </div>
        </>
      )}
    </div>
  );
}
