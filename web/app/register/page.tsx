"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, setSession } from "../../lib/api";

const ROLES = [
  {
    value: "BUYER",
    title: "Je suis acheteur",
    tagline: "Je veux réserver des billets",
    points: ["Achetez vos billets en quelques clics", "Retrouvez vos e-billets à tout moment", "Recevez votre QR code d'entrée"],
  },
  {
    value: "ORGANIZER",
    title: "Je suis organisateur",
    tagline: "Je veux vendre des billets",
    points: ["Créez concerts et soirées en quelques minutes", "Suivez vos ventes et votre trésorerie en direct", "Scannez les billets à l'entrée"],
  },
] as const;

function RegisterForm() {
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

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">Créer un compte</h1>
      <p className="mb-6 text-sm text-slate-500">
        {redirect
          ? "Créez votre compte pour finaliser votre achat — vos billets sélectionnés vous attendent."
          : "Commencez par choisir le profil qui vous correspond."}
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
          Inscription en tant que {selectedRole.title.replace("Je suis ", "")}
        </div>

        <input
          required
          placeholder="Nom"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Mot de passe (8 caractères min.)"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        {form.role === "ORGANIZER" && (
          <input
            placeholder="Nom de votre organisation"
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
          {loading ? "Création…" : `Créer mon compte ${selectedRole.title.replace("Je suis ", "")}`}
        </button>
      </form>

      <p className="mx-auto mt-4 max-w-sm text-center text-sm text-slate-500">
        Déjà un compte ?{" "}
        <Link href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"} className="text-brand">
          Se connecter
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
