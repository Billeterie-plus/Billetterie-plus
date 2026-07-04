// Icônes thématiques (pas de photos réelles, pour des raisons de droits d'image).
function IconKeys() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 5v9M11 5v9M15 5v9M19 5v9" />
    </svg>
  );
}
function IconMic() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.6">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4M9 22h6" />
    </svg>
  );
}
function IconDrum() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.6">
      <ellipse cx="12" cy="7" rx="8" ry="3.5" />
      <path d="M4 7v9c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V7" />
      <path d="M4 12.5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5" />
    </svg>
  );
}
function IconHeadphones() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="2.5" y="14" width="5" height="7" rx="2" />
      <rect x="16.5" y="14" width="5" height="7" rx="2" />
    </svg>
  );
}
function IconNote() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.6">
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      <path d="M9 18V5l12-2v13" />
    </svg>
  );
}

const ARTICLES = [
  {
    Icon: IconHeadphones,
    color: "from-blue-600 to-blue-400",
    name: "A.R. Rahman",
    tag: "Musique de film",
    text: "Compositeur oscarisé (Slumdog Millionaire), surnommé le « Mozart de Madras ». Ses concerts mêlent orchestre symphonique, musique électronique et sonorités traditionnelles indiennes.",
  },
  {
    Icon: IconMic,
    color: "from-indigo-600 to-indigo-400",
    name: "Arijit Singh",
    tag: "Playback Bollywood",
    text: "L'une des voix les plus streamées d'Asie. Connu pour ses ballades romantiques dans le cinéma hindi, il remplit les plus grandes salles dès l'annonce d'une tournée.",
  },
  {
    Icon: IconMic,
    color: "from-sky-600 to-sky-400",
    name: "Shreya Ghoshal",
    tag: "Chant classique & Bollywood",
    text: "Voix emblématique du cinéma indien depuis plus de 20 ans, elle allie technique classique carnatique et pop moderne sur scène.",
  },
  {
    Icon: IconDrum,
    color: "from-amber-600 to-amber-400",
    name: "Zakir Hussain",
    tag: "Percussions classiques",
    text: "Maître du tabla reconnu mondialement, il a collaboré avec des artistes de jazz et de musique du monde tout en portant la tradition indienne sur les plus grandes scènes.",
  },
  {
    Icon: IconHeadphones,
    color: "from-teal-600 to-teal-400",
    name: "Anirudh Ravichander",
    tag: "Compositeur tamoul",
    text: "Figure incontournable du cinéma tamoul (Kollywood), connu pour ses bandes originales énergiques et ses concerts électrisants qui remplissent les stades en Inde du Sud.",
  },
  {
    Icon: IconNote,
    color: "from-violet-600 to-violet-400",
    name: "Harris Jayaraj",
    tag: "Compositeur tamoul",
    text: "Compositeur emblématique du cinéma tamoul depuis les années 2000, réputé pour ses mélodies romantiques et ses orchestrations soignées.",
  },
  {
    Icon: IconKeys,
    color: "from-rose-600 to-rose-400",
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
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${a.color} text-white`}
            >
              <a.Icon />
            </div>
            <h3 className="mt-3 font-semibold text-slate-900">{a.name}</h3>
            <div className="text-xs font-medium text-brand">{a.tag}</div>
            <p className="mt-2 text-sm text-slate-600">{a.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
