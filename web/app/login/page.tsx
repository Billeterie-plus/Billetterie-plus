"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, setSession } from "../../lib/api";
import Link from "next/link";
import { useT } from "../../lib/i18n/LanguageContext";

function LoginForm() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api("/auth/login", { method: "POST", body: { email, password }, auth: false });
      setSession(res.token, res.user);
      router.push(redirect || (res.user.role === "ORGANIZER" ? "/organizer" : "/"));
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-2xl font-bold">{t("login.title")}</h1>
      {redirect && <p className="mb-5 text-sm text-slate-500">{t("login.redirectHint")}</p>}
      {!redirect && <div className="mb-6" />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder={t("login.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder={t("login.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-brand py-2 text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? t("login.submitting") : t("login.submit")}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        {t("login.noAccount")}{" "}
        <Link href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"} className="text-brand">
          {t("login.createAccount")}
        </Link>
      </p>
      <p className="mt-2 text-xs text-slate-400">{t("login.demo")}</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
      <LoginForm />
    </Suspense>
  );
}
