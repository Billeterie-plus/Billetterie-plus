"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setSession } from "../../lib/api";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api("/auth/login", { method: "POST", body: { email, password }, auth: false });
      setSession(res.token, res.user);
      router.push(res.user.role === "ORGANIZER" ? "/organizer" : "/");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Connexion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-brand py-2 text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Pas de compte ? <Link href="/register" className="text-brand">Créer un compte</Link>
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Démo : organisateur@demo.com / password123 (organisateur) — client@demo.com / password123 (acheteur)
      </p>
    </div>
  );
}
