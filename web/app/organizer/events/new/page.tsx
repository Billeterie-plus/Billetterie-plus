"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import ImageUploadField from "../../../../components/ImageUploadField";
import { useT } from "../../../../lib/i18n/LanguageContext";

const EMPTY_TIER = { name: "", price: 0, quota: 100, seated: false };

export default function NewEventPage() {
  const t = useT();
  const router = useRouter();
  const TYPE_OPTIONS = [
    { value: "CONCERT", label: t("event.type.CONCERT"), emoji: "🎵" },
    { value: "SOIREE", label: t("event.type.SOIREE"), emoji: "🎉" },
    { value: "FILM", label: t("event.type.FILM"), emoji: "🎬" },
  ];
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "CONCERT",
    imageUrl: "",
    venue: "",
    startDateTime: "",
    transportInfo: "",
    parkingInfo: "",
    parkingFree: "",
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
    setTiers((ts) => ts.map((tier, idx) => (idx === i ? { ...tier, [key]: value } : tier)));
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
          transportInfo: form.transportInfo || undefined,
          parkingInfo: form.parkingInfo || undefined,
          parkingFree: form.parkingFree === "" ? undefined : form.parkingFree === "true",
          startDateTime: new Date(form.startDateTime).toISOString(),
          ticketTypes: tiers.map((tier) => ({ ...tier, price: Number(tier.price), quota: Number(tier.quota) })),
        },
      });
      router.push(`/organizer/events/${event.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedType = TYPE_OPTIONS.find((opt) => opt.value === form.type)!;
  const minPrice = tiers.length ? Math.min(...tiers.map((tier) => Number(tier.price) || 0)) : 0;
  const previewDate = form.startDateTime
    ? new Date(form.startDateTime).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">{t("organizerForm.newTitle")}</h1>
      <p className="mb-6 text-sm text-slate-500">{t("organizerForm.newSubtitle")}</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type d'événement en cartes visuelles */}
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">{t("organizerForm.step1Type")}</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateForm("type", opt.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
                    form.type === opt.value ? "border-brand bg-brand/5 ring-2 ring-brand" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs font-medium text-slate-700">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Infos principales */}
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">{t("organizerForm.step2Info")}</h2>
            <div className="space-y-3">
              <input
                required
                placeholder={t("organizerForm.titlePlaceholder")}
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
              <textarea
                placeholder={t("organizerForm.descriptionPlaceholder")}
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />

              <ImageUploadField value={form.imageUrl} onChange={(v) => updateForm("imageUrl", v)} />

              <input
                required
                placeholder={t("organizerForm.venuePlaceholder")}
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

          {/* Infos pratiques : transport / parking */}
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">{t("organizerForm.step3Practical")}</h2>
            <p className="mb-2 text-xs text-slate-400">{t("organizerForm.practicalHint")}</p>
            <div className="space-y-3">
              <input
                placeholder={t("organizerForm.transportPlaceholder")}
                value={form.transportInfo}
                onChange={(e) => updateForm("transportInfo", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
              <input
                placeholder={t("organizerForm.parkingPlaceholder")}
                value={form.parkingInfo}
                onChange={(e) => updateForm("parkingInfo", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
              <select
                value={form.parkingFree}
                onChange={(e) => updateForm("parkingFree", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">{t("organizerForm.parkingUnspecified")}</option>
                <option value="true">{t("organizerForm.parkingFree")}</option>
                <option value="false">{t("organizerForm.parkingPaid")}</option>
              </select>
            </div>
          </div>

          {/* Tarifs */}
          <div>
            <h2 className="mb-2 font-semibold text-slate-800">{t("organizerForm.step4Tiers")}</h2>
            <div className="space-y-2">
              {tiers.map((tier, i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  <input
                    required
                    placeholder={t("organizerForm.tierNamePlaceholder")}
                    value={tier.name}
                    onChange={(e) => updateTier(i, "name", e.target.value)}
                    className="col-span-2 rounded-lg border px-3 py-2"
                  />
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder={t("organizerForm.tierPricePlaceholder")}
                    value={tier.price}
                    onChange={(e) => updateTier(i, "price", e.target.value)}
                    className="rounded-lg border px-3 py-2"
                  />
                  <input
                    required
                    type="number"
                    min={1}
                    placeholder={t("organizerForm.tierQuotaPlaceholder")}
                    value={tier.quota}
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
              {t("organizerForm.addTier")}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-brand py-2.5 text-white transition hover:scale-[1.01] hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? t("common.creating") : t("organizerForm.createDraft")}
          </button>
        </form>

        {/* Aperçu en direct */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="mb-2 font-semibold text-slate-800">{t("organizerForm.preview")}</h2>
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand to-brand-light text-white">
              {form.imageUrl && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt=""
                  className="h-full w-full object-cover object-[center_20%]"
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
              <h3 className="mt-1 text-lg font-semibold">{form.title || t("organizerForm.eventTitlePreview")}</h3>
              <p className="mt-1 text-sm text-slate-500">{form.venue || t("organizerForm.venuePreview")}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">{previewDate || t("organizerForm.dateUndefined")}</span>
                <span className="font-semibold">
                  {tiers.length && tiers.some((tier) => tier.name) ? t("event.from", { price: minPrice }) : t("organizerForm.priceUndefined")}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{t("organizerForm.previewHint")}</p>
        </div>
      </div>
    </div>
  );
}
