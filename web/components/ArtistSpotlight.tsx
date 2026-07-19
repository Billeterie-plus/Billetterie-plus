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
      <section className="mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-brand via-brand to-brand-dark p-5 text-white shadow-xl shadow-black/30 sm:p-6">
        <h2 className="mb-4 text-xl font-bold text-gold-light">{t("artistSpotlight.title")}</h2>
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
