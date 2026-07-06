"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "../../../lib/api";

const SCANNER_ELEMENT_ID = "qr-reader";

export default function ScanPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<any>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    setCameraError("");
    setCameraStarting(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          if (processingRef.current) return;
          processingRef.current = true;
          handleScan(decodedText).finally(() => {
            setTimeout(() => {
              processingRef.current = false;
            }, 1500);
          });
        },
        () => {
          /* ignore per-frame decode misses */
        }
      );
      setCameraActive(true);
    } catch (e: any) {
      setCameraError(
        "Impossible d'accéder à la caméra (autorisation refusée ou aucune caméra détectée). Utilisez la saisie manuelle ci-dessous."
      );
      setCameraActive(false);
    } finally {
      setCameraStarting(false);
    }
  }

  async function stopCamera() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // caméra déjà arrêtée / composant démonté
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  }

  async function handleScan(qrToken: string) {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await api("/organizer/scan", { method: "POST", body: { qrToken } });
      setResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await handleScan(token);
    setToken("");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-2xl font-bold">Scanner un billet</h1>
      <p className="mb-6 text-sm text-slate-500">
        Utilisez la caméra pour scanner le QR code à l'entrée, ou saisissez le code manuellement.
      </p>

      <div className="rounded-xl border bg-white p-4">
        {!cameraActive ? (
          <button
            onClick={startCamera}
            disabled={cameraStarting}
            className="w-full rounded-lg bg-brand py-2.5 font-medium text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            {cameraStarting ? "Activation…" : "Activer la caméra"}
          </button>
        ) : (
          <button onClick={stopCamera} className="w-full rounded-lg border py-2 text-sm font-medium hover:bg-slate-50">
            Arrêter la caméra
          </button>
        )}

        <div id={SCANNER_ELEMENT_ID} className={cameraActive ? "mt-3 overflow-hidden rounded-lg" : "hidden"} />

        {cameraActive && (
          <p className="mt-2 text-center text-xs text-slate-400">Placez le QR code du billet dans le cadre.</p>
        )}
        {cameraError && <p className="mt-2 text-xs text-red-600">{cameraError}</p>}
      </div>

      <form onSubmit={handleManualSubmit} className="mt-4 space-y-2">
        <p className="text-xs font-medium text-slate-500">Ou saisie manuelle</p>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Coller le code du billet (TKT-...)"
          className="w-full rounded-lg border px-3 py-2"
        />
        <button
          disabled={loading}
          className="w-full rounded-lg border py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Vérification…" : "Valider manuellement"}
        </button>
      </form>

      {result && (
        <div className={`mt-4 rounded-lg p-4 ${result.valid ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-800"}`}>
          {result.valid ? (
            <>
              <p className="font-semibold">Billet valide</p>
              <p className="text-sm">
                {result.ticket.event} — {result.ticket.tier}
              </p>
              <p className="text-sm">Titulaire : {result.ticket.owner}</p>
            </>
          ) : (
            <p className="font-semibold">{result.reason}</p>
          )}
        </div>
      )}
      {error && !result && <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
    </div>
  );
}
