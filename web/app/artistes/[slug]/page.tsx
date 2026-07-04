import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTISTS } from "../../../lib/artists";
import ArtistAvatar from "../../../components/ArtistAvatar";

export function generateStaticParams() {
  return ARTISTS.map((a) => ({ slug: a.slug }));
}

export default function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = ARTISTS.find((a) => a.slug === params.slug);
  if (!artist) return notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/" className="text-sm text-brand hover:underline">
        ← Retour à l'accueil
      </Link>

      <div className="mt-6 flex flex-col items-center text-center">
        <ArtistAvatar image={artist.image} icon={artist.icon} color={artist.color} name={artist.name} size="lg" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{artist.name}</h1>
        <div className="mt-1 text-sm font-medium text-brand">{artist.tag}</div>
      </div>

      <div className="mt-8 space-y-4 text-slate-700">
        {artist.bio.map((paragraph, i) => (
          <p key={i} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-white p-5">
        <h2 className="font-semibold text-slate-900">Dates clés dans le cinéma indien</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {artist.keyDates.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-brand">•</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border bg-white p-5">
        <h2 className="font-semibold text-slate-900">Actualité / dernier concert</h2>
        <p className="mt-2 text-sm text-slate-600">{artist.latest}</p>
        <p className="mt-3 text-xs text-slate-400">
          Informations vérifiées début juillet 2026, susceptibles d'évoluer selon les annonces des artistes.
        </p>
      </div>
    </div>
  );
}
