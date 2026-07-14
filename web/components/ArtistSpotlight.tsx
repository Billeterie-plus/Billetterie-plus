import { ARTISTS } from "../lib/artists";
import ArtistCard from "./ArtistCard";

export default function ArtistSpotlight() {
  const featured = ARTISTS.filter((a) => a.featured);

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-slate-800">À la une : artistes indiens Tamil</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((a) => (
          <ArtistCard key={a.slug} a={a} />
        ))}
      </div>
    </section>
  );
}
