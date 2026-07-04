"use client";

import { useRef, useState } from "react";

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const isUpload = value.startsWith("data:");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image (JPG, PNG...).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image trop lourde (4 Mo maximum).");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {!isUpload && (
          <input
            placeholder="URL d'une photo/affiche (optionnel) — ex: https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-w-[200px] flex-1 rounded-lg border px-3 py-2"
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="whitespace-nowrap rounded-lg border border-brand px-3 py-2 text-sm font-medium text-brand transition hover:bg-brand/5"
        >
          📁 Choisir une photo depuis mon ordinateur
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {value && (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-14 w-14 rounded-lg border object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Retirer la photo
          </button>
        </div>
      )}

      <p className="mt-1 text-xs text-slate-400">
        Collez le lien d'une image, ou importez directement une photo depuis votre ordinateur (JPG/PNG, 4 Mo max).
      </p>
    </div>
  );
}
