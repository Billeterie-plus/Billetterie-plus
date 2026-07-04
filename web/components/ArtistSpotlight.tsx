const ARTICLES = [
  {
    emoji: "🎤",
    name: "A.R. Rahman",
    tag: "Musique de film",
    text: "Compositeur oscarisé (Slumdog Millionaire), surnommé le « Mozart de Madras ». Ses concerts mêlent orchestre symphonique, musique électronique et sonorités traditionnelles indiennes.",
  },
  {
    emoji: "🎶",
    name: "Arijit Singh",
    tag: "Playback Bollywood",
    text: "L'une des voix les plus streamées d'Asie. Connu pour ses ballades romantiques dans le cinéma hindi, il remplit les plus grandes salles dès l'annonce d'une tournée.",
  },
  {
    emoji: "🎙️",
    name: "Shreya Ghoshal",
    tag: "Chant classique & Bollywood",
    text: "Voix emblématique du cinéma indien depuis plus de 20 ans, elle allie technique classique carnatique et pop moderne sur scène.",
  },
  {
    emoji: "🥁",
    name: "Zakir Hussain",
    tag: "Percussions classiques",
    text: "Maître du tabla reconnu mondialement, il a collaboré avec des artistes de jazz et de musique du monde tout en portant la tradition indienne sur les plus grandes scènes.",
  },
  {
    emoji: "🎧",
    name: "Anirudh Ravichander",
    tag: "Compositeur tamoul",
    text: "Figure incontournable du cinéma tamoul (Kollywood), connu pour ses bandes originales énergiques et ses concerts électrisants qui remplissent les stades en Inde du Sud.",
  },
  {
    emoji: "🎼",
    name: "Harris Jayaraj",
    tag: "Compositeur tamoul",
    text: "Compositeur emblématique du cinéma tamoul depuis les années 2000, réputé pour ses mélodies romantiques et ses orchestrations soignées.",
  },
  {
    emoji: "🎹",
    name: "Yuvan Shankar Raja",
    tag: "Compositeur tamoul",
    text: "Compositeur prolifique et polyvalent du cinéma tamoul, entre bandes originales pop, folk et musique de film, avec une large base de fans.",
  },
];

export default function ArtistSpotlight() {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-slate-800">À la une : artistes indiens</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ARTICLES.map((a) => (
          <article
            key={a.name}
            className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="text-2xl">{a.emoji}</div>
            <h3 className="mt-2 font-semibold text-slate-900">{a.name}</h3>
            <div className="text-xs font-medium text-brand">{a.tag}</div>
            <p className="mt-2 text-sm text-slate-600">{a.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
