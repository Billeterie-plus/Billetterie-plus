export type IconKey = "keys" | "mic" | "drum" | "headphones" | "note";

export type Artist = {
  slug: string;
  image: string;
  icon: IconKey;
  color: string;
  name: string;
  tag: string;
  short: string;
  bio: string[];
  keyDates: string[];
  latest: string;
};

export const ARTISTS: Artist[] = [
  {
    slug: "ar-rahman",
    image: "/artists/ar-rahman.jpg",
    icon: "headphones",
    color: "from-blue-600 to-blue-400",
    name: "A.R. Rahman",
    tag: "Musique de film",
    short:
      "Compositeur oscarisé (Slumdog Millionaire), surnommé le « Mozart de Madras ». Ses concerts mêlent orchestre symphonique, musique électronique et sonorités traditionnelles indiennes.",
    bio: [
      "Né à Madras (aujourd'hui Chennai), A.R. Rahman s'impose dès les années 1990 comme l'un des compositeurs les plus innovants du cinéma indien, en mêlant instruments classiques indiens, chœurs, et production électronique moderne.",
      "Sa notoriété devient mondiale avec la bande originale de Slumdog Millionaire, récompensée de deux Oscars et de deux Grammy Awards. Il continue de composer pour le cinéma indien et international et donne régulièrement de grands concerts symphoniques à travers le monde.",
    ],
    keyDates: [
      "1992 — Débute au cinéma avec la bande originale du film Roja.",
      "1995 — Compose la musique du film Bombay, saluée internationalement.",
      "2008 — Remporte deux Oscars et deux Grammy Awards pour Slumdog Millionaire.",
    ],
    latest:
      "En tournée symphonique aux États-Unis en juillet 2026 (San Francisco Symphony le 2 juillet, Wolf Trap le 10 juillet, Houston Symphony les 24 et 25 juillet), avec d'autres dates prévues jusqu'en août.",
  },
  {
    slug: "arijit-singh",
    image: "/artists/arijit-singh.jpg",
    icon: "mic",
    color: "from-indigo-600 to-indigo-400",
    name: "Arijit Singh",
    tag: "Playback Bollywood",
    short:
      "L'une des voix les plus streamées d'Asie. Connu pour ses ballades romantiques dans le cinéma hindi, il remplit les plus grandes salles dès l'annonce d'une tournée.",
    bio: [
      "Révélé par une émission de télé-crochet, Arijit Singh devient en quelques années l'une des voix de playback les plus demandées de Bollywood, portée par un timbre chaud reconnaissable dès les premières notes.",
      "Il cumule des milliards d'écoutes en streaming et se produit régulièrement en tournée devant un public international, notamment auprès de la diaspora indienne en Europe, aux États-Unis et au Moyen-Orient.",
    ],
    keyDates: [
      "2013 — Révélation avec le titre « Tum Hi Ho » (Aashiqui 2), qui le propulse au premier plan.",
      "2010s — Multiplie les récompenses (Filmfare, IIFA) comme meilleur chanteur playback année après année.",
    ],
    latest:
      "A annoncé le 10 février 2026 à Mumbai un « World Tour 2026-27 » de 40 villes, son plus grand à ce jour, avec deux dates au DY Patil Stadium de Navi Mumbai les 15 et 16 mai 2026.",
  },
  {
    slug: "shreya-ghoshal",
    image: "/artists/shreya-ghoshal.jpg",
    icon: "mic",
    color: "from-sky-600 to-sky-400",
    name: "Shreya Ghoshal",
    tag: "Chant classique & Bollywood",
    short:
      "Voix emblématique du cinéma indien depuis plus de 20 ans, elle allie technique classique carnatique et pop moderne sur scène.",
    bio: [
      "Formée très jeune au chant classique, Shreya Ghoshal se fait connaître dès le début des années 2000 dans le cinéma hindi et devient rapidement l'une des chanteuses de playback les plus récompensées d'Inde.",
      "Sa voix polyvalente lui permet de naviguer entre mélodies classiques, chansons romantiques et morceaux dansants, ce qui en fait une valeur sûre des concerts en salle comme des grands festivals.",
    ],
    keyDates: [
      "2000 — Débute au cinéma hindi avec Devdas et se fait immédiatement remarquer.",
      "2000s-2010s — Multiplie les National Film Awards de la meilleure chanteuse playback.",
    ],
    latest:
      "En tournée mondiale avec « The Unstoppable Tour » (avril à septembre 2026) : Asie en juillet (Singapour, Kuala Lumpur, Bangkok), Auckland le 20 juin, puis Amérique du Nord en septembre.",
  },
  {
    slug: "zakir-hussain",
    image: "/artists/zakir-hussain.jpg",
    icon: "drum",
    color: "from-amber-600 to-amber-400",
    name: "Zakir Hussain",
    tag: "Percussions classiques",
    short:
      "Maître du tabla reconnu mondialement, il a collaboré avec des artistes de jazz et de musique du monde tout en portant la tradition indienne sur les plus grandes scènes.",
    bio: [
      "Fils du légendaire joueur de tabla Ustad Alla Rakha, Zakir Hussain a perpétué et réinventé la tradition de la percussion classique indienne pendant plus de cinq décennies.",
      "Ses collaborations avec des musiciens de jazz, de musique du monde et de musique classique occidentale ont largement contribué à faire connaître le tabla hors d'Inde, sans jamais l'éloigner de ses racines. Il est décédé le 15 décembre 2024, laissant une œuvre considérable et de nombreux hommages dans le monde de la musique.",
    ],
    keyDates: [
      "Grammy Awards — Plusieurs récompenses au cours de sa carrière, dont trois lors de la cérémonie 2024 pour ses albums de musique du monde.",
      "15 décembre 2024 — Décès du maître, salué comme le plus grand joueur de tabla de sa génération.",
    ],
    latest:
      "Depuis sa disparition, ses proches et collaborateurs (notamment Third Coast Percussion) organisent des tournées hommage reprenant sa dernière œuvre, Murmurs in Time, sortie en EP le 7 février 2025.",
  },
  {
    slug: "anirudh-ravichander",
    image: "/artists/anirudh-ravichander.jpg",
    icon: "headphones",
    color: "from-teal-600 to-teal-400",
    name: "Anirudh Ravichander",
    tag: "Compositeur tamoul",
    short:
      "Figure incontournable du cinéma tamoul (Kollywood), connu pour ses bandes originales énergiques et ses concerts électrisants qui remplissent les stades en Inde du Sud.",
    bio: [
      "Repéré très jeune par le réalisateur Mani Ratnam, Anirudh Ravichander s'impose rapidement comme l'un des compositeurs les plus populaires du cinéma tamoul, avec un style qui mélange pop, hip-hop et sonorités électroniques.",
      "Ses tournées et concerts live, portés par une forte présence scénique, attirent un public massif en Inde du Sud comme au sein de la diaspora tamoule à l'international.",
    ],
    keyDates: [
      "2011 — Perce avec le titre viral « Why This Kolaveri Di » (film 3), succès national puis international.",
      "2010s-2020s — Devient l'un des compositeurs et interprètes tamouls les plus streamés.",
    ],
    latest:
      "En tournée « Anirudh XV Tour 2026 » : Dubaï le 11 janvier, Paris (Adidas Arena) le 18 avril, Trenton (New Jersey) le 30 août et Toronto le 5 septembre 2026.",
  },
  {
    slug: "harris-jayaraj",
    image: "/artists/harris-jayaraj.jpg",
    icon: "note",
    color: "from-violet-600 to-violet-400",
    name: "Harris Jayaraj",
    tag: "Compositeur tamoul",
    short:
      "Compositeur emblématique du cinéma tamoul depuis les années 2000, réputé pour ses mélodies romantiques et ses orchestrations soignées.",
    bio: [
      "Harris Jayaraj s'est fait connaître à la fin des années 1990 pour ses orchestrations riches et ses mélodies romantiques, devenant l'un des compositeurs de référence du cinéma tamoul.",
      "Son style, marqué par des arrangements soignés mêlant cordes, chœurs et sonorités contemporaines, a profondément influencé toute une génération de musique de film en Inde du Sud.",
    ],
    keyDates: [
      "1999 — Débute avec la bande originale du film Minnale, immédiatement remarquée.",
      "Années 2000 — Enchaîne les succès qui font de lui une référence du cinéma tamoul romantique.",
    ],
    latest:
      "A composé la musique de Kadhal Reset Repeat, comédie musicale romantique tamoule sortie en salles le 6 mars 2026.",
  },
  {
    slug: "yuvan-shankar-raja",
    image: "/artists/yuvan-shankar-raja.jpg",
    icon: "keys",
    color: "from-rose-600 to-rose-400",
    name: "Yuvan Shankar Raja",
    tag: "Compositeur tamoul",
    short:
      "Compositeur prolifique et polyvalent du cinéma tamoul, entre bandes originales pop, folk et musique de film, avec une large base de fans.",
    bio: [
      "Fils du compositeur Ilaiyaraaja, Yuvan Shankar Raja se forge sa propre identité musicale dès les années 1990 en explorant un large éventail de styles, du folk tamoul à la pop électronique.",
      "Réputé pour sa productivité et sa capacité à se réinventer, il reste l'un des compositeurs les plus sollicités du cinéma tamoul, avec une fanbase fidèle qui suit ses concerts avec ferveur.",
    ],
    keyDates: [
      "1997 — Débute comme compositeur à seulement 17 ans avec le film Aravindhan.",
      "2020s — Signe la bande originale du film à succès The Greatest of All Time.",
    ],
    latest:
      "Concert prévu le 4 juillet 2026 à l'Expo Ground de Pondichéry, après une tournée en Australie en 2025 (Sydney, Melbourne) et la sortie de l'album Jayam Ravi Hits le 8 septembre 2025.",
  },
];
