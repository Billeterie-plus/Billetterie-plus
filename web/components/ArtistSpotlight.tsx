"use client";

import { ARTISTS, localizeArtist } from "../lib/artists";
import ArtistCard from "./ArtistCard";
import { useLanguage, useT } from "../lib/i18n/LanguageContext";
import Reveal, { RevealGroup, RevealItem } from "./Reveal";

export default function ArtistSpotlight() {
  const t = useT();
  const { locale } = useLanguage();
  const featured = ARTISTS.filter((a) => a.featured).map((a) => localizeArtist(a, locale));

  return (
    <Reveal>
      <section className="relative overflow-hidden mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-emerald-500/10 blur-[80px]" aria-hidden />
        <h2 className="relative mb-4 text-2xl font-bold text-slate-900">{t("artistSpotlight.title")}</h2>
        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {featured.map((a) => (
            <RevealItem key={a.slug}>
              <ArtistCard a={a} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </Reveal>
  );
}
