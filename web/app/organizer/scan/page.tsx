"use client";

import { useState } from "react";
import { api } from "../../../lib/api";

// Note: for a real camera-based scanner, wire this input to a library like
// `html5-qrcode` or `@zxing/browser` and feed the decoded text into handleScan.
// The manual input below lets you test the full validate flow without a camera.
export default function ScanPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await api("/organizer/scan", { method: "POST", body: { qrToken: token } });
      setResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setToken("");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Scanner un billet</h1>
      <form onSubmit={handleScan} className="space-y-3">
        <input
          autoFocus
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Coller / scanner le code du billet (TKT-...)"
          className="w-full rounded-lg border px-3 py-2"
        />
        <button disabled={loading} className="w-full rounded-lg bg-brand py-2.5 text-white hover:bg-brand-dark">
          {loading ? "Vérification…" : "Valider"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}
      {result && (
        <div className={`mt-4 rounded-lg p-4 ${result.valid ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-800"}`}>
          {result.valid ? (
            <>
              <p className="font-semibold">✅ Billet valide</p>
              <p className="text-sm">{result.ticket.event} — {result.ticket.tier}</p>
              <p className="text-sm">Titulaire : {result.ticket.owner}</p>
            </>
          ) : (
            <p className="font-semibold">⚠️ {result.reason}</p>
          )}
        </div>
      )}
    </div>
  );
}
