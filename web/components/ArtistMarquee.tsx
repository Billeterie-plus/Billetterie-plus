import Link from "next/link";
import { ARTISTS } from "../lib/artists";
import ArtistAvatar from "./ArtistAvatar";

export default function ArtistMarquee() {
  // On duplique la liste pour un défilement en boucle sans coupure.
  const track = [...ARTISTS, ...ARTISTS];

  return (
    <section className="mb-10 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-lg sm:p-6">
      <h2 className="mb-3 text-xl font-bold text-gold-light">Artistes à la une</h2>
      <div className="group relative overflow-hidden rounded-xl bg-white/10 py-4">
        <div className="flex w-max animate-marquee gap-6 px-6 group-hover:[animation-play-state:paused]">
          {track.map((a, i) => (
            <Link
              key={`${a.slug}-${i}`}
              href={`/artistes/${a.slug}`}
              className="flex w-24 flex-shrink-0 flex-col items-center gap-2 text-center transition hover:-translate-y-1"
            >
              <ArtistAvatar image={a.image} icon={a.icon} color={a.color} name={a.name} />
              <span className="text-xs font-medium text-white">{a.name}</span>
            </Link>
          ))}
        </div>
        {/* dégradés sur les bords pour un effet plus propre */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-brand to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-brand-dark to-transparent" />
      </div>
    </section>
  );
}
