import Link from "next/link";
import { ARTISTS } from "../lib/artists";
import ArtistAvatar from "./ArtistAvatar";

export default function ArtistSpotlight() {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-slate-800">À la une : artistes indiens</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ARTISTS.map((a) => (
          <Link
            key={a.slug}
            href={`/artistes/${a.slug}`}
            className="block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <ArtistAvatar image={a.image} icon={a.icon} color={a.color} name={a.name} />
            <h3 className="mt-3 font-semibold text-slate-900">{a.name}</h3>
            <div className="text-xs font-medium text-brand">{a.tag}</div>
            <p className="mt-2 text-sm text-slate-600">{a.short}</p>
            <span className="mt-2 inline-block text-xs font-medium text-brand">Lire l'article →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
