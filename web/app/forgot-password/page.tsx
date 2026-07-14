"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { useT } from "../../lib/i18n/LanguageContext";

export default function ForgotPasswordPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/auth/forgot-password", { method: "POST", body: { email }, auth: false });
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-2xl font-bold">{t("forgotPassword.title")}</h1>
      <p className="mb-6 text-sm text-slate-500">{t("forgotPassword.subtitle")}</p>

      {sent ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {t("forgotPassword.success")}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder={t("forgotPassword.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-brand py-2 text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? t("forgotPassword.submitting") : t("forgotPassword.submit")}
          </button>
        </form>
      )}

      <p className="mt-4 text-sm text-slate-500">
        <Link href="/login" className="text-brand">
          {t("forgotPassword.backToLogin")}
        </Link>
      </p>
    </div>
  );
}
