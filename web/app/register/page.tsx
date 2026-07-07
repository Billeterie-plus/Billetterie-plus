"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, setSession } from "../../lib/api";
import { useT } from "../../lib/i18n/LanguageContext";

function RegisterForm() {
  const t = useT();
  const ROLES = [
    {
      value: "BUYER",
      title: t("register.buyerTitle"),
      tagline: t("register.buyerTagline"),
      points: [t("register.buyerPoint1"), t("register.buyerPoint2"), t("register.buyerPoint3")],
    },
    {
      value: "ORGANIZER",
      title: t("register.organizerTitle"),
      tagline: t("register.organizerTagline"),
      points: [t("register.organizerPoint1"), t("register.organizerPoint2"), t("register.organizerPoint3")],
    },
  ] as const;
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUYER" as string, organizationName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api("/auth/register", { method: "POST", body: form, auth: false });
      setSession(res.token, res.user);
      router.push(redirect || (res.user.role === "ORGANIZER" ? "/organizer" : "/"));
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedRole = ROLES.find((r) => r.value === form.role)!;
  const roleShort = form.role === "ORGANIZER" ? t("register.roleShortOrganizer") : t("register.roleShortBuyer");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">{t("register.title")}</h1>
      <p className="mb-6 text-sm text-slate-500">
        {redirect ? t("register.redirectHint") : t("register.chooseProfile")}
      </p>

      {/* Choix du profil : deux interfaces distinctes */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLES.map((r) => {
          const active = form.role === r.value;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => update("role", r.value)}
              className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                active ? "border-brand bg-brand/5 ring-2 ring-brand" : "border-slate-200 bg-white"
              }`}
            >
              <p className="font-semibold text-slate-900">{r.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{r.tagline}</p>
              <ul className="mt-3 space-y-1.5">
                {r.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className={active ? "text-brand" : "text-slate-300"}>•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
        <div className="rounded-lg bg-brand/5 px-3 py-2 text-xs font-medium text-brand">
          {t("register.registeringAs", { role: roleShort })}
        </div>

        <input
          required
          placeholder={t("register.name")}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="email"
          required
          placeholder={t("register.email")}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder={t("register.password")}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        {form.role === "ORGANIZER" && (
          <input
            placeholder={t("register.orgName")}
            value={form.organizationName}
            onChange={(e) => update("organizationName", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-brand py-2.5 font-medium text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? t("common.creating") : t("register.submit", { role: roleShort })}
        </button>
      </form>

      <p className="mx-auto mt-4 max-w-sm text-center text-sm text-slate-500">
        {t("register.alreadyAccount")}{" "}
        <Link href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"} className="text-brand">
          {t("register.login")}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
      <RegisterForm />
    </Suspense>
  );
}
