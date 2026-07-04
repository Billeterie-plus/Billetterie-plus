export type IconKey = "keys" | "mic" | "drum" | "headphones" | "note";
export type Region = "tamoul" | "hindi" | "classique";

export type Artist = {
  slug: string;
  image: string;
  icon: IconKey;
  color: string;
  name: string;
  tag: string;
  region: Region;
  featured: boolean;
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
    region: "tamoul",
    featured: true,
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
    region: "hindi",
    featured: true,
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
    region: "hindi",
    featured: true,
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
    region: "classique",
    featured: true,
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
    region: "tamoul",
    featured: true,
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
    region: "tamoul",
    featured: true,
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
    region: "tamoul",
    featured: true,
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
  {
    slug: "ilaiyaraaja",
    image: "/artists/ilaiyaraaja.jpg",
    icon: "keys",
    color: "from-emerald-600 to-emerald-400",
    name: "Ilaiyaraaja",
    tag: "Compositeur tamoul",
    region: "tamoul",
    featured: false,
    short:
      "Surnommé « l'Isai Gnani » (le sage de la musique), il a composé plus de 4 500 chansons et la musique de plus de 1 000 films en cinq décennies de carrière.",
    bio: [
      "Figure fondatrice de la musique de film tamoule moderne, Ilaiyaraaja a introduit dès la fin des années 1970 l'usage de l'orchestration occidentale mêlée aux ragas classiques indiens et aux mélodies folkloriques du Tamil Nadu.",
      "Père du compositeur Yuvan Shankar Raja, il reste actif sur scène avec de grandes tournées symphoniques rendant hommage à son répertoire, y compris à l'international.",
    ],
    keyDates: [
      "1976 — Débute comme compositeur avec le film Annakkili.",
      "Record du monde — Seul compositeur de l'histoire du cinéma à avoir signé la musique de plus de 1 000 films.",
    ],
    latest:
      "Tournée « Ilaiyaraaja Live 2026 » : concert à Chennai après une étape à Londres, puis dates au Royaume-Uni (OVO Arena Wembley le 10 juillet) et aux États-Unis (EagleBank Arena) dans le cadre du « Raja 50 USA Tour ».",
  },
  {
    slug: "gv-prakash-kumar",
    image: "/artists/gv-prakash-kumar.jpg",
    icon: "note",
    color: "from-cyan-600 to-cyan-400",
    name: "G.V. Prakash Kumar",
    tag: "Compositeur tamoul",
    region: "tamoul",
    featured: false,
    short:
      "Neveu d'A.R. Rahman, il s'est imposé comme l'un des compositeurs les plus prolifiques du cinéma tamoul, avant de devenir aussi acteur.",
    bio: [
      "G.V. Prakash Kumar débute très jeune dans l'industrie du cinéma tamoul et se forge rapidement une identité musicale mêlant mélodies populaires et sonorités contemporaines.",
      "En parallèle de sa carrière de compositeur, il s'est également imposé comme acteur dans plusieurs films tamouls à succès.",
    ],
    keyDates: [
      "2006 — Débute comme compositeur avec le film Veyyil.",
      "Janvier 2026 — Compose la musique de Parasakthi, son 100e film en tant que compositeur.",
    ],
    latest:
      "A composé la musique de Parasakthi (sorti le 10 janvier 2026) et apparaît en tant qu'acteur dans Happy Raj, sorti le 27 mars 2026.",
  },
  {
    slug: "santhosh-narayanan",
    image: "/artists/santhosh-narayanan.jpg",
    icon: "headphones",
    color: "from-orange-600 to-orange-400",
    name: "Santhosh Narayanan",
    tag: "Compositeur tamoul",
    region: "tamoul",
    featured: false,
    short:
      "Compositeur tamoul à l'univers sonore singulier, mêlant folk du Tamil Nadu, hip-hop et musique électronique indépendante.",
    bio: [
      "Repéré grâce à sa collaboration avec le réalisateur Pa. Ranjith, Santhosh Narayanan s'est distingué par des bandes originales ancrées dans les musiques populaires et folkloriques tamoules, avec une touche résolument moderne.",
      "Il collabore aussi régulièrement avec des artistes internationaux, contribuant à faire connaître la scène musicale tamoule indépendante hors d'Inde.",
    ],
    keyDates: [
      "2012 — Révélé par la bande originale du film Attakathi.",
      "Octobre 2025 — Collabore avec Ed Sheeran sur l'EP Play (The Remixes).",
    ],
    latest:
      "A composé la musique du film Vaa Vaathiyaar, sorti le 14 janvier 2026, et a produit le single « Vari Vari » de la chanteuse Dhee en 2026.",
  },
  {
    slug: "sid-sriram",
    image: "/artists/sid-sriram.jpg",
    icon: "mic",
    color: "from-fuchsia-600 to-fuchsia-400",
    name: "Sid Sriram",
    tag: "Chanteur tamoul",
    region: "tamoul",
    featured: false,
    short:
      "Chanteur né en Inde et formé aux États-Unis, il marie musique carnatique traditionnelle et pop/R&B contemporains, aussi bien dans le cinéma tamoul qu'en tant qu'artiste solo.",
    bio: [
      "Formé dès l'enfance à la musique carnatique puis élevé en Californie, Sid Sriram développe un style unique mêlant tradition indienne et influences R&B et hip-hop américaines.",
      "Très demandé comme chanteur playback dans le cinéma tamoul, il mène en parallèle une carrière solo internationale, avec des collaborations remarquées dans l'industrie musicale américaine.",
    ],
    keyDates: [
      "2012 — Débute comme chanteur playback dans le cinéma tamoul.",
      "2023 — Sort Sidharth, son premier album entièrement en anglais, chez Def Jam.",
    ],
    latest:
      "Tournée nord-américaine à l'automne 2026, avec des dates en septembre (Illinois, New Jersey, Virginie, Washington, Californie) et des concerts au Blue Note de New York et Los Angeles en novembre 2026.",
  },
  {
    slug: "d-imman",
    image: "/artists/d-imman.jpg",
    icon: "note",
    color: "from-lime-600 to-lime-400",
    name: "D. Imman",
    tag: "Compositeur tamoul",
    region: "tamoul",
    featured: false,
    short:
      "Compositeur tamoul réputé pour ses mélodies mélodieuses et ses bandes originales rurales, récompensé à plusieurs reprises pour son travail dans le cinéma tamoul.",
    bio: [
      "D. Imman se distingue par des compositions mélodiques marquées par des sonorités folkloriques et rurales, très appréciées dans le cinéma tamoul populaire.",
      "Il a composé la musique de nombreux films à succès et reste l'un des compositeurs les plus actifs de l'industrie, avec plusieurs sorties chaque année.",
    ],
    keyDates: [
      "2008 — Débute avec la bande originale du film Vil Ambu.",
      "2010s — Multiplie les récompenses pour ses bandes originales dans le cinéma tamoul.",
    ],
    latest:
      "A composé la musique du film Vadam, sorti le 6 mars 2026, ainsi que celle de plusieurs autres sorties tamoules de l'année.",
  },
  {
    slug: "hiphop-tamizha",
    image: "/artists/hiphop-tamizha.jpg",
    icon: "headphones",
    color: "from-red-600 to-red-400",
    name: "Hiphop Tamizha (Adhi)",
    tag: "Duo hip-hop tamoul",
    region: "tamoul",
    featured: false,
    short:
      "Duo formé d'Adhi et Jeeva, pionnier du hip-hop en langue tamoule, connu pour ses titres énergiques et ses concerts très suivis en Inde du Sud.",
    bio: [
      "Basé à Chennai, le duo Hiphop Tamizha est considéré comme le pionnier du hip-hop en tamoul, mêlant rap, pop et sonorités traditionnelles dans des morceaux devenus des hymnes populaires.",
      "Adhi, la voix et le compositeur principal du duo, s'est aussi imposé comme acteur et réalisateur dans le cinéma tamoul.",
    ],
    keyDates: [
      "2014 — Premier album qui installe le duo comme pionnier du hip-hop tamoul.",
      "Plusieurs titres devenus viraux, dont « Ethir Neechal » et « Sakkarakatti ».",
    ],
    latest:
      "Concert prévu le 7 mars 2026 au YMCA Ground de Chennai ; pas de tournée internationale annoncée pour le moment.",
  },
  {
    slug: "dhee",
    image: "/artists/dhee.jpg",
    icon: "mic",
    color: "from-pink-600 to-pink-400",
    name: "Dhee",
    tag: "Chanteuse tamoule",
    region: "tamoul",
    featured: false,
    short:
      "Révélée par le titre viral « Rowdy Baby », elle s'impose depuis comme l'une des voix montantes de la pop tamoule contemporaine.",
    bio: [
      "Dhee se fait connaître en 2018 avec « Rowdy Baby » (film Maari 2, avec Yuvan Shankar Raja), devenu l'une des vidéos musicales indiennes les plus vues au monde.",
      "Depuis, elle poursuit une carrière solo entre pop tamoule et collaborations internationales, en explorant des sonorités plus électroniques et personnelles.",
    ],
    keyDates: [
      "2018 — Explose avec « Rowdy Baby », plus d'1,5 milliard de vues sur YouTube.",
      "Octobre 2025 — Apparaît sur l'EP Play (The Remixes) d'Ed Sheeran.",
    ],
    latest:
      "A sorti plusieurs nouveaux titres en 2026, dont « Like I Want You » (13 mars 2026) et le single « Vari Vari », produit par Santhosh Narayanan.",
  },
  {
    slug: "chinmayi-sripada",
    image: "/artists/chinmayi-sripada.jpg",
    icon: "mic",
    color: "from-purple-600 to-purple-400",
    name: "Chinmayi Sripada",
    tag: "Chanteuse tamoule",
    region: "tamoul",
    featured: false,
    short:
      "Chanteuse et actrice de doublage prolifique, active dans le cinéma tamoul, télougou, kannada, malayalam et hindi depuis plus de 20 ans.",
    bio: [
      "Chinmayi Sripada s'est imposée dès les années 2000 comme l'une des chanteuses de playback les plus polyvalentes du sud de l'Inde, avant de développer également une importante carrière de doublage.",
      "Elle poursuit aujourd'hui ses activités de chanteuse et de doubleuse dans plusieurs langues, tout en étant également entrepreneuse.",
    ],
    keyDates: [
      "2001 — Débute comme chanteuse playback dans le cinéma tamoul.",
      "2023 — Fait son retour au doublage dans le cinéma tamoul après plusieurs années d'absence.",
    ],
    latest:
      "A prêté sa voix dans le film Karuppu (2026) et a doublé pour le film télougou Dacoit: A Love Story en 2026.",
  },
];
