"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ARTISTS } from "../../lib/artists";
import ArtistCard from "../../components/ArtistCard";

function ArtistsCatalog() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ARTISTS;
    return ARTISTS.filter((a) => a.name.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Tous les artistes tamouls</h1>
      <p className="mt-1 text-sm text-slate-500">{ARTISTS.length} artistes référencés — recherchez un nom.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un artiste (ex: Anirudh, Sid Sriram, Ilaiyaraaja...)"
        className="mt-4 w-full max-w-md rounded-lg border px-3 py-2"
        autoFocus
      />

      <p className="mt-3 text-sm text-slate-500">{results.length} résultat(s)</p>

      {results.length === 0 ? (
        <p className="mt-6 text-slate-500">Aucun artiste ne correspond à votre recherche.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((a) => (
            <ArtistCard key={a.slug} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArtistsPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Chargement…</p>}>
      <ArtistsCatalog />
    </Suspense>
  );
}
