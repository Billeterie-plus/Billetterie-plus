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
      "Fils du légendaire joueur de tabla Ustad Alla Rakha, Zakir Hussain perpétue et réinvente la tradition de la percussion classique indienne depuis plus de cinq décennies.",
      "Ses collaborations avec des musiciens de jazz, de musique du monde et de musique classique occidentale ont largement contribué à faire connaître le tabla hors d'Inde, sans jamais l'éloigner de ses racines.",
    ],
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
  },
];
