"use client";

import { useRef, useState } from "react";

const MAX_DIMENSION = 1600; // px, côté le plus long
const JPEG_QUALITY = 0.92;

/** Redimensionne et recompresse proprement l'image (meilleure netteté qu'un encodage brut). */
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image invalide."));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width >= height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Impossible de traiter l'image."));
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const isUpload = value.startsWith("data:");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Merci de choisir un fichier image (JPG, PNG...).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image trop lourde (8 Mo maximum).");
      return;
    }
    setError("");
    setProcessing(true);
    try {
      const resized = await resizeImage(file);
      onChange(resized);
    } catch (err: any) {
      setError(err.message || "Impossible de traiter cette image.");
    } finally {
      setProcessing(false);
    }
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
          disabled={processing}
          onClick={() => inputRef.current?.click()}
          className="whitespace-nowrap rounded-lg border border-brand px-3 py-2 text-sm font-medium text-brand transition hover:bg-brand/5 disabled:opacity-50"
        >
          {processing ? "Optimisation…" : "📁 Choisir une photo depuis mon ordinateur"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {value && (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-20 w-20 rounded-lg border object-cover object-[center_20%]"
          />
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
        Collez le lien d'une image, ou importez directement une photo depuis votre ordinateur. Elle est automatiquement
        recadrée en haute qualité (jusqu'à {MAX_DIMENSION}px) pour bien s'afficher sur les cartes.
      </p>
    </div>
  );
}
