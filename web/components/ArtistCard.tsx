import Link from "next/link";
import type { Artist } from "../lib/artists";
import ArtistAvatar from "./ArtistAvatar";

export default function ArtistCard({ a }: { a: Artist }) {
  return (
    <Link
      href={`/artistes/${a.slug}`}
      className="block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <ArtistAvatar image={a.image} icon={a.icon} color={a.color} name={a.name} />
      <h3 className="mt-3 font-semibold text-slate-900">{a.name}</h3>
      <div className="text-xs font-medium text-brand">{a.tag}</div>
      <p className="mt-2 text-sm text-slate-600">{a.short}</p>
      <span className="mt-2 inline-block text-xs font-medium text-brand">Lire l'article →</span>
    </Link>
  );
}
