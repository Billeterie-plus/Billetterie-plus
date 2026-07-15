"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ARTISTS } from "../lib/artists";
import { useT } from "../lib/i18n/LanguageContext";

export default function ArtistSearchBox() {
  const t = useT();
  const [query, setQuery] = useState("");
  const router = useRouter();

  function go() {
    router.push(query.trim() ? `/artistes?q=${encodeURIComponent(query.trim())}` : "/artistes");
  }

  return (
    <section className="mb-10 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-lg sm:p-6">
      <h2 className="font-semibold text-gold-light">{t("artistSearch.heading")}</h2>
      <p className="mt-1 text-sm text-white/70">{t("artistSearch.subtitle", { n: ARTISTS.length })}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder={t("artistSearch.placeholder")}
          className="w-full max-w-sm rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none"
        />
        <button onClick={go} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand hover:bg-white/90">
          {t("artistSearch.button")}
        </button>
      </div>
    </section>
  );
}
