"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useT } from "../lib/i18n/LanguageContext";

const MAX_DIMENSION = 1000; // px, côté le plus long
const JPEG_QUALITY = 0.78;
// Taille max visée pour le texte base64 stocké en base (les images stockées en
// base64 directement dans Postgres surchargent la mémoire du backend si elles
// sont trop lourdes — on retente avec une qualité plus basse si besoin).
const MAX_OUTPUT_BYTES = 350 * 1024;

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

        // Compression progressive : si le résultat reste trop lourd, on baisse
        // la qualité par paliers plutôt que de stocker un fichier énorme.
        let quality = JPEG_QUALITY;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        let attempts = 0;
        while (dataUrl.length > MAX_OUTPUT_BYTES && quality > 0.4 && attempts < 5) {
          quality -= 0.12;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          attempts++;
        }
        resolve(dataUrl);
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
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const isUpload = value.startsWith("data:");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("imageUpload.wrongType"));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError(t("imageUpload.tooLarge"));
      return;
    }
    setError("");
    setProcessing(true);
    try {
      const resized = await resizeImage(file);
      onChange(resized);
    } catch (err: any) {
      setError(err.message || t("imageUpload.processingError"));
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {!isUpload && (
          <input
            placeholder={t("imageUpload.urlPlaceholder")}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-w-[200px] flex-1 rounded-lg border px-3 py-2"
          />
        )}
        <button
          type="button"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-brand px-3 py-2 text-sm font-medium text-brand transition hover:bg-brand/5 disabled:opacity-50"
        >
          {processing ? (
            t("imageUpload.optimizing")
          ) : (
            <>
              <Upload size={14} strokeWidth={2} /> {t("imageUpload.chooseFile")}
            </>
          )}
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
            {t("imageUpload.remove")}
          </button>
        </div>
      )}

      <p className="mt-1 text-xs text-slate-400">{t("imageUpload.hint", { size: String(MAX_DIMENSION) })}</p>
    </div>
  );
}
