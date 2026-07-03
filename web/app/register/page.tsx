"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setSession } from "../../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUYER", organizationName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      <h1 className="mb-6 text-2xl font-bold">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.role === "BUYER"}
              onChange={() => update("role", "BUYER")}
            />
            Acheteur
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.role === "ORGANIZER"}
              onChange={() => update("role", "ORGANIZER")}
            />
            Organisateur
          </label>
        </div>

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
          className="w-full rounded-lg bg-brand py-2 text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}
