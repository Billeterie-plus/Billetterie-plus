"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ARTISTS } from "../lib/artists";

export default function ArtistSearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function go() {
    router.push(query.trim() ? `/artistes?q=${encodeURIComponent(query.trim())}` : "/artistes");
  }

  return (
    <section className="mb-10 rounded-xl border bg-white p-5">
      <h2 className="font-semibold text-slate-900">Rechercher un artiste indien Tamil</h2>
      <p className="mt-1 text-sm text-slate-500">
        {ARTISTS.length} artistes Tamil référencés (compositeurs, chanteurs, duos).
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="Ex: Anirudh, Sid Sriram, Ilaiyaraaja..."
          className="w-full max-w-sm rounded-lg border px-3 py-2"
        />
        <button onClick={go} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          Rechercher
        </button>
      </div>
    </section>
  );
}
