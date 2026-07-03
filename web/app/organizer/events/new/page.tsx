"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

const EMPTY_TIER = { name: "", price: 0, quota: 100, seated: false };

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "CONCERT",
    venue: "",
    departureStation: "",
    arrivalStation: "",
    startDateTime: "",
  });
  const [tiers, setTiers] = useState([{ ...EMPTY_TIER }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateForm(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateTier(i: number, key: string, value: any) {
    setTiers((ts) => ts.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const event = await api("/organizer/events", {
        method: "POST",
        body: {
          ...form,
          startDateTime: new Date(form.startDateTime).toISOString(),
          ticketTypes: tiers.map((t) => ({ ...t, price: Number(t.price), quota: Number(t.quota) })),
        },
      });
      router.push(`/organizer/events/${event.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const isTrain = form.type === "TRAIN";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Nouvel événement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Titre de l'événement"
          value={form.title}
          onChange={(e) => updateForm("title", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => updateForm("description", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <select
          value={form.type}
          onChange={(e) => updateForm("type", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="CONCERT">Concert</option>
          <option value="TRAIN">Train</option>
          <option value="SPORT">Sport</option>
          <option value="THEATRE">Théâtre</option>
          <option value="OTHER">Autre</option>
        </select>

        {isTrain ? (
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Gare de départ"
              value={form.departureStation}
              onChange={(e) => updateForm("departureStation", e.target.value)}
              className="rounded-lg border px-3 py-2"
            />
            <input
              required
              placeholder="Gare d'arrivée"
              value={form.arrivalStation}
              onChange={(e) => updateForm("arrivalStation", e.target.value)}
              className="rounded-lg border px-3 py-2"
            />
          </div>
        ) : (
          <input
            required
            placeholder="Lieu (salle, stade...)"
            value={form.venue}
            onChange={(e) => updateForm("venue", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        )}

        <input
          required
          type="datetime-local"
          value={form.startDateTime}
          onChange={(e) => updateForm("startDateTime", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <div>
          <h2 className="mb-2 font-semibold">Tarifs / catégories de billets</h2>
          <div className="space-y-2">
            {tiers.map((t, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <input
                  required
                  placeholder="Nom (ex: Fosse, 1ère classe)"
                  value={t.name}
                  onChange={(e) => updateTier(i, "name", e.target.value)}
                  className="col-span-2 rounded-lg border px-3 py-2"
                />
                <input
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Prix €"
                  value={t.price}
                  onChange={(e) => updateTier(i, "price", e.target.value)}
                  className="rounded-lg border px-3 py-2"
                />
                <input
                  required
                  type="number"
                  min={1}
                  placeholder="Quota"
                  value={t.quota}
                  onChange={(e) => updateTier(i, "quota", e.target.value)}
                  className="rounded-lg border px-3 py-2"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTiers((ts) => [...ts, { ...EMPTY_TIER }])}
            className="mt-2 text-sm text-brand"
          >
            + Ajouter un tarif
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-brand py-2.5 text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? "Création…" : "Créer l'événement (brouillon)"}
        </button>
      </form>
    </div>
  );
}
