"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import ImageUploadField from "../../../../components/ImageUploadField";

const EMPTY_TIER = { name: "", price: 0, quota: 100, seated: false };

const TYPE_OPTIONS = [
  { value: "CONCERT", label: "Concert", emoji: "🎵" },
  { value: "SOIREE", label: "Soirée tamoule", emoji: "🎉" },
];

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "CONCERT",
    imageUrl: "",
    venue: "",
    startDateTime: "",
  });
  const [tiers, setTiers] = useState([{ ...EMPTY_TIER }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  function updateForm(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "imageUrl") setImageError(false);
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
          imageUrl: form.imageUrl || undefined,
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

  const selectedType = TYPE_OPTIONS.find((t) => t.value === form.type)!;
  const minPrice = tiers.length ? Math.min(...tiers.map((t) => Number(t.price) || 0)) : 0;
  const previewDate = form.startDateTime
    ? new Date(form.startDateTime).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Nouvel événement</h1>
      <p className="mb-6 text-sm text-slate-500">
        Concert d'artiste tamoul ou soirée tamoule — remplissez le formulaire, l'aperçu à droite se met à jour en direct.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type d'événement en cartes visuelles */}
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">1. Type d'événement</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => updateForm("type", t.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
                    form.type === t.value ? "border-brand bg-brand/5 ring-2 ring-brand" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="text-xs font-medium text-slate-700">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Infos principales */}
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">2. Informations</h2>
            <div className="space-y-3">
              <input
                required
                placeholder="Titre de l'événement (ex: Anirudh Ravichander Live à Paris)"
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

              <ImageUploadField value={form.imageUrl} onChange={(v) => updateForm("imageUrl", v)} />

              <input
                required
                placeholder="Lieu (salle, club, stade...)"
                value={form.venue}
                onChange={(e) => updateForm("venue", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />

              <input
                required
                type="datetime-local"
                value={form.startDateTime}
                onChange={(e) => updateForm("startDateTime", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>

          {/* Tarifs */}
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">3. Tarifs / catégories de billets</h2>
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
              className="mt-2 text-sm text-brand hover:underline"
            >
              + Ajouter un tarif
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-brand py-2.5 text-white transition hover:scale-[1.01] hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Création…" : "Créer l'événement (brouillon)"}
          </button>
        </form>

        {/* Aperçu en direct */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="mb-2 font-semibold text-slate-800">Aperçu pour les acheteurs</h2>
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-brand to-brand-light text-white">
              {form.imageUrl && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-4xl">{selectedType.emoji}</span>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs font-medium text-brand">
                {selectedType.emoji} {selectedType.label}
              </div>
              <h3 className="mt-1 text-lg font-semibold">{form.title || "Titre de votre événement"}</h3>
              <p className="mt-1 text-sm text-slate-500">{form.venue || "Lieu de l'événement"}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">{previewDate || "Date à définir"}</span>
                <span className="font-semibold">
                  {tiers.length && tiers.some((t) => t.name) ? `à partir de ${minPrice}€` : "Prix à définir"}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            C'est exactement ainsi que la carte apparaîtra sur la page d'accueil et dans les listes d'événements une fois publié.
          </p>
        </div>
      </div>
    </div>
  );
}
