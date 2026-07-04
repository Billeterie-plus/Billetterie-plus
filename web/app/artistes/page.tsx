"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ARTISTS, type Region } from "../../lib/artists";
import ArtistCard from "../../components/ArtistCard";

const REGIONS: { value: Region | ""; label: string }[] = [
  { value: "", label: "Toutes les régions" },
  { value: "tamoul", label: "Tamoul" },
  { value: "hindi", label: "Hindi / Bollywood" },
  { value: "telougou", label: "Télougou" },
  { value: "punjabi", label: "Punjabi" },
  { value: "malayalam", label: "Malayalam" },
  { value: "classique", label: "Classique" },
];

function ArtistsCatalog() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [region, setRegion] = useState<Region | "">("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTISTS.filter((a) => {
      const matchesQuery = !q || a.name.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q);
      const matchesRegion = !region || a.region === region;
      return matchesQuery && matchesRegion;
    });
  }, [query, region]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Tous les artistes indiens</h1>
      <p className="mt-1 text-sm text-slate-500">{ARTISTS.length} artistes référencés — recherchez un nom ou filtrez par région.</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un artiste (ex: Anirudh, Sid Sriram, Ilaiyaraaja...)"
          className="w-full max-w-sm rounded-lg border px-3 py-2"
          autoFocus
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as Region | "")}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

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
