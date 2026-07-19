"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ARTISTS } from "../lib/artists";
import { useT } from "../lib/i18n/LanguageContext";
import Reveal from "./Reveal";

export default function ArtistSearchBox() {
  const t = useT();
  const [query, setQuery] = useState("");
  const router = useRouter();

  function go() {
    router.push(query.trim() ? `/artistes?q=${encodeURIComponent(query.trim())}` : "/artistes");
  }

  return (
    <Reveal>
      <section className="mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-brand via-brand to-brand-dark p-5 text-white shadow-xl shadow-black/30 sm:p-6">
        <h2 className="font-serif text-xl font-semibold text-gold-light">{t("artistSearch.heading")}</h2>
        <p className="mt-1 text-sm text-white/70">{t("artistSearch.subtitle", { n: ARTISTS.length })}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder={t("artistSearch.placeholder")}
            className="w-full max-w-sm rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none"
          />
          <button onClick={go} className="rounded-lg bg-gradient-to-r from-gold-light to-gold px-4 py-2 text-sm font-medium text-brand-dark transition hover:scale-105">
            {t("artistSearch.button")}
          </button>
        </div>
      </section>
    </Reveal>
  );
}
