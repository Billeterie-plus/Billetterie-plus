"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";
import ImageUploadField from "../../../../../components/ImageUploadField";

const TYPE_OPTIONS = [
  { value: "CONCERT", label: "Concert", emoji: "🎵" },
  { value: "SOIREE", label: "Soirée tamoule", emoji: "🎉" },
];

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "PUBLISHED", label: "Publié" },
  { value: "CANCELLED", label: "Annulé" },
];

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<{
    title: string;
    description: string;
    type: string;
    imageUrl: string;
    venue: string;
    startDateTime: string;
    status: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    api("/organizer/events")
      .then((events: any[]) => {
        const event = events.find((e) => e.id === id);
        if (!event) {
          setError("Événement introuvable.");
          return;
        }
        setForm({
          title: event.title || "",
          description: event.description || "",
          type: event.type,
          imageUrl: event.imageUrl || "",
          venue: event.venue || "",
          startDateTime: toLocalInputValue(event.startDateTime),
          status: event.status,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingEvent(false));
  }, [id]);

  function updateForm(key: string, value: string) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    if (key === "imageUrl") setImageError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError("");
    setLoading(true);
    try {
      await api(`/organizer/events/${id}`, {
        method: "PATCH",
        body: {
          title: form.title,
          description: form.description,
          type: form.type,
          imageUrl: form.imageUrl || undefined,
          venue: form.venue,
          startDateTime: new Date(form.startDateTime).toISOString(),
          status: form.status,
        },
      });
      router.push("/organizer");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingEvent) return <p className="text-slate-500">Chargement…</p>;
  if (error && !form) return <p className="text-red-600">{error}</p>;
  if (!form) return null;

  const selectedType = TYPE_OPTIONS.find((t) => t.value === form.type) || TYPE_OPTIONS[0];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Modifier l'événement</h1>
      <p className="mb-6 text-sm text-slate-500">Mettez à jour les informations de votre concert ou soirée.</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">Type d'événement</h2>
            <div className="grid grid-cols-2 gap-2 sm:w-1/2">
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

          <div>
            <h2 className="mb-2 font-semibold text-slate-800">Informations</h2>
            <div className="space-y-3">
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

              <select
                value={form.status}
                onChange={(e) => updateForm("status", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Les tarifs et quotas ne se modifient pas depuis cette page pour l'instant.
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              disabled={loading}
              className="flex-1 rounded-lg bg-brand py-2.5 text-white transition hover:scale-[1.01] hover:bg-brand-dark disabled:opacity-50"
            >
              {loading ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/organizer")}
              className="rounded-lg border px-4 py-2.5 text-sm hover:bg-slate-50"
            >
              Annuler
            </button>
          </div>
        </form>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
