"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ARTISTS, localizeArtist } from "../../lib/artists";
import ArtistCard from "../../components/ArtistCard";
import { useLanguage, useT } from "../../lib/i18n/LanguageContext";

function ArtistsCatalog() {
  const t = useT();
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const localized = useMemo(() => ARTISTS.map((a) => localizeArtist(a, locale)), [locale]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localized;
    return localized.filter((a) => a.name.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q));
  }, [query, localized]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("artists.title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("artists.count", { n: ARTISTS.length })}</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("artists.searchPlaceholder")}
        className="mt-4 w-full max-w-md rounded-lg border px-3 py-2"
        autoFocus
      />

      <p className="mt-3 text-sm text-slate-500">{t("artists.results", { n: results.length })}</p>

      {results.length === 0 ? (
        <p className="mt-6 text-slate-500">{t("artists.noResults")}</p>
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
