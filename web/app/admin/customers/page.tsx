"use client";

import { useEffect, useMemo, useState } from "react";
import { api, getUser } from "../../../lib/api";
import { useT } from "../../../lib/i18n/LanguageContext";

type Customer = {
  id: string;
  name: string;
  email: string;
  role: "BUYER" | "ORGANIZER";
  createdAt: string;
  ticketCount: number;
  orderCount: number;
  totalSpent: number;
  lastPurchaseAt: string | null;
};

type SortKey = "name" | "createdAt" | "ticketCount" | "totalSpent";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminCustomersPage() {
  const t = useT();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalSpent");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const user = getUser<{ role: string }>();
    setAuthorized(user?.role === "ADMIN");
  }, []);

  useEffect(() => {
    if (!authorized) return;
    api("/admin/customers")
      .then((res) => {
        setSummary(res.summary);
        setCustomers(res.customers);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [authorized]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = q
      ? customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      : customers;
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortKey === "ticketCount") cmp = a.ticketCount - b.ticketCount;
      else cmp = a.totalSpent - b.totalSpent;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [customers, search, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
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
      <h1 className="mb-1 text-2xl font-bold text-slate-900">{t("admin.customersTitle")}</h1>
      <p className="mb-6 text-sm text-slate-500">{t("admin.customersSubtitle")}</p>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-slate-500">{t("common.loading")}</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label={t("admin.totalAccounts")} value={summary.totalAccounts} />
            <StatCard label={t("admin.activeBuyers")} value={summary.totalBuyersWithPurchase} />
            <StatCard label={t("admin.totalTickets")} value={summary.totalTickets} />
            <StatCard label={t("admin.totalRevenue")} value={`${summary.totalRevenue.toFixed(2)}€`} />
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.searchPlaceholder")}
            className="mb-4 w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort("name")}>
                    {t("admin.colName")}
                  </th>
                  <th className="px-4 py-3">{t("admin.colEmail")}</th>
                  <th className="px-4 py-3">{t("admin.colRole")}</th>
                  <th className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort("createdAt")}>
                    {t("admin.colJoined")}
                  </th>
                  <th className="cursor-pointer select-none px-4 py-3 text-right" onClick={() => toggleSort("ticketCount")}>
                    {t("admin.colTickets")}
                  </th>
                  <th className="px-4 py-3 text-right">{t("admin.colOrders")}</th>
                  <th className="cursor-pointer select-none px-4 py-3 text-right" onClick={() => toggleSort("totalSpent")}>
                    {t("admin.colSpent")}
                  </th>
                  <th className="px-4 py-3">{t("admin.colLastPurchase")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.role === "ORGANIZER" ? "bg-gold/10 text-gold-dark" : "bg-brand/10 text-brand"
                        }`}
                      >
                        {c.role === "ORGANIZER" ? t("admin.roleOrganizer") : t("admin.roleBuyer")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{c.ticketCount}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{c.orderCount}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{c.totalSpent.toFixed(2)}€</td>
                    <td className="px-4 py-3 text-slate-500">
                      {c.lastPurchaseAt
                        ? new Date(c.lastPurchaseAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                        : t("admin.never")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="p-6 text-center text-sm text-slate-400">{t("admin.noResults")}</p>}
          </div>
        </>
      )}
    </div>
  );
}
