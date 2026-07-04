"use client";

import { useMemo, useState } from "react";
import { ARTISTS } from "../lib/artists";
import ArtistCard from "./ArtistCard";

export default function TamilArtistSearch() {
  const [query, setQuery] = useState("");
  const tamilArtists = useMemo(() => ARTISTS.filter((a) => a.region === "tamoul"), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tamilArtists;
    return tamilArtists.filter(
      (a) => a.name.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q)
    );
  }, [query, tamilArtists]);

  return (
    <section className="mb-10">
      <h2 className="mb-1 text-xl font-bold text-slate-800">Tous les artistes indiens tamouls</h2>
      <p className="mb-4 text-sm text-slate-500">
        Recherchez un compositeur ou chanteur tamoul ({tamilArtists.length} artistes référencés).
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un artiste tamoul (ex: Anirudh, Sid Sriram, Ilaiyaraaja...)"
        className="mb-4 w-full max-w-md rounded-lg border px-3 py-2"
      />

      {results.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun artiste ne correspond à votre recherche.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((a) => (
            <ArtistCard key={a.slug} a={a} />
          ))}
        </div>
      )}
    </section>
  );
}
