"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import ImageUploadField from "../../../../components/ImageUploadField";
import { useT } from "../../../../lib/i18n/LanguageContext";

const EMPTY_TIER = { name: "", price: 0, quota: 100, seated: false };

const SECTION_CARD = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition sm:p-6";
const FIELD =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15";

function SectionHeader({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-lg">
        {icon}
      </span>
      <div>
        <h2 className="font-semibold text-slate-800">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

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

  function removeTier(i: number) {
    setTiers((ts) => ts.filter((_, idx) => idx !== i));
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

  const PARKING_OPTIONS = [
    { value: "", label: t("organizerForm.parkingOptionUnspecified") },
    { value: "true", label: t("organizerForm.parkingOptionFree") },
    { value: "false", label: t("organizerForm.parkingOptionPaid") },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* En-tête */}
      <div className="mb-6 flex items-center gap-4 animate-fadeInUp">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light text-2xl text-white shadow-md">
          ✨
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("organizerForm.newTitle")}</h1>
          <p className="text-sm text-slate-500">{t("organizerForm.newSubtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type d'événement en cartes visuelles */}
          <div className={SECTION_CARD + " animate-fadeInUp"} style={{ animationDelay: "0.05s" }}>
            <SectionHeader icon="🎭" title={t("organizerForm.step1Type")} />
            <div className="grid grid-cols-3 gap-3">
              {TYPE_OPTIONS.map((opt) => {
                const active = form.type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateForm("type", opt.value)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-2xl border p-4 text-center transition duration-200 hover:-translate-y-0.5 ${
                      active
                        ? "border-transparent bg-gradient-to-br from-brand to-brand-light text-white shadow-lg shadow-brand/25"
                        : "border-slate-200 bg-slate-50/60 text-slate-700 hover:border-brand/30 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    {active && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand">
                        ✓
                      </span>
                    )}
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Infos principales */}
          <div className={SECTION_CARD + " animate-fadeInUp"} style={{ animationDelay: "0.1s" }}>
            <SectionHeader icon="📝" title={t("organizerForm.step2Info")} />
            <div className="space-y-3">
              <input
                required
                placeholder={t("organizerForm.titlePlaceholder")}
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                className={FIELD}
              />
              <textarea
                placeholder={t("organizerForm.descriptionPlaceholder")}
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                rows={3}
                className={FIELD + " resize-y"}
              />

              <ImageUploadField value={form.imageUrl} onChange={(v) => updateForm("imageUrl", v)} />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder={t("organizerForm.venuePlaceholder")}
                  value={form.venue}
                  onChange={(e) => updateForm("venue", e.target.value)}
                  className={FIELD}
                />
                <input
                  required
                  type="datetime-local"
                  value={form.startDateTime}
                  onChange={(e) => updateForm("startDateTime", e.target.value)}
                  className={FIELD}
                />
              </div>
            </div>
          </div>

          {/* Infos pratiques : transport / parking */}
          <div className={SECTION_CARD + " animate-fadeInUp"} style={{ animationDelay: "0.15s" }}>
            <SectionHeader icon="🚗" title={t("organizerForm.step3Practical")} hint={t("organizerForm.practicalHint")} />
            <div className="space-y-3">
              <input
                placeholder={t("organizerForm.transportPlaceholder")}
                value={form.transportInfo}
                onChange={(e) => updateForm("transportInfo", e.target.value)}
                className={FIELD}
              />
              <input
                placeholder={t("organizerForm.parkingPlaceholder")}
                value={form.parkingInfo}
                onChange={(e) => updateForm("parkingInfo", e.target.value)}
                className={FIELD}
              />
              <div className="flex flex-wrap gap-2">
                {PARKING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateForm("parkingFree", opt.value)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      form.parkingFree === opt.value
                        ? "bg-brand text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tarifs */}
          <div className={SECTION_CARD + " animate-fadeInUp"} style={{ animationDelay: "0.2s" }}>
            <SectionHeader icon="🎟️" title={t("organizerForm.step4Tiers")} />
            <div className="space-y-2.5">
              {tiers.map((tier, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <input
                      required
                      placeholder={t("organizerForm.tierNamePlaceholder")}
                      value={tier.name}
                      onChange={(e) => updateTier(i, "name", e.target.value)}
                      className={FIELD + " col-span-2 bg-white"}
                    />
                    <input
                      required
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder={t("organizerForm.tierPricePlaceholder")}
                      value={tier.price}
                      onChange={(e) => updateTier(i, "price", e.target.value)}
                      className={FIELD + " bg-white"}
                    />
                    <input
                      required
                      type="number"
                      min={1}
                      placeholder={t("organizerForm.tierQuotaPlaceholder")}
                      value={tier.quota}
                      onChange={(e) => updateTier(i, "quota", e.target.value)}
                      className={FIELD + " bg-white"}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-500">
                      <span
                        onClick={() => updateTier(i, "seated", !tier.seated)}
                        className={`relative h-5 w-9 rounded-full transition ${tier.seated ? "bg-brand" : "bg-slate-300"}`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                            tier.seated ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </span>
                      {t("organizerForm.seatedLabel")}
                    </label>
                    {tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTier(i)}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        {t("organizerForm.removeTier")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTiers((ts) => [...ts, { ...EMPTY_TIER }])}
              className="mt-3 w-full rounded-xl border border-dashed border-brand/40 py-2 text-sm font-medium text-brand transition hover:border-brand hover:bg-brand/5"
            >
              {t("organizerForm.addTier")}
            </button>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-light py-3 font-medium text-white shadow-md shadow-brand/25 transition hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {loading ? t("common.creating") : t("organizerForm.createDraft")}
          </button>
        </form>

        {/* Aperçu en direct */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-semibold text-slate-800">{t("organizerForm.preview")}</h2>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:shadow-lg">
            <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-brand via-brand-light to-brand-dark">
              {form.imageUrl && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt=""
                  className="h-full w-full object-cover object-[center_20%]"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-5xl drop-shadow-sm">{selectedType.emoji}</span>
              )}
            </div>
            <div className="p-4">
              <div className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                {selectedType.emoji} {selectedType.label}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {form.title || t("organizerForm.eventTitlePreview")}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                📍 {form.venue || t("organizerForm.venuePreview")}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="text-slate-500">{previewDate || t("organizerForm.dateUndefined")}</span>
                <span className="font-semibold text-slate-900">
                  {tiers.length && tiers.some((tier) => tier.name) ? t("event.from", { price: minPrice }) : t("organizerForm.priceUndefined")}
                </span>
              </div>

              {(form.transportInfo || form.parkingInfo) && (
                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  {form.transportInfo && <p>🚇 {form.transportInfo}</p>}
                  {form.parkingInfo && <p>🅿️ {form.parkingInfo}</p>}
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{t("organizerForm.previewHint")}</p>
        </div>
      </div>
    </div>
  );
}
