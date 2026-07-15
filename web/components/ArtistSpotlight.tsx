"use client";

import { ARTISTS, localizeArtist } from "../lib/artists";
import ArtistCard from "./ArtistCard";
import { useLanguage, useT } from "../lib/i18n/LanguageContext";

export default function ArtistSpotlight() {
  const t = useT();
  const { locale } = useLanguage();
  const featured = ARTISTS.filter((a) => a.featured).map((a) => localizeArtist(a, locale));

  return (
    <section className="mb-10 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-lg sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-gold-light">{t("artistSpotlight.title")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((a) => (
          <ArtistCard key={a.slug} a={a} />
        ))}
      </div>
    </section>
  );
}
