export type IconKey = "keys" | "mic" | "drum" | "headphones" | "note";
export type Region = "Tamil";
export type ArtistLocale = "fr" | "en" | "de";

export type ArtistTranslation = {
  tag: string;
  short: string;
  bio: string[];
  keyDates: string[];
  latest: string;
};

export type Artist = {
  slug: string;
  image: string;
  icon: IconKey;
  color: string;
  name: string;
  region: Region;
  featured: boolean;
  translations: Record<ArtistLocale, ArtistTranslation>;
};

export type LocalizedArtist = Omit<Artist, "translations"> & ArtistTranslation;

/** Résout les champs traduits d'un artiste pour la langue courante (repli sur le français). */
export function localizeArtist(a: Artist, locale: ArtistLocale): LocalizedArtist {
  const { translations, ...rest } = a;
  const tr = translations[locale] || translations.fr;
  return { ...rest, ...tr };
}

export const ARTISTS: Artist[] = [
  {
    slug: "ar-rahman",
    image: "/artists/ar-rahman.jpg",
    icon: "headphones",
    color: "from-blue-600 to-blue-400",
    name: "A.R. Rahman",
    region: "Tamil",
    featured: true,
    translations: {
      fr: {
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
      en: {
        tag: "Film music",
        short:
          "Oscar-winning composer (Slumdog Millionaire), nicknamed the \"Mozart of Madras\". His concerts blend symphony orchestra, electronic music and traditional Indian sounds.",
        bio: [
          "Born in Madras (now Chennai), A.R. Rahman established himself in the 1990s as one of the most innovative composers in Indian cinema, blending classical Indian instruments, choirs, and modern electronic production.",
          "His fame became global with the soundtrack of Slumdog Millionaire, which won two Oscars and two Grammy Awards. He continues to compose for Indian and international cinema and regularly performs major symphonic concerts around the world.",
        ],
        keyDates: [
          "1992 — Makes his film debut with the soundtrack of Roja.",
          "1995 — Composes the music for Bombay, acclaimed internationally.",
          "2008 — Wins two Oscars and two Grammy Awards for Slumdog Millionaire.",
        ],
        latest:
          "On a symphonic tour in the United States in July 2026 (San Francisco Symphony on July 2, Wolf Trap on July 10, Houston Symphony on July 24 and 25), with more dates planned through August.",
      },
      de: {
        tag: "Filmmusik",
        short:
          "Oscar-prämierter Komponist (Slumdog Millionaire), genannt der „Mozart von Madras\". Seine Konzerte verbinden Symphonieorchester, elektronische Musik und traditionelle indische Klänge.",
        bio: [
          "A.R. Rahman wurde in Madras (heute Chennai) geboren und etablierte sich bereits in den 1990er-Jahren als einer der innovativsten Komponisten des indischen Kinos, indem er klassische indische Instrumente, Chöre und moderne elektronische Produktion miteinander verband.",
          "Weltweite Bekanntheit erlangte er mit dem Soundtrack zu Slumdog Millionaire, der mit zwei Oscars und zwei Grammy Awards ausgezeichnet wurde. Er komponiert weiterhin für das indische und internationale Kino und gibt regelmäßig große symphonische Konzerte auf der ganzen Welt.",
        ],
        keyDates: [
          "1992 — Filmdebüt mit dem Soundtrack zu Roja.",
          "1995 — Komponiert die Musik für Bombay, international gefeiert.",
          "2008 — Gewinnt zwei Oscars und zwei Grammy Awards für Slumdog Millionaire.",
        ],
        latest:
          "Im Juli 2026 auf symphonischer Tournee in den USA (San Francisco Symphony am 2. Juli, Wolf Trap am 10. Juli, Houston Symphony am 24. und 25. Juli), mit weiteren Terminen bis August.",
      },
    },
  },
  {
    slug: "anirudh-ravichander",
    image: "/artists/anirudh-ravichander.jpg",
    icon: "headphones",
    color: "from-teal-600 to-teal-400",
    name: "Anirudh Ravichander",
    region: "Tamil",
    featured: true,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short:
          "Figure incontournable du cinéma Tamil (Kollywood), connu pour ses bandes originales énergiques et ses concerts électrisants qui remplissent les stades en Inde du Sud.",
        bio: [
          "Repéré très jeune par le réalisateur Mani Ratnam, Anirudh Ravichander s'impose rapidement comme l'un des compositeurs les plus populaires du cinéma Tamil, avec un style qui mélange pop, hip-hop et sonorités électroniques.",
          "Ses tournées et concerts live, portés par une forte présence scénique, attirent un public massif en Inde du Sud comme au sein de la diaspora Tamil à l'international.",
        ],
        keyDates: [
          "2011 — Perce avec le titre viral « Why This Kolaveri Di » (film 3), succès national puis international.",
          "2010s-2020s — Devient l'un des compositeurs et interprètes Tamil les plus streamés.",
        ],
        latest:
          "En tournée « Anirudh XV Tour 2026 » : Dubaï le 11 janvier, Paris (Adidas Arena) le 18 avril, Trenton (New Jersey) le 30 août et Toronto le 5 septembre 2026.",
      },
      en: {
        tag: "Tamil composer",
        short:
          "A key figure in Tamil cinema (Kollywood), known for his energetic soundtracks and electrifying concerts that fill stadiums across South India.",
        bio: [
          "Spotted at a young age by director Mani Ratnam, Anirudh Ravichander quickly established himself as one of the most popular composers in Tamil cinema, with a style blending pop, hip-hop and electronic sounds.",
          "His tours and live concerts, driven by a strong stage presence, draw massive crowds across South India as well as within the international Tamil diaspora.",
        ],
        keyDates: [
          "2011 — Breaks through with the viral hit \"Why This Kolaveri Di\" (film 3), a national then international success.",
          "2010s-2020s — Becomes one of the most streamed Tamil composers and performers.",
        ],
        latest:
          "On the \"Anirudh XV Tour 2026\": Dubai on January 11, Paris (Adidas Arena) on April 18, Trenton (New Jersey) on August 30, and Toronto on September 5, 2026.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short:
          "Eine zentrale Figur des tamilischen Kinos (Kollywood), bekannt für seine energiegeladenen Soundtracks und mitreißenden Konzerte, die Stadien in Südindien füllen.",
        bio: [
          "Bereits in jungen Jahren von Regisseur Mani Ratnam entdeckt, etablierte sich Anirudh Ravichander rasch als einer der beliebtesten Komponisten des tamilischen Kinos mit einem Stil, der Pop, Hip-Hop und elektronische Klänge vereint.",
          "Seine Tourneen und Live-Konzerte, getragen von einer starken Bühnenpräsenz, ziehen ein riesiges Publikum in Südindien sowie in der internationalen tamilischen Diaspora an.",
        ],
        keyDates: [
          "2011 — Durchbruch mit dem viralen Hit „Why This Kolaveri Di\" (Film 3), zunächst national, dann international erfolgreich.",
          "2010er-2020er — Wird zu einem der meistgestreamten tamilischen Komponisten und Interpreten.",
        ],
        latest:
          "Auf der „Anirudh XV Tour 2026\": Dubai am 11. Januar, Paris (Adidas Arena) am 18. April, Trenton (New Jersey) am 30. August und Toronto am 5. September 2026.",
      },
    },
  },
  {
    slug: "harris-jayaraj",
    image: "/artists/harris-jayaraj.jpg",
    icon: "note",
    color: "from-violet-600 to-violet-400",
    name: "Harris Jayaraj",
    region: "Tamil",
    featured: true,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short:
          "Compositeur emblématique du cinéma Tamil depuis les années 2000, réputé pour ses mélodies romantiques et ses orchestrations soignées.",
        bio: [
          "Harris Jayaraj s'est fait connaître à la fin des années 1990 pour ses orchestrations riches et ses mélodies romantiques, devenant l'un des compositeurs de référence du cinéma Tamil.",
          "Son style, marqué par des arrangements soignés mêlant cordes, chœurs et sonorités contemporaines, a profondément influencé toute une génération de musique de film en Inde du Sud.",
        ],
        keyDates: [
          "1999 — Débute avec la bande originale du film Minnale, immédiatement remarquée.",
          "Années 2000 — Enchaîne les succès qui font de lui une référence du cinéma Tamil romantique.",
        ],
        latest: "A composé la musique de Kadhal Reset Repeat, comédie musicale romantique Tamil sortie en salles le 6 mars 2026.",
      },
      en: {
        tag: "Tamil composer",
        short:
          "An iconic composer in Tamil cinema since the 2000s, renowned for his romantic melodies and polished orchestrations.",
        bio: [
          "Harris Jayaraj rose to fame in the late 1990s for his rich orchestrations and romantic melodies, becoming one of the leading composers of Tamil cinema.",
          "His style, marked by polished arrangements blending strings, choirs and contemporary sounds, has deeply influenced an entire generation of South Indian film music.",
        ],
        keyDates: [
          "1999 — Debuts with the soundtrack of Minnale, immediately acclaimed.",
          "2000s — Delivers a string of hits that make him a reference of romantic Tamil cinema.",
        ],
        latest: "Composed the music for Kadhal Reset Repeat, a romantic Tamil musical comedy released in theaters on March 6, 2026.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short:
          "Ein prägender Komponist des tamilischen Kinos seit den 2000er-Jahren, bekannt für seine romantischen Melodien und sorgfältigen Orchestrierungen.",
        bio: [
          "Harris Jayaraj wurde Ende der 1990er-Jahre für seine reichhaltigen Orchestrierungen und romantischen Melodien bekannt und avancierte zu einem der führenden Komponisten des tamilischen Kinos.",
          "Sein Stil, geprägt von sorgfältigen Arrangements aus Streichern, Chören und zeitgenössischen Klängen, hat eine ganze Generation südindischer Filmmusik nachhaltig beeinflusst.",
        ],
        keyDates: [
          "1999 — Debüt mit dem sofort beachteten Soundtrack zu Minnale.",
          "2000er-Jahre — Reiht Erfolg an Erfolg und wird zur Referenz des romantischen tamilischen Kinos.",
        ],
        latest: "Komponierte die Musik zu Kadhal Reset Repeat, einer romantischen tamilischen Musikkomödie, die am 6. März 2026 in die Kinos kam.",
      },
    },
  },
  {
    slug: "yuvan-shankar-raja",
    image: "/artists/yuvan-shankar-raja.jpg",
    icon: "keys",
    color: "from-sky-600 to-sky-400",
    name: "Yuvan Shankar Raja",
    region: "Tamil",
    featured: true,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short:
          "Compositeur prolifique et polyvalent du cinéma Tamil, entre bandes originales pop, folk et musique de film, avec une large base de fans.",
        bio: [
          "Fils du compositeur Ilaiyaraaja, Yuvan Shankar Raja se forge sa propre identité musicale dès les années 1990 en explorant un large éventail de styles, du folk Tamil à la pop électronique.",
          "Réputé pour sa productivité et sa capacité à se réinventer, il reste l'un des compositeurs les plus sollicités du cinéma Tamil, avec une fanbase fidèle qui suit ses concerts avec ferveur.",
        ],
        keyDates: [
          "1997 — Débute comme compositeur à seulement 17 ans avec le film Aravindhan.",
          "2020s — Signe la bande originale du film à succès The Greatest of All Time.",
        ],
        latest:
          "Concert prévu le 4 juillet 2026 à l'Expo Ground de Pondichéry, après une tournée en Australie en 2025 (Sydney, Melbourne) et la sortie de l'album Jayam Ravi Hits le 8 septembre 2025.",
      },
      en: {
        tag: "Tamil composer",
        short:
          "A prolific and versatile Tamil cinema composer, spanning pop, folk and film soundtracks, with a wide fan base.",
        bio: [
          "Son of composer Ilaiyaraaja, Yuvan Shankar Raja forged his own musical identity as early as the 1990s, exploring a wide range of styles from Tamil folk to electronic pop.",
          "Known for his productivity and ability to reinvent himself, he remains one of the most in-demand composers in Tamil cinema, with a loyal fan base that follows his concerts with fervor.",
        ],
        keyDates: [
          "1997 — Debuts as a composer at just 17 with the film Aravindhan.",
          "2020s — Composes the soundtrack for the hit film The Greatest of All Time.",
        ],
        latest:
          "Concert planned for July 4, 2026 at the Expo Ground in Puducherry, following a 2025 tour of Australia (Sydney, Melbourne) and the release of the album Jayam Ravi Hits on September 8, 2025.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short:
          "Ein produktiver und vielseitiger Komponist des tamilischen Kinos zwischen Pop-, Folk- und Filmmusik, mit einer breiten Fangemeinde.",
        bio: [
          "Als Sohn des Komponisten Ilaiyaraaja entwickelte Yuvan Shankar Raja bereits in den 1990er-Jahren seine eigene musikalische Identität und erkundete dabei ein breites Spektrum an Stilen, von tamilischem Folk bis zu elektronischem Pop.",
          "Bekannt für seine Produktivität und seine Fähigkeit, sich immer wieder neu zu erfinden, bleibt er einer der gefragtesten Komponisten des tamilischen Kinos mit einer treuen Fangemeinde, die seine Konzerte mit Begeisterung verfolgt.",
        ],
        keyDates: [
          "1997 — Debüt als Komponist im Alter von nur 17 Jahren mit dem Film Aravindhan.",
          "2020er-Jahre — Komponiert den Soundtrack zum Erfolgsfilm The Greatest of All Time.",
        ],
        latest:
          "Konzert geplant für den 4. Juli 2026 auf dem Expo Ground in Puducherry, nach einer Australien-Tournee 2025 (Sydney, Melbourne) und der Veröffentlichung des Albums Jayam Ravi Hits am 8. September 2025.",
      },
    },
  },
  {
    slug: "ilaiyaraaja",
    image: "/artists/ilaiyaraaja.jpg",
    icon: "keys",
    color: "from-emerald-600 to-emerald-400",
    name: "Ilaiyaraaja",
    region: "Tamil",
    featured: true,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short:
          "Surnommé « l'Isai Gnani » (le sage de la musique), il a composé plus de 4 500 chansons et la musique de plus de 1 000 films en cinq décennies de carrière.",
        bio: [
          "Figure fondatrice de la musique de film Tamil moderne, Ilaiyaraaja a introduit dès la fin des années 1970 l'usage de l'orchestration occidentale mêlée aux ragas classiques indiens et aux mélodies folkloriques du Tamil Nadu.",
          "Père du compositeur Yuvan Shankar Raja, il reste actif sur scène avec de grandes tournées symphoniques rendant hommage à son répertoire, y compris à l'international.",
        ],
        keyDates: [
          "1976 — Débute comme compositeur avec le film Annakkili.",
          "Record du monde — Seul compositeur de l'histoire du cinéma à avoir signé la musique de plus de 1 000 films.",
        ],
        latest:
          "Tournée « Ilaiyaraaja Live 2026 » : concert à Chennai après une étape à Londres, puis dates au Royaume-Uni (OVO Arena Wembley le 10 juillet) et aux États-Unis (EagleBank Arena) dans le cadre du « Raja 50 USA Tour ».",
      },
      en: {
        tag: "Tamil composer",
        short:
          "Nicknamed the \"Isai Gnani\" (the sage of music), he has composed more than 4,500 songs and scored over 1,000 films across five decades of his career.",
        bio: [
          "A founding figure of modern Tamil film music, Ilaiyaraaja introduced the use of Western orchestration blended with classical Indian ragas and Tamil Nadu folk melodies as early as the late 1970s.",
          "Father of composer Yuvan Shankar Raja, he remains active on stage with major symphonic tours paying tribute to his repertoire, including internationally.",
        ],
        keyDates: [
          "1976 — Debuts as a composer with the film Annakkili.",
          "World record — The only composer in film history to have scored more than 1,000 films.",
        ],
        latest:
          "The \"Ilaiyaraaja Live 2026\" tour: a concert in Chennai following a stop in London, then dates in the UK (OVO Arena Wembley on July 10) and the US (EagleBank Arena) as part of the \"Raja 50 USA Tour\".",
      },
      de: {
        tag: "Tamilischer Komponist",
        short:
          "Genannt der „Isai Gnani\" (der Weise der Musik), komponierte er in fünf Jahrzehnten seiner Karriere mehr als 4.500 Lieder und die Musik zu über 1.000 Filmen.",
        bio: [
          "Als Gründungsfigur der modernen tamilischen Filmmusik führte Ilaiyaraaja bereits Ende der 1970er-Jahre die Verwendung westlicher Orchestrierung in Verbindung mit klassischen indischen Ragas und volkstümlichen Melodien aus Tamil Nadu ein.",
          "Als Vater des Komponisten Yuvan Shankar Raja ist er weiterhin auf der Bühne aktiv, mit großen symphonischen Tourneen, die sein Repertoire würdigen, auch international.",
        ],
        keyDates: [
          "1976 — Debüt als Komponist mit dem Film Annakkili.",
          "Weltrekord — Einziger Komponist der Filmgeschichte, der die Musik zu über 1.000 Filmen geschrieben hat.",
        ],
        latest:
          "Tournee „Ilaiyaraaja Live 2026\": Konzert in Chennai nach einer Station in London, danach Termine in Großbritannien (OVO Arena Wembley am 10. Juli) und den USA (EagleBank Arena) im Rahmen der „Raja 50 USA Tour\".",
      },
    },
  },
  {
    slug: "gv-prakash-kumar",
    image: "/artists/gv-prakash-kumar.jpg",
    icon: "note",
    color: "from-cyan-600 to-cyan-400",
    name: "G.V. Prakash Kumar",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short:
          "Neveu d'A.R. Rahman, il s'est imposé comme l'un des compositeurs les plus prolifiques du cinéma Tamil, avant de devenir aussi acteur.",
        bio: [
          "G.V. Prakash Kumar débute très jeune dans l'industrie du cinéma Tamil et se forge rapidement une identité musicale mêlant mélodies populaires et sonorités contemporaines.",
          "En parallèle de sa carrière de compositeur, il s'est également imposé comme acteur dans plusieurs films Tamil à succès.",
        ],
        keyDates: [
          "2006 — Débute comme compositeur avec le film Veyyil.",
          "Janvier 2026 — Compose la musique de Parasakthi, son 100e film en tant que compositeur.",
        ],
        latest: "A composé la musique de Parasakthi (sorti le 10 janvier 2026) et apparaît en tant qu'acteur dans Happy Raj, sorti le 27 mars 2026.",
      },
      en: {
        tag: "Tamil composer",
        short:
          "A.R. Rahman's nephew, he established himself as one of the most prolific composers in Tamil cinema before also becoming an actor.",
        bio: [
          "G.V. Prakash Kumar started very young in the Tamil film industry and quickly forged a musical identity blending popular melodies and contemporary sounds.",
          "Alongside his composing career, he has also established himself as an actor in several successful Tamil films.",
        ],
        keyDates: [
          "2006 — Debuts as a composer with the film Veyyil.",
          "January 2026 — Composes the music for Parasakthi, his 100th film as a composer.",
        ],
        latest: "Composed the music for Parasakthi (released January 10, 2026) and appears as an actor in Happy Raj, released March 27, 2026.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short:
          "Als Neffe von A.R. Rahman etablierte er sich als einer der produktivsten Komponisten des tamilischen Kinos, bevor er auch als Schauspieler tätig wurde.",
        bio: [
          "G.V. Prakash Kumar begann sehr jung in der tamilischen Filmindustrie und entwickelte rasch eine musikalische Identität, die populäre Melodien mit zeitgenössischen Klängen verbindet.",
          "Neben seiner Karriere als Komponist hat er sich auch als Schauspieler in mehreren erfolgreichen tamilischen Filmen etabliert.",
        ],
        keyDates: [
          "2006 — Debüt als Komponist mit dem Film Veyyil.",
          "Januar 2026 — Komponiert die Musik zu Parasakthi, seinem 100. Film als Komponist.",
        ],
        latest: "Komponierte die Musik zu Parasakthi (Kinostart 10. Januar 2026) und ist als Schauspieler in Happy Raj zu sehen, das am 27. März 2026 erschien.",
      },
    },
  },
  {
    slug: "santhosh-narayanan",
    image: "/artists/santhosh-narayanan.jpg",
    icon: "headphones",
    color: "from-orange-600 to-orange-400",
    name: "Santhosh Narayanan",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short:
          "Compositeur Tamil à l'univers sonore singulier, mêlant folk du Tamil Nadu, hip-hop et musique électronique indépendante.",
        bio: [
          "Repéré grâce à sa collaboration avec le réalisateur Pa. Ranjith, Santhosh Narayanan s'est distingué par des bandes originales ancrées dans les musiques populaires et folkloriques Tamil, avec une touche résolument moderne.",
          "Il collabore aussi régulièrement avec des artistes internationaux, contribuant à faire connaître la scène musicale Tamil indépendante hors d'Inde.",
        ],
        keyDates: [
          "2012 — Révélé par la bande originale du film Attakathi.",
          "Octobre 2025 — Collabore avec Ed Sheeran sur l'EP Play (The Remixes).",
        ],
        latest: "A composé la musique du film Vaa Vaathiyaar, sorti le 14 janvier 2026, et a produit le single « Vari Vari » de la chanteuse Dhee en 2026.",
      },
      en: {
        tag: "Tamil composer",
        short:
          "A Tamil composer with a singular sound world, blending Tamil Nadu folk, hip-hop and independent electronic music.",
        bio: [
          "Discovered through his collaboration with director Pa. Ranjith, Santhosh Narayanan stood out with soundtracks rooted in popular and folk Tamil music, with a distinctly modern touch.",
          "He also regularly collaborates with international artists, helping to bring the independent Tamil music scene to audiences outside India.",
        ],
        keyDates: [
          "2012 — Breakthrough with the soundtrack of Attakathi.",
          "October 2025 — Collaborates with Ed Sheeran on the EP Play (The Remixes).",
        ],
        latest: "Composed the music for the film Vaa Vaathiyaar, released January 14, 2026, and produced singer Dhee's single \"Vari Vari\" in 2026.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short:
          "Ein tamilischer Komponist mit einer eigenständigen Klangwelt, die Folk aus Tamil Nadu, Hip-Hop und unabhängige elektronische Musik verbindet.",
        bio: [
          "Durch seine Zusammenarbeit mit Regisseur Pa. Ranjith bekannt geworden, zeichnete sich Santhosh Narayanan durch Soundtracks aus, die in tamilischer Volks- und Popmusik verwurzelt sind, mit einer entschieden modernen Note.",
          "Er arbeitet zudem regelmäßig mit internationalen Künstlern zusammen und trägt so dazu bei, die unabhängige tamilische Musikszene auch außerhalb Indiens bekannt zu machen.",
        ],
        keyDates: [
          "2012 — Durchbruch mit dem Soundtrack zu Attakathi.",
          "Oktober 2025 — Zusammenarbeit mit Ed Sheeran an der EP Play (The Remixes).",
        ],
        latest: "Komponierte die Musik zum Film Vaa Vaathiyaar, der am 14. Januar 2026 erschien, und produzierte 2026 die Single „Vari Vari\" der Sängerin Dhee.",
      },
    },
  },
  {
    slug: "sid-sriram",
    image: "/artists/sid-sriram.jpg",
    icon: "mic",
    color: "from-indigo-600 to-indigo-400",
    name: "Sid Sriram",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur Tamil",
        short:
          "Chanteur né en Inde et formé aux États-Unis, il marie musique carnatique traditionnelle et pop/R&B contemporains, aussi bien dans le cinéma Tamil qu'en tant qu'artiste solo.",
        bio: [
          "Formé dès l'enfance à la musique carnatique puis élevé en Californie, Sid Sriram développe un style unique mêlant tradition indienne et influences R&B et hip-hop américaines.",
          "Très demandé comme chanteur playback dans le cinéma Tamil, il mène en parallèle une carrière solo internationale, avec des collaborations remarquées dans l'industrie musicale américaine.",
        ],
        keyDates: [
          "2012 — Débute comme chanteur playback dans le cinéma Tamil.",
          "2023 — Sort Sidharth, son premier album entièrement en anglais, chez Def Jam.",
        ],
        latest:
          "Tournée nord-américaine à l'automne 2026, avec des dates en septembre (Illinois, New Jersey, Virginie, Washington, Californie) et des concerts au Blue Note de New York et Los Angeles en novembre 2026.",
      },
      en: {
        tag: "Tamil singer",
        short:
          "A singer born in India and trained in the United States, he blends traditional Carnatic music with contemporary pop/R&B, both in Tamil cinema and as a solo artist.",
        bio: [
          "Trained in Carnatic music from childhood and raised in California, Sid Sriram developed a unique style blending Indian tradition with American R&B and hip-hop influences.",
          "Highly sought after as a playback singer in Tamil cinema, he simultaneously pursues an international solo career, with notable collaborations in the American music industry.",
        ],
        keyDates: [
          "2012 — Debuts as a playback singer in Tamil cinema.",
          "2023 — Releases Sidharth, his first fully English-language album, on Def Jam.",
        ],
        latest:
          "North American tour in fall 2026, with September dates (Illinois, New Jersey, Virginia, Washington, California) and concerts at the Blue Note in New York and Los Angeles in November 2026.",
      },
      de: {
        tag: "Tamilischer Sänger",
        short:
          "Ein in Indien geborener und in den USA ausgebildeter Sänger, der traditionelle karnatische Musik mit zeitgenössischem Pop/R&B verbindet, sowohl im tamilischen Kino als auch als Solokünstler.",
        bio: [
          "Seit seiner Kindheit in karnatischer Musik ausgebildet und in Kalifornien aufgewachsen, entwickelte Sid Sriram einen einzigartigen Stil, der indische Tradition mit amerikanischen R&B- und Hip-Hop-Einflüssen verbindet.",
          "Als gefragter Playback-Sänger im tamilischen Kino verfolgt er parallel eine internationale Solokarriere mit bemerkenswerten Kollaborationen in der amerikanischen Musikindustrie.",
        ],
        keyDates: [
          "2012 — Debüt als Playback-Sänger im tamilischen Kino.",
          "2023 — Veröffentlicht Sidharth, sein erstes vollständig englischsprachiges Album, bei Def Jam.",
        ],
        latest:
          "Nordamerika-Tournee im Herbst 2026, mit Terminen im September (Illinois, New Jersey, Virginia, Washington, Kalifornien) und Konzerten im Blue Note in New York und Los Angeles im November 2026.",
      },
    },
  },
  {
    slug: "d-imman",
    image: "/artists/d-imman.jpg",
    icon: "note",
    color: "from-lime-600 to-lime-400",
    name: "D. Imman",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short:
          "Compositeur Tamil réputé pour ses mélodies mélodieuses et ses bandes originales rurales, récompensé à plusieurs reprises pour son travail dans le cinéma Tamil.",
        bio: [
          "D. Imman se distingue par des compositions mélodiques marquées par des sonorités folkloriques et rurales, très appréciées dans le cinéma Tamil populaire.",
          "Il a composé la musique de nombreux films à succès et reste l'un des compositeurs les plus actifs de l'industrie, avec plusieurs sorties chaque année.",
        ],
        keyDates: [
          "2008 — Débute avec la bande originale du film Vil Ambu.",
          "2010s — Multiplie les récompenses pour ses bandes originales dans le cinéma Tamil.",
        ],
        latest: "A composé la musique du film Vadam, sorti le 6 mars 2026, ainsi que celle de plusieurs autres sorties Tamil de l'année.",
      },
      en: {
        tag: "Tamil composer",
        short:
          "A Tamil composer known for his melodious tunes and rural-themed soundtracks, repeatedly awarded for his work in Tamil cinema.",
        bio: [
          "D. Imman stands out with melodic compositions marked by folk and rural sounds, highly appreciated in popular Tamil cinema.",
          "He has composed the music for numerous hit films and remains one of the most active composers in the industry, with several releases every year.",
        ],
        keyDates: [
          "2008 — Debuts with the soundtrack of Vil Ambu.",
          "2010s — Wins numerous awards for his soundtracks in Tamil cinema.",
        ],
        latest: "Composed the music for the film Vadam, released March 6, 2026, as well as several other Tamil releases of the year.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short:
          "Ein tamilischer Komponist, bekannt für seine melodiösen Kompositionen und ländlich geprägten Soundtracks, mehrfach ausgezeichnet für seine Arbeit im tamilischen Kino.",
        bio: [
          "D. Imman zeichnet sich durch melodische Kompositionen mit volkstümlichen und ländlichen Klängen aus, die im populären tamilischen Kino sehr geschätzt werden.",
          "Er hat die Musik zu zahlreichen erfolgreichen Filmen komponiert und bleibt einer der aktivsten Komponisten der Branche mit mehreren Veröffentlichungen pro Jahr.",
        ],
        keyDates: [
          "2008 — Debüt mit dem Soundtrack zu Vil Ambu.",
          "2010er-Jahre — Erhält zahlreiche Auszeichnungen für seine Soundtracks im tamilischen Kino.",
        ],
        latest: "Komponierte die Musik zum Film Vadam, der am 6. März 2026 erschien, sowie zu mehreren weiteren tamilischen Filmen des Jahres.",
      },
    },
  },
  {
    slug: "hiphop-tamizha",
    image: "/artists/hiphop-tamizha.jpg",
    icon: "headphones",
    color: "from-red-600 to-red-400",
    name: "Hiphop Tamizha (Adhi)",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Duo hip-hop Tamil",
        short:
          "Duo formé d'Adhi et Jeeva, pionnier du hip-hop en langue Tamil, connu pour ses titres énergiques et ses concerts très suivis en Inde du Sud.",
        bio: [
          "Basé à Chennai, le duo Hiphop Tamizha est considéré comme le pionnier du hip-hop en Tamil, mêlant rap, pop et sonorités traditionnelles dans des morceaux devenus des hymnes populaires.",
          "Adhi, la voix et le compositeur principal du duo, s'est aussi imposé comme acteur et réalisateur dans le cinéma Tamil.",
        ],
        keyDates: [
          "2014 — Premier album qui installe le duo comme pionnier du hip-hop Tamil.",
          "Plusieurs titres devenus viraux, dont « Ethir Neechal » et « Sakkarakatti ».",
        ],
        latest: "Concert prévu le 7 mars 2026 au YMCA Ground de Chennai ; pas de tournée internationale annoncée pour le moment.",
      },
      en: {
        tag: "Tamil hip-hop duo",
        short:
          "A duo made up of Adhi and Jeeva, pioneers of Tamil-language hip-hop, known for their energetic tracks and highly attended concerts in South India.",
        bio: [
          "Based in Chennai, the duo Hiphop Tamizha is regarded as the pioneer of Tamil hip-hop, blending rap, pop and traditional sounds into tracks that have become popular anthems.",
          "Adhi, the duo's lead voice and composer, has also established himself as an actor and director in Tamil cinema.",
        ],
        keyDates: [
          "2014 — Debut album that establishes the duo as pioneers of Tamil hip-hop.",
          "Several tracks have gone viral, including \"Ethir Neechal\" and \"Sakkarakatti\".",
        ],
        latest: "Concert scheduled for March 7, 2026 at the YMCA Ground in Chennai; no international tour announced at this time.",
      },
      de: {
        tag: "Tamilisches Hip-Hop-Duo",
        short:
          "Ein Duo aus Adhi und Jeeva, Pioniere des Hip-Hop in tamilischer Sprache, bekannt für energiegeladene Songs und viel besuchte Konzerte in Südindien.",
        bio: [
          "Das in Chennai ansässige Duo Hiphop Tamizha gilt als Pionier des tamilischen Hip-Hop und verbindet Rap, Pop und traditionelle Klänge zu Songs, die zu populären Hymnen wurden.",
          "Adhi, die Hauptstimme und der Hauptkomponist des Duos, hat sich auch als Schauspieler und Regisseur im tamilischen Kino etabliert.",
        ],
        keyDates: [
          "2014 — Debütalbum, das das Duo als Pioniere des tamilischen Hip-Hop etabliert.",
          "Mehrere Songs wurden viral, darunter „Ethir Neechal\" und „Sakkarakatti\".",
        ],
        latest: "Konzert geplant für den 7. März 2026 auf dem YMCA Ground in Chennai; derzeit keine internationale Tournee angekündigt.",
      },
    },
  },
  {
    slug: "dhee",
    image: "/artists/dhee.jpg",
    icon: "mic",
    color: "from-amber-600 to-amber-400",
    name: "Dhee",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteuse Tamil",
        short:
          "Révélée par le titre viral « Rowdy Baby », elle s'impose depuis comme l'une des voix montantes de la pop Tamil contemporaine.",
        bio: [
          "Dhee se fait connaître en 2018 avec « Rowdy Baby » (film Maari 2, avec Yuvan Shankar Raja), devenu l'une des vidéos musicales indiennes les plus vues au monde.",
          "Depuis, elle poursuit une carrière solo entre pop Tamil et collaborations internationales, en explorant des sonorités plus électroniques et personnelles.",
        ],
        keyDates: [
          "2018 — Explose avec « Rowdy Baby », plus d'1,5 milliard de vues sur YouTube.",
          "Octobre 2025 — Apparaît sur l'EP Play (The Remixes) d'Ed Sheeran.",
        ],
        latest: "A sorti plusieurs nouveaux titres en 2026, dont « Like I Want You » (13 mars 2026) et le single « Vari Vari », produit par Santhosh Narayanan.",
      },
      en: {
        tag: "Tamil singer",
        short:
          "Discovered through the viral hit \"Rowdy Baby\", she has since established herself as one of the rising voices of contemporary Tamil pop.",
        bio: [
          "Dhee rose to fame in 2018 with \"Rowdy Baby\" (from the film Maari 2, with Yuvan Shankar Raja), which became one of the most-viewed Indian music videos in the world.",
          "Since then, she has pursued a solo career spanning Tamil pop and international collaborations, exploring more electronic and personal sounds.",
        ],
        keyDates: [
          "2018 — Breaks out with \"Rowdy Baby\", more than 1.5 billion views on YouTube.",
          "October 2025 — Featured on Ed Sheeran's EP Play (The Remixes).",
        ],
        latest: "Released several new tracks in 2026, including \"Like I Want You\" (March 13, 2026) and the single \"Vari Vari\", produced by Santhosh Narayanan.",
      },
      de: {
        tag: "Tamilische Sängerin",
        short:
          "Durch den viralen Hit „Rowdy Baby\" bekannt geworden, hat sie sich seitdem als eine der aufstrebenden Stimmen des zeitgenössischen tamilischen Pop etabliert.",
        bio: [
          "Dhee wurde 2018 durch „Rowdy Baby\" (aus dem Film Maari 2, mit Yuvan Shankar Raja) bekannt, das zu einem der meistgesehenen indischen Musikvideos weltweit wurde.",
          "Seitdem verfolgt sie eine Solokarriere zwischen tamilischem Pop und internationalen Kollaborationen und erkundet dabei elektronischere, persönlichere Klänge.",
        ],
        keyDates: [
          "2018 — Durchbruch mit „Rowdy Baby\", über 1,5 Milliarden Aufrufe auf YouTube.",
          "Oktober 2025 — Mitwirkung auf Ed Sheerans EP Play (The Remixes).",
        ],
        latest: "Veröffentlichte 2026 mehrere neue Songs, darunter „Like I Want You\" (13. März 2026) und die von Santhosh Narayanan produzierte Single „Vari Vari\".",
      },
    },
  },
  {
    slug: "chinmayi-sripada",
    image: "/artists/chinmayi-sripada.jpg",
    icon: "mic",
    color: "from-purple-600 to-purple-400",
    name: "Chinmayi Sripada",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteuse Tamil",
        short:
          "Chanteuse et actrice de doublage prolifique, active dans le cinéma Tamil, télougou, kannada, malayalam et hindi depuis plus de 20 ans.",
        bio: [
          "Chinmayi Sripada s'est imposée dès les années 2000 comme l'une des chanteuses de playback les plus polyvalentes du sud de l'Inde, avant de développer également une importante carrière de doublage.",
          "Elle poursuit aujourd'hui ses activités de chanteuse et de doubleuse dans plusieurs langues, tout en étant également entrepreneuse.",
        ],
        keyDates: [
          "2001 — Débute comme chanteuse playback dans le cinéma Tamil.",
          "2023 — Fait son retour au doublage dans le cinéma Tamil après plusieurs années d'absence.",
        ],
        latest: "A prêté sa voix dans le film Karuppu (2026) et a doublé pour le film télougou Dacoit: A Love Story en 2026.",
      },
      en: {
        tag: "Tamil singer",
        short:
          "A prolific singer and voice actress, active in Tamil, Telugu, Kannada, Malayalam and Hindi cinema for over 20 years.",
        bio: [
          "Chinmayi Sripada established herself in the 2000s as one of the most versatile playback singers in South India, before also building a significant career as a voice actress.",
          "She continues her work today as a singer and voice actress across several languages, while also being an entrepreneur.",
        ],
        keyDates: [
          "2001 — Debuts as a playback singer in Tamil cinema.",
          "2023 — Returns to voice dubbing in Tamil cinema after several years' absence.",
        ],
        latest: "Lent her voice to the film Karuppu (2026) and dubbed for the Telugu film Dacoit: A Love Story in 2026.",
      },
      de: {
        tag: "Tamilische Sängerin",
        short:
          "Eine produktive Sängerin und Synchronsprecherin, seit über 20 Jahren aktiv im tamilischen, telugu-, kannada-, malayalam- und hindisprachigen Kino.",
        bio: [
          "Chinmayi Sripada etablierte sich bereits in den 2000er-Jahren als eine der vielseitigsten Playback-Sängerinnen Südindiens, bevor sie auch eine bedeutende Karriere als Synchronsprecherin aufbaute.",
          "Heute ist sie weiterhin als Sängerin und Synchronsprecherin in mehreren Sprachen tätig und zudem unternehmerisch aktiv.",
        ],
        keyDates: [
          "2001 — Debüt als Playback-Sängerin im tamilischen Kino.",
          "2023 — Rückkehr zur Synchronarbeit im tamilischen Kino nach mehrjähriger Pause.",
        ],
        latest: "Lieh ihre Stimme dem Film Karuppu (2026) und synchronisierte 2026 den Telugu-Film Dacoit: A Love Story.",
      },
    },
  },
  {
    slug: "sp-balasubrahmanyam",
    image: "/artists/sp-balasubrahmanyam.jpg",
    icon: "mic",
    color: "from-teal-700 to-teal-500",
    name: "S.P. Balasubrahmanyam",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Légende du playback sud-indien",
        short: "Détenteur d'un record du monde pour le nombre de chansons enregistrées, figure la plus emblématique du playback sud-indien.",
        bio: [
          "S.P. Balasubrahmanyam a marqué le cinéma Tamil, télougou, kannada et hindi par une carrière de plus de quatre décennies, enregistrant des dizaines de milliers de chansons dans une quinzaine de langues. Il est décédé le 25 septembre 2020 des suites de la COVID-19.",
        ],
        keyDates: ["1966 — Débute sa carrière de playback.", "25 septembre 2020 — Décès."],
        latest: "Son héritage est célébré chaque année lors de nombreux concerts hommage à travers l'Inde du Sud.",
      },
      en: {
        tag: "Legend of South Indian playback singing",
        short: "Holder of a world record for the number of songs recorded, the most iconic figure in South Indian playback singing.",
        bio: [
          "S.P. Balasubrahmanyam left his mark on Tamil, Telugu, Kannada and Hindi cinema across a career of more than four decades, recording tens of thousands of songs in around fifteen languages. He passed away on September 25, 2020, from complications of COVID-19.",
        ],
        keyDates: ["1966 — Begins his playback career.", "September 25, 2020 — Passes away."],
        latest: "His legacy is celebrated every year at numerous tribute concerts across South India.",
      },
      de: {
        tag: "Legende des südindischen Playback-Gesangs",
        short: "Weltrekordhalter für die Anzahl aufgenommener Lieder und die prägendste Figur des südindischen Playback-Gesangs.",
        bio: [
          "S.P. Balasubrahmanyam prägte in einer über vier Jahrzehnte währenden Karriere das tamilische, telugu-, kannada- und hindisprachige Kino und nahm Zehntausende Lieder in rund fünfzehn Sprachen auf. Er starb am 25. September 2020 an den Folgen von COVID-19.",
        ],
        keyDates: ["1966 — Beginn seiner Playback-Karriere.", "25. September 2020 — Tod."],
        latest: "Sein Erbe wird jedes Jahr bei zahlreichen Tributkonzerten in ganz Südindien gefeiert.",
      },
    },
  },
  {
    slug: "ks-chithra",
    image: "/artists/ks-chithra.jpg",
    icon: "mic",
    color: "from-purple-700 to-purple-500",
    name: "K.S. Chithra",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteuse playback sud-indienne",
        short: "L'une des chanteuses de playback les plus récompensées du Sud de l'Inde, active depuis les années 1980.",
        bio: [
          "K.S. Chithra a marqué le cinéma Tamil, malayalam et télougou par une voix versatile, remportant de nombreux National Film Awards au cours de sa carrière.",
        ],
        keyDates: ["1979 — Débute sa carrière.", "1980s-2000s — Multiplie les National Film Awards de la meilleure chanteuse playback."],
        latest: "Reste active en concert dans le Sud de l'Inde et au sein de la diaspora.",
      },
      en: {
        tag: "South Indian playback singer",
        short: "One of the most awarded playback singers in South India, active since the 1980s.",
        bio: [
          "K.S. Chithra left her mark on Tamil, Malayalam and Telugu cinema with a versatile voice, winning numerous National Film Awards over the course of her career.",
        ],
        keyDates: ["1979 — Begins her career.", "1980s-2000s — Wins numerous National Film Awards for Best Playback Singer."],
        latest: "Remains active in concert across South India and within the diaspora.",
      },
      de: {
        tag: "Südindische Playback-Sängerin",
        short: "Eine der meistausgezeichneten Playback-Sängerinnen Südindiens, aktiv seit den 1980er-Jahren.",
        bio: [
          "K.S. Chithra prägte mit ihrer vielseitigen Stimme das tamilische, malayalam- und telugusprachige Kino und gewann im Laufe ihrer Karriere zahlreiche National Film Awards.",
        ],
        keyDates: ["1979 — Beginn ihrer Karriere.", "1980er-2000er-Jahre — Gewinnt zahlreiche National Film Awards als beste Playback-Sängerin."],
        latest: "Ist weiterhin bei Konzerten in Südindien und in der Diaspora aktiv.",
      },
    },
  },
  {
    slug: "karthik",
    image: "/artists/karthik.jpg",
    icon: "mic",
    color: "from-cyan-700 to-cyan-500",
    name: "Karthik",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur playback Tamil",
        short: "Chanteur de playback Tamil très populaire dans les années 2000-2010, connu pour ses ballades romantiques.",
        bio: [
          "Karthik s'est imposé dans le cinéma Tamil par des interprétations intenses de chansons d'amour, devenant l'une des voix masculines les plus demandées de sa génération.",
        ],
        keyDates: ["2003 — Perce dans le cinéma Tamil.", "2010s — Multiplie les tubes romantiques au cinéma."],
        latest: "Se produit régulièrement en concert en Inde du Sud et à l'international.",
      },
      en: {
        tag: "Tamil playback singer",
        short: "A Tamil playback singer very popular in the 2000s-2010s, known for his romantic ballads.",
        bio: [
          "Karthik established himself in Tamil cinema through intense performances of love songs, becoming one of the most sought-after male voices of his generation.",
        ],
        keyDates: ["2003 — Breaks through in Tamil cinema.", "2010s — Delivers a string of romantic film hits."],
        latest: "Performs regularly in concert across South India and internationally.",
      },
      de: {
        tag: "Tamilischer Playback-Sänger",
        short: "Ein in den 2000er- und 2010er-Jahren sehr populärer tamilischer Playback-Sänger, bekannt für seine romantischen Balladen.",
        bio: [
          "Karthik etablierte sich im tamilischen Kino durch intensive Interpretationen von Liebesliedern und wurde zu einer der gefragtesten männlichen Stimmen seiner Generation.",
        ],
        keyDates: ["2003 — Durchbruch im tamilischen Kino.", "2010er-Jahre — Zahlreiche romantische Filmhits."],
        latest: "Tritt regelmäßig in Südindien und international live auf.",
      },
    },
  },
  {
    slug: "vijay-yesudas",
    image: "/artists/vijay-yesudas.jpg",
    icon: "mic",
    color: "from-green-700 to-green-500",
    name: "Vijay Yesudas",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur playback sud-indien",
        short: "Fils de la légende K.J. Yesudas, il s'est forgé sa propre carrière de chanteur playback dans le Sud de l'Inde.",
        bio: [
          "Vijay Yesudas a construit une carrière remarquée dans le cinéma Tamil et malayalam, saluée par plusieurs récompenses nationales et régionales.",
        ],
        keyDates: ["2004 — Débute sa carrière de playback.", "2010s — Multiplie les récompenses régionales."],
        latest: "Se produit régulièrement en concert dans le Sud de l'Inde.",
      },
      en: {
        tag: "South Indian playback singer",
        short: "Son of legend K.J. Yesudas, he forged his own career as a playback singer in South India.",
        bio: [
          "Vijay Yesudas has built a notable career in Tamil and Malayalam cinema, recognized with several national and regional awards.",
        ],
        keyDates: ["2004 — Begins his playback career.", "2010s — Wins numerous regional awards."],
        latest: "Performs regularly in concert across South India.",
      },
      de: {
        tag: "Südindischer Playback-Sänger",
        short: "Als Sohn der Legende K.J. Yesudas hat er sich eine eigene Karriere als Playback-Sänger in Südindien aufgebaut.",
        bio: [
          "Vijay Yesudas hat sich eine bemerkenswerte Karriere im tamilischen und malayalam-sprachigen Kino aufgebaut, gewürdigt mit mehreren nationalen und regionalen Auszeichnungen.",
        ],
        keyDates: ["2004 — Beginn seiner Playback-Karriere.", "2010er-Jahre — Zahlreiche regionale Auszeichnungen."],
        latest: "Tritt regelmäßig in Südindien live auf.",
      },
    },
  },
  {
    slug: "shweta-mohan",
    image: "/artists/shweta-mohan.jpg",
    icon: "mic",
    color: "from-teal-800 to-teal-600",
    name: "Shweta Mohan",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteuse playback sud-indienne",
        short: "Chanteuse de playback active dans le cinéma Tamil et malayalam depuis le début des années 2000.",
        bio: [
          "Shweta Mohan s'est imposée comme l'une des voix féminines régulières du cinéma sud-indien, appréciée pour sa polyvalence entre mélodies douces et morceaux dansants.",
        ],
        keyDates: ["2003 — Débute sa carrière de playback.", "2010s-2020s — Multiplie les collaborations avec les grands compositeurs du Sud."],
        latest: "Se produit régulièrement en concert en Inde du Sud et au sein de la diaspora.",
      },
      en: {
        tag: "South Indian playback singer",
        short: "A playback singer active in Tamil and Malayalam cinema since the early 2000s.",
        bio: [
          "Shweta Mohan has established herself as one of the regular female voices of South Indian cinema, appreciated for her versatility between soft melodies and dance tracks.",
        ],
        keyDates: ["2003 — Begins her playback career.", "2010s-2020s — Collaborates extensively with major South Indian composers."],
        latest: "Performs regularly in concert across South India and within the diaspora.",
      },
      de: {
        tag: "Südindische Playback-Sängerin",
        short: "Eine seit den frühen 2000er-Jahren im tamilischen und malayalam-sprachigen Kino aktive Playback-Sängerin.",
        bio: [
          "Shweta Mohan hat sich als eine der festen weiblichen Stimmen des südindischen Kinos etabliert, geschätzt für ihre Vielseitigkeit zwischen sanften Melodien und tanzbaren Songs.",
        ],
        keyDates: ["2003 — Beginn ihrer Playback-Karriere.", "2010er-2020er-Jahre — Zahlreiche Kollaborationen mit bedeutenden südindischen Komponisten."],
        latest: "Tritt regelmäßig in Südindien und in der Diaspora live auf.",
      },
    },
  },
  {
    slug: "deva",
    image: "/artists/deva.jpg",
    icon: "keys",
    color: "from-amber-700 to-amber-500",
    name: "Deva",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Compositeur vétéran du cinéma Tamil, très populaire dans les années 1990-2000 pour ses mélodies folk et festives.",
        bio: [
          "Deva s'est imposé dans les années 1990 comme l'un des compositeurs les plus prolifiques du cinéma Tamil, avec un style mêlant folk du Tamil Nadu et orchestrations populaires.",
        ],
        keyDates: ["1988 — Débute sa carrière de compositeur.", "1990s-2000s — Devient l'un des compositeurs les plus demandés du cinéma Tamil populaire."],
        latest: "Reste une référence des bandes originales Tamil des années 1990-2000, régulièrement reprises en concert.",
      },
      en: {
        tag: "Tamil composer",
        short: "A veteran Tamil cinema composer, hugely popular in the 1990s-2000s for his folk and festive melodies.",
        bio: [
          "Deva established himself in the 1990s as one of the most prolific composers in Tamil cinema, with a style blending Tamil Nadu folk and popular orchestrations.",
        ],
        keyDates: ["1988 — Begins his composing career.", "1990s-2000s — Becomes one of the most sought-after composers in popular Tamil cinema."],
        latest: "Remains a reference for Tamil soundtracks of the 1990s-2000s, regularly performed at concerts.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Ein erfahrener Komponist des tamilischen Kinos, in den 1990er- und 2000er-Jahren äußerst populär für seine folkloristischen und festlichen Melodien.",
        bio: [
          "Deva etablierte sich in den 1990er-Jahren als einer der produktivsten Komponisten des tamilischen Kinos, mit einem Stil, der Folk aus Tamil Nadu mit populären Orchestrierungen verbindet.",
        ],
        keyDates: ["1988 — Beginn seiner Komponistenkarriere.", "1990er-2000er-Jahre — Wird zu einem der gefragtesten Komponisten des populären tamilischen Kinos."],
        latest: "Bleibt eine Referenz für tamilische Soundtracks der 1990er- und 2000er-Jahre, die regelmäßig bei Konzerten aufgeführt werden.",
      },
    },
  },
  {
    slug: "vidyasagar",
    image: "/artists/vidyasagar.jpg",
    icon: "keys",
    color: "from-sky-700 to-sky-500",
    name: "Vidyasagar",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Compositeur Tamil et télougou réputé pour ses mélodies romantiques soignées, actif depuis les années 1990.",
        bio: [
          "Vidyasagar s'est fait connaître par des bandes originales mélodieuses marquées par des arrangements orchestraux riches, dans le cinéma Tamil comme télougou.",
        ],
        keyDates: ["1990 — Débute sa carrière de compositeur.", "1990s-2000s — Multiplie les succès dans le cinéma Tamil romantique."],
        latest: "Continue de composer ponctuellement pour le cinéma sud-indien.",
      },
      en: {
        tag: "Tamil composer",
        short: "A Tamil and Telugu composer known for his polished romantic melodies, active since the 1990s.",
        bio: [
          "Vidyasagar became known for melodious soundtracks marked by rich orchestral arrangements, in both Tamil and Telugu cinema.",
        ],
        keyDates: ["1990 — Begins his composing career.", "1990s-2000s — Delivers numerous hits in romantic Tamil cinema."],
        latest: "Continues to compose occasionally for South Indian cinema.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Ein tamilischer und telugu-Komponist, bekannt für seine kunstvollen romantischen Melodien, aktiv seit den 1990er-Jahren.",
        bio: [
          "Vidyasagar wurde bekannt durch melodische Soundtracks mit reichhaltigen Orchesterarrangements, sowohl im tamilischen als auch im telugu-sprachigen Kino.",
        ],
        keyDates: ["1990 — Beginn seiner Komponistenkarriere.", "1990er-2000er-Jahre — Zahlreiche Erfolge im romantischen tamilischen Kino."],
        latest: "Komponiert weiterhin gelegentlich für das südindische Kino.",
      },
    },
  },
  {
    slug: "bharadwaj",
    image: "/artists/bharadwaj.jpg",
    icon: "note",
    color: "from-emerald-700 to-emerald-500",
    name: "Bharadwaj",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Compositeur Tamil connu pour ses mélodies douces et ses musiques de film à forte teneur émotionnelle.",
        bio: [
          "Bharadwaj s'est distingué dans le cinéma Tamil par des compositions mélodiques sensibles, souvent associées à des films dramatiques ou romantiques.",
        ],
        keyDates: ["1999 — Débute sa carrière de compositeur.", "2000s — Multiplie les bandes originales remarquées du cinéma Tamil."],
        latest: "Continue de composer pour le cinéma Tamil.",
      },
      en: {
        tag: "Tamil composer",
        short: "A Tamil composer known for his gentle melodies and emotionally rich film scores.",
        bio: [
          "Bharadwaj stood out in Tamil cinema with sensitive melodic compositions, often associated with dramatic or romantic films.",
        ],
        keyDates: ["1999 — Begins his composing career.", "2000s — Delivers numerous acclaimed Tamil cinema soundtracks."],
        latest: "Continues to compose for Tamil cinema.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Ein tamilischer Komponist, bekannt für sanfte Melodien und emotional intensive Filmmusik.",
        bio: [
          "Bharadwaj zeichnete sich im tamilischen Kino durch einfühlsame melodische Kompositionen aus, die oft mit Drama- oder Liebesfilmen verbunden sind.",
        ],
        keyDates: ["1999 — Beginn seiner Komponistenkarriere.", "2000er-Jahre — Zahlreiche vielbeachtete Soundtracks im tamilischen Kino."],
        latest: "Komponiert weiterhin für das tamilische Kino.",
      },
    },
  },
  {
    slug: "srikanth-deva",
    image: "/artists/srikanth-deva.jpg",
    icon: "headphones",
    color: "from-orange-700 to-orange-500",
    name: "Srikanth Deva",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Compositeur Tamil très prolifique des années 2000, connu pour ses morceaux festifs et dansants.",
        bio: [
          "Srikanth Deva s'est imposé dans les années 2000 par un rythme de production très soutenu, avec des bandes originales populaires et festives pour le cinéma Tamil commercial.",
        ],
        keyDates: ["2003 — Débute sa carrière de compositeur.", "2000s — Devient l'un des compositeurs les plus prolifiques du cinéma Tamil."],
        latest: "Continue de composer pour le cinéma Tamil.",
      },
      en: {
        tag: "Tamil composer",
        short: "A highly prolific Tamil composer of the 2000s, known for his festive, danceable tracks.",
        bio: [
          "Srikanth Deva made his mark in the 2000s with a very high output, delivering popular, festive soundtracks for commercial Tamil cinema.",
        ],
        keyDates: ["2003 — Begins his composing career.", "2000s — Becomes one of the most prolific composers in Tamil cinema."],
        latest: "Continues to compose for Tamil cinema.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Ein äußerst produktiver tamilischer Komponist der 2000er-Jahre, bekannt für seine festlichen, tanzbaren Songs.",
        bio: [
          "Srikanth Deva machte sich in den 2000er-Jahren durch ein sehr hohes Produktionstempo einen Namen und lieferte populäre, festliche Soundtracks für das kommerzielle tamilische Kino.",
        ],
        keyDates: ["2003 — Beginn seiner Komponistenkarriere.", "2000er-Jahre — Wird zu einem der produktivsten Komponisten des tamilischen Kinos."],
        latest: "Komponiert weiterhin für das tamilische Kino.",
      },
    },
  },
  {
    slug: "ghibran",
    image: "/artists/ghibran.jpg",
    icon: "keys",
    color: "from-indigo-600 to-indigo-400",
    name: "Ghibran",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Compositeur Tamil contemporain réputé pour ses bandes originales atmosphériques et son travail sur la musique de film indépendante.",
        bio: [
          "Ghibran s'est fait remarquer par des compositions subtiles et une utilisation raffinée de l'orchestration, s'imposant comme une voix singulière du cinéma Tamil contemporain.",
        ],
        keyDates: ["2011 — Révélé par la bande originale du film Vaayai Moodi Pesavum.", "2010s-2020s — Multiplie les collaborations avec le cinéma Tamil et télougou."],
        latest: "Continue de composer pour le cinéma Tamil et télougou.",
      },
      en: {
        tag: "Tamil composer",
        short: "A contemporary Tamil composer known for his atmospheric soundtracks and his work on independent film music.",
        bio: [
          "Ghibran gained attention for his subtle compositions and refined use of orchestration, establishing himself as a distinctive voice in contemporary Tamil cinema.",
        ],
        keyDates: ["2011 — Breakthrough with the soundtrack of Vaayai Moodi Pesavum.", "2010s-2020s — Numerous collaborations with Tamil and Telugu cinema."],
        latest: "Continues to compose for Tamil and Telugu cinema.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Ein zeitgenössischer tamilischer Komponist, bekannt für atmosphärische Soundtracks und seine Arbeit an unabhängiger Filmmusik.",
        bio: [
          "Ghibran wurde durch subtile Kompositionen und einen raffinierten Einsatz von Orchestrierung bekannt und etablierte sich als eigenständige Stimme im zeitgenössischen tamilischen Kino.",
        ],
        keyDates: ["2011 — Durchbruch mit dem Soundtrack zu Vaayai Moodi Pesavum.", "2010er-2020er-Jahre — Zahlreiche Kollaborationen mit dem tamilischen und telugu-sprachigen Kino."],
        latest: "Komponiert weiterhin für das tamilische und telugu-sprachige Kino.",
      },
    },
  },
  {
    slug: "sam-cs",
    image: "/artists/sam-cs.jpg",
    icon: "drum",
    color: "from-red-700 to-red-500",
    name: "Sam C.S.",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Compositeur Tamil contemporain réputé pour ses musiques de film intenses, notamment sur des films d'action à succès.",
        bio: [
          "Sam C.S. s'est imposé dans les années 2010-2020 par des musiques de film puissantes, en particulier sur des films d'action et de gangster devenus de grands succès populaires.",
        ],
        keyDates: ["2016 — Débute sa carrière de compositeur.", "2020s — Compose la musique de plusieurs films d'action Tamil à très grand succès."],
        latest: "Continue de composer pour de grandes productions Tamil.",
      },
      en: {
        tag: "Tamil composer",
        short: "A contemporary Tamil composer known for his intense film scores, particularly on hit action films.",
        bio: [
          "Sam C.S. made his mark in the 2010s-2020s with powerful film scores, particularly on action and gangster films that became major popular hits.",
        ],
        keyDates: ["2016 — Begins his composing career.", "2020s — Composes the music for several highly successful Tamil action films."],
        latest: "Continues to compose for major Tamil productions.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Ein zeitgenössischer tamilischer Komponist, bekannt für intensive Filmmusik, insbesondere zu erfolgreichen Actionfilmen.",
        bio: [
          "Sam C.S. machte sich in den 2010er- und 2020er-Jahren mit kraftvoller Filmmusik einen Namen, insbesondere zu Action- und Gangsterfilmen, die zu großen Publikumserfolgen wurden.",
        ],
        keyDates: ["2016 — Beginn seiner Komponistenkarriere.", "2020er-Jahre — Komponiert die Musik zu mehreren sehr erfolgreichen tamilischen Actionfilmen."],
        latest: "Komponiert weiterhin für große tamilische Produktionen.",
      },
    },
  },
  {
    slug: "sean-roldan",
    image: "/artists/sean-roldan.jpg",
    icon: "mic",
    color: "from-teal-700 to-teal-500",
    name: "Sean Roldan",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur/compositeur Tamil",
        short: "Auteur-compositeur-interprète Tamil à l'univers folk et indépendant, apprécié pour son authenticité.",
        bio: [
          "Sean Roldan s'est fait connaître par des compositions mêlant folk Tamil et sonorités indépendantes modernes, apportant une touche singulière au cinéma Tamil.",
        ],
        keyDates: ["2010s — Débute sa carrière de compositeur et interprète.", "2010s-2020s — Multiplie les collaborations avec le cinéma Tamil indépendant."],
        latest: "Continue de composer et de se produire en concert acoustique en Inde du Sud.",
      },
      en: {
        tag: "Tamil singer-songwriter",
        short: "A Tamil singer-songwriter with a folk and independent sound, appreciated for his authenticity.",
        bio: [
          "Sean Roldan became known for compositions blending Tamil folk and modern independent sounds, bringing a distinctive touch to Tamil cinema.",
        ],
        keyDates: ["2010s — Begins his career as a composer and performer.", "2010s-2020s — Numerous collaborations with independent Tamil cinema."],
        latest: "Continues to compose and perform acoustic concerts across South India.",
      },
      de: {
        tag: "Tamilischer Sänger/Komponist",
        short: "Ein tamilischer Singer-Songwriter mit Folk- und Indie-Prägung, geschätzt für seine Authentizität.",
        bio: [
          "Sean Roldan wurde bekannt durch Kompositionen, die tamilischen Folk mit modernen Indie-Klängen verbinden und dem tamilischen Kino eine eigenständige Note verleihen.",
        ],
        keyDates: ["2010er-Jahre — Beginn seiner Karriere als Komponist und Interpret.", "2010er-2020er-Jahre — Zahlreiche Kollaborationen mit dem unabhängigen tamilischen Kino."],
        latest: "Komponiert weiterhin und gibt akustische Konzerte in Südindien.",
      },
    },
  },
  {
    slug: "justin-prabhakaran",
    image: "/artists/justin-prabhakaran.jpg",
    icon: "keys",
    color: "from-violet-700 to-violet-500",
    name: "Justin Prabhakaran",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Compositeur Tamil révélé par le film à succès 96, connu pour ses mélodies nostalgiques.",
        bio: [
          "Justin Prabhakaran s'est fait connaître par des compositions empreintes de nostalgie et d'émotion, en particulier grâce au film 96, dont la bande originale a marqué le public Tamil.",
        ],
        keyDates: ["2018 — Révélé par la bande originale du film 96.", "2010s-2020s — Multiplie les collaborations avec le cinéma Tamil."],
        latest: "Continue de composer pour le cinéma Tamil.",
      },
      en: {
        tag: "Tamil composer",
        short: "A Tamil composer who broke through with the hit film 96, known for his nostalgic melodies.",
        bio: [
          "Justin Prabhakaran became known for compositions steeped in nostalgia and emotion, particularly through the film 96, whose soundtrack left a lasting mark on Tamil audiences.",
        ],
        keyDates: ["2018 — Breakthrough with the soundtrack of 96.", "2010s-2020s — Numerous collaborations with Tamil cinema."],
        latest: "Continues to compose for Tamil cinema.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Ein tamilischer Komponist, der mit dem Erfolgsfilm 96 bekannt wurde, geschätzt für seine nostalgischen Melodien.",
        bio: [
          "Justin Prabhakaran wurde bekannt durch von Nostalgie und Emotion geprägte Kompositionen, insbesondere durch den Film 96, dessen Soundtrack das tamilische Publikum nachhaltig berührte.",
        ],
        keyDates: ["2018 — Durchbruch mit dem Soundtrack zu 96.", "2010er-2020er-Jahre — Zahlreiche Kollaborationen mit dem tamilischen Kino."],
        latest: "Komponiert weiterhin für das tamilische Kino.",
      },
    },
  },
  {
    slug: "leon-james",
    image: "/artists/leon-james.jpg",
    icon: "drum",
    color: "from-gray-700 to-gray-500",
    name: "Leon James",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Compositeur Tamil contemporain connu pour ses musiques de film percutantes, notamment sur des films engagés.",
        bio: [
          "Leon James s'est imposé par des bandes originales puissantes accompagnant des films Tamil à forte portée sociale, ainsi que des productions d'action à grand succès.",
        ],
        keyDates: ["2010s — Débute sa carrière de compositeur.", "2020s — Compose la musique de plusieurs films Tamil remarqués."],
        latest: "Continue de composer pour de grandes productions Tamil.",
      },
      en: {
        tag: "Tamil composer",
        short: "A contemporary Tamil composer known for his powerful film scores, particularly on socially engaged films.",
        bio: [
          "Leon James made his mark with powerful soundtracks accompanying socially impactful Tamil films, as well as highly successful action productions.",
        ],
        keyDates: ["2010s — Begins his composing career.", "2020s — Composes the music for several acclaimed Tamil films."],
        latest: "Continues to compose for major Tamil productions.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Ein zeitgenössischer tamilischer Komponist, bekannt für eindringliche Filmmusik, insbesondere zu gesellschaftlich engagierten Filmen.",
        bio: [
          "Leon James machte sich mit kraftvollen Soundtracks für gesellschaftlich bedeutsame tamilische Filme sowie sehr erfolgreiche Actionproduktionen einen Namen.",
        ],
        keyDates: ["2010er-Jahre — Beginn seiner Komponistenkarriere.", "2020er-Jahre — Komponiert die Musik zu mehreren vielbeachteten tamilischen Filmen."],
        latest: "Komponiert weiterhin für große tamilische Produktionen.",
      },
    },
  },
  {
    slug: "karthik-raja",
    image: "/artists/karthik-raja.jpg",
    icon: "keys",
    color: "from-lime-700 to-lime-500",
    name: "Karthik Raja",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur Tamil",
        short: "Fils du compositeur Ilaiyaraaja et frère de Yuvan Shankar Raja, il mène sa propre carrière de compositeur dans le cinéma Tamil.",
        bio: [
          "Karthik Raja compose pour le cinéma Tamil depuis le début des années 1990, avec un style influencé par l'héritage musical familial tout en développant sa propre identité.",
        ],
        keyDates: ["1992 — Débute sa carrière de compositeur.", "1990s-2020s — Poursuit une carrière régulière dans le cinéma Tamil."],
        latest: "Continue de composer pour le cinéma Tamil.",
      },
      en: {
        tag: "Tamil composer",
        short: "Son of composer Ilaiyaraaja and brother of Yuvan Shankar Raja, he pursues his own composing career in Tamil cinema.",
        bio: [
          "Karthik Raja has been composing for Tamil cinema since the early 1990s, with a style influenced by his family's musical heritage while developing his own identity.",
        ],
        keyDates: ["1992 — Begins his composing career.", "1990s-2020s — Pursues a steady career in Tamil cinema."],
        latest: "Continues to compose for Tamil cinema.",
      },
      de: {
        tag: "Tamilischer Komponist",
        short: "Als Sohn des Komponisten Ilaiyaraaja und Bruder von Yuvan Shankar Raja verfolgt er seine eigene Komponistenkarriere im tamilischen Kino.",
        bio: [
          "Karthik Raja komponiert seit den frühen 1990er-Jahren für das tamilische Kino, mit einem Stil, der vom musikalischen Erbe seiner Familie beeinflusst ist, während er zugleich seine eigene Identität entwickelt.",
        ],
        keyDates: ["1992 — Beginn seiner Komponistenkarriere.", "1990er-2020er-Jahre — Verfolgt eine kontinuierliche Karriere im tamilischen Kino."],
        latest: "Komponiert weiterhin für das tamilische Kino.",
      },
    },
  },
  {
    slug: "premgi-amaren",
    image: "/artists/premgi-amaren.jpg",
    icon: "headphones",
    color: "from-cyan-700 to-cyan-500",
    name: "Premgi Amaren",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Compositeur/acteur Tamil",
        short: "Compositeur et acteur Tamil, connu pour ses bandes originales populaires et ses rôles comiques au cinéma.",
        bio: [
          "Premgi Amaren mène une double carrière de compositeur et d'acteur dans le cinéma Tamil, appréciée pour des morceaux festifs et des rôles souvent comiques.",
        ],
        keyDates: ["2000s — Débute sa carrière de compositeur.", "2010s-2020s — Poursuit en parallèle une carrière d'acteur remarquée."],
        latest: "Continue de composer et d'apparaître au cinéma Tamil.",
      },
      en: {
        tag: "Tamil composer/actor",
        short: "A Tamil composer and actor, known for his popular soundtracks and comedic film roles.",
        bio: [
          "Premgi Amaren pursues a dual career as composer and actor in Tamil cinema, appreciated for festive tracks and often comedic roles.",
        ],
        keyDates: ["2000s — Begins his composing career.", "2010s-2020s — Simultaneously pursues a notable acting career."],
        latest: "Continues to compose and appear in Tamil cinema.",
      },
      de: {
        tag: "Tamilischer Komponist/Schauspieler",
        short: "Ein tamilischer Komponist und Schauspieler, bekannt für populäre Soundtracks und komödiantische Filmrollen.",
        bio: [
          "Premgi Amaren verfolgt eine Doppelkarriere als Komponist und Schauspieler im tamilischen Kino, geschätzt für festliche Songs und oft komödiantische Rollen.",
        ],
        keyDates: ["2000er-Jahre — Beginn seiner Komponistenkarriere.", "2010er-2020er-Jahre — Verfolgt parallel eine bemerkenswerte Schauspielkarriere."],
        latest: "Komponiert und tritt weiterhin im tamilischen Kino auf.",
      },
    },
  },
  {
    slug: "haricharan",
    image: "/artists/haricharan.jpg",
    icon: "mic",
    color: "from-blue-700 to-blue-500",
    name: "Haricharan",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur playback Tamil",
        short: "Chanteur de playback Tamil apprécié pour ses ballades romantiques, actif depuis la fin des années 2000.",
        bio: [
          "Haricharan s'est imposé dans le cinéma Tamil par des interprétations sensibles de chansons d'amour, devenant l'une des voix masculines régulières de l'industrie.",
        ],
        keyDates: ["2008 — Perce dans le cinéma Tamil.", "2010s-2020s — Multiplie les collaborations avec les grands compositeurs Tamil."],
        latest: "Se produit régulièrement en concert en Inde du Sud et au sein de la diaspora.",
      },
      en: {
        tag: "Tamil playback singer",
        short: "A Tamil playback singer appreciated for his romantic ballads, active since the late 2000s.",
        bio: [
          "Haricharan established himself in Tamil cinema through sensitive performances of love songs, becoming one of the industry's regular male voices.",
        ],
        keyDates: ["2008 — Breaks through in Tamil cinema.", "2010s-2020s — Numerous collaborations with major Tamil composers."],
        latest: "Performs regularly in concert across South India and within the diaspora.",
      },
      de: {
        tag: "Tamilischer Playback-Sänger",
        short: "Ein tamilischer Playback-Sänger, geschätzt für seine romantischen Balladen, aktiv seit Ende der 2000er-Jahre.",
        bio: [
          "Haricharan etablierte sich im tamilischen Kino durch einfühlsame Interpretationen von Liebesliedern und wurde zu einer der festen männlichen Stimmen der Branche.",
        ],
        keyDates: ["2008 — Durchbruch im tamilischen Kino.", "2010er-2020er-Jahre — Zahlreiche Kollaborationen mit bedeutenden tamilischen Komponisten."],
        latest: "Tritt regelmäßig in Südindien und in der Diaspora live auf.",
      },
    },
  },
  {
    slug: "nakash-aziz",
    image: "/artists/nakash-aziz.jpg",
    icon: "mic",
    color: "from-zinc-600 to-zinc-400",
    name: "Nakash Aziz",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur playback Tamil",
        short: "Chanteur de playback très polyvalent, actif dans le cinéma Tamil, télougou, kannada et hindi.",
        bio: [
          "Nakash Aziz s'est imposé grâce à sa polyvalence linguistique et à son énergie vocale, devenant l'une des voix masculines les plus demandées du cinéma sud-indien pour les morceaux festifs.",
        ],
        keyDates: ["2000s — Débute sa carrière de chanteur playback.", "2010s-2020s — Multiplie les tubes dansants dans plusieurs langues."],
        latest: "Se produit régulièrement en concert en Inde du Sud et à l'international.",
      },
      en: {
        tag: "Tamil playback singer",
        short: "A highly versatile playback singer, active in Tamil, Telugu, Kannada and Hindi cinema.",
        bio: [
          "Nakash Aziz made his mark thanks to his linguistic versatility and vocal energy, becoming one of the most in-demand male voices in South Indian cinema for festive tracks.",
        ],
        keyDates: ["2000s — Begins his career as a playback singer.", "2010s-2020s — Delivers numerous dance hits across several languages."],
        latest: "Performs regularly in concert across South India and internationally.",
      },
      de: {
        tag: "Tamilischer Playback-Sänger",
        short: "Ein äußerst vielseitiger Playback-Sänger, aktiv im tamilischen, telugu-, kannada- und hindisprachigen Kino.",
        bio: [
          "Nakash Aziz machte sich durch seine sprachliche Vielseitigkeit und stimmliche Energie einen Namen und wurde zu einer der gefragtesten männlichen Stimmen des südindischen Kinos für festliche Songs.",
        ],
        keyDates: ["2000er-Jahre — Beginn seiner Karriere als Playback-Sänger.", "2010er-2020er-Jahre — Zahlreiche Tanzhits in mehreren Sprachen."],
        latest: "Tritt regelmäßig in Südindien und international live auf.",
      },
    },
  },
  {
    slug: "andrea-jeremiah",
    image: "/artists/andrea-jeremiah.jpg",
    icon: "mic",
    color: "from-cyan-800 to-cyan-600",
    name: "Andrea Jeremiah",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteuse/actrice Tamil",
        short: "Chanteuse et actrice Tamil à la voix distinctive, appréciée aussi bien au cinéma qu'en tant qu'interprète.",
        bio: [
          "Andrea Jeremiah mène une double carrière de chanteuse et d'actrice dans le cinéma Tamil, avec une voix reconnaissable utilisée sur des morceaux marquants de plusieurs bandes originales.",
        ],
        keyDates: ["2000s — Débute sa carrière de chanteuse et actrice.", "2010s-2020s — Multiplie les collaborations avec de grands compositeurs Tamil."],
        latest: "Se produit occasionnellement en concert en Inde du Sud.",
      },
      en: {
        tag: "Tamil singer/actress",
        short: "A Tamil singer and actress with a distinctive voice, appreciated both in film and as a performer.",
        bio: [
          "Andrea Jeremiah pursues a dual career as singer and actress in Tamil cinema, with a recognizable voice featured on standout tracks from several soundtracks.",
        ],
        keyDates: ["2000s — Begins her career as singer and actress.", "2010s-2020s — Numerous collaborations with major Tamil composers."],
        latest: "Performs occasionally in concert across South India.",
      },
      de: {
        tag: "Tamilische Sängerin/Schauspielerin",
        short: "Eine tamilische Sängerin und Schauspielerin mit unverwechselbarer Stimme, geschätzt sowohl im Kino als auch als Interpretin.",
        bio: [
          "Andrea Jeremiah verfolgt eine Doppelkarriere als Sängerin und Schauspielerin im tamilischen Kino, mit einer unverwechselbaren Stimme, die auf markanten Songs mehrerer Soundtracks zu hören ist.",
        ],
        keyDates: ["2000er-Jahre — Beginn ihrer Karriere als Sängerin und Schauspielerin.", "2010er-2020er-Jahre — Zahlreiche Kollaborationen mit bedeutenden tamilischen Komponisten."],
        latest: "Tritt gelegentlich in Südindien live auf.",
      },
    },
  },
  {
    slug: "arivu",
    image: "/artists/arivu.jpg",
    icon: "headphones",
    color: "from-green-700 to-green-500",
    name: "Arivu",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Rappeur/parolier Tamil",
        short: "Rappeur et parolier Tamil révélé par le titre viral « Enjoy Enjaami », figure majeure du hip-hop engagé Tamil.",
        bio: [
          "Arivu s'est fait connaître par « Enjoy Enjaami » (avec Dhee), un titre devenu viral mondialement et mêlant folk Tamil et sonorités hip-hop, porteur d'un message social fort.",
        ],
        keyDates: ["2021 — Explose avec « Enjoy Enjaami », des centaines de millions de vues sur YouTube.", "2020s — Multiplie les collaborations engagées dans la musique Tamil."],
        latest: "Continue de sortir de la musique et de se produire en concert en Inde du Sud et à l'international.",
      },
      en: {
        tag: "Tamil rapper/lyricist",
        short: "A Tamil rapper and lyricist who broke through with the viral hit \"Enjoy Enjaami\", a major figure of socially conscious Tamil hip-hop.",
        bio: [
          "Arivu became known for \"Enjoy Enjaami\" (with Dhee), a track that went viral worldwide, blending Tamil folk and hip-hop sounds with a strong social message.",
        ],
        keyDates: ["2021 — Breaks out with \"Enjoy Enjaami\", hundreds of millions of views on YouTube.", "2020s — Numerous socially engaged collaborations in Tamil music."],
        latest: "Continues to release music and perform in concert across South India and internationally.",
      },
      de: {
        tag: "Tamilischer Rapper/Texter",
        short: "Ein tamilischer Rapper und Texter, bekannt geworden durch den viralen Hit „Enjoy Enjaami\", eine zentrale Figur des gesellschaftskritischen tamilischen Hip-Hop.",
        bio: [
          "Arivu wurde bekannt durch „Enjoy Enjaami\" (mit Dhee), einen weltweit viral gegangenen Song, der tamilischen Folk mit Hip-Hop-Klängen verbindet und eine starke soziale Botschaft trägt.",
        ],
        keyDates: ["2021 — Durchbruch mit „Enjoy Enjaami\", Hunderte Millionen Aufrufe auf YouTube.", "2020er-Jahre — Zahlreiche gesellschaftlich engagierte Kollaborationen in der tamilischen Musik."],
        latest: "Veröffentlicht weiterhin Musik und tritt in Südindien sowie international live auf.",
      },
    },
  },
  {
    slug: "velmurugan",
    image: "/artists/velmurugan.jpg",
    icon: "drum",
    color: "from-yellow-700 to-yellow-500",
    name: "Velmurugan",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur folk Tamil (Gana)",
        short: "Chanteur de folk urbain Tamil (Gana), connu pour ses morceaux festifs devenus viraux.",
        bio: [
          "Velmurugan s'est imposé comme l'une des voix populaires du style Gana, folk urbain originaire de Chennai, avec des morceaux festifs largement repris lors de mariages et de fêtes.",
        ],
        keyDates: ["2010s — Perce avec des morceaux Gana devenus viraux.", "2010s-2020s — Multiplie les collaborations dans le cinéma Tamil populaire."],
        latest: "Se produit régulièrement lors d'évènements populaires en Inde du Sud.",
      },
      en: {
        tag: "Tamil folk singer (Gana)",
        short: "An urban Tamil folk (Gana) singer, known for his festive tracks that went viral.",
        bio: [
          "Velmurugan established himself as one of the popular voices of Gana, an urban folk style originating in Chennai, with festive tracks widely performed at weddings and celebrations.",
        ],
        keyDates: ["2010s — Breaks through with Gana tracks that went viral.", "2010s-2020s — Numerous collaborations in popular Tamil cinema."],
        latest: "Performs regularly at popular events across South India.",
      },
      de: {
        tag: "Tamilischer Folk-Sänger (Gana)",
        short: "Ein Sänger des urbanen tamilischen Folk-Stils (Gana), bekannt für seine viral gegangenen Festsongs.",
        bio: [
          "Velmurugan etablierte sich als eine der populären Stimmen des Gana-Stils, eines urbanen Folk-Genres aus Chennai, mit Festsongs, die bei Hochzeiten und Feiern vielfach gespielt werden.",
        ],
        keyDates: ["2010er-Jahre — Durchbruch mit viral gegangenen Gana-Songs.", "2010er-2020er-Jahre — Zahlreiche Kollaborationen im populären tamilischen Kino."],
        latest: "Tritt regelmäßig bei populären Veranstaltungen in Südindien auf.",
      },
    },
  },
  {
    slug: "senthil-ganesh",
    image: "/artists/senthil-ganesh.jpg",
    icon: "drum",
    color: "from-amber-800 to-amber-600",
    name: "Senthil Ganesh",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur folk Tamil (Gana)",
        short: "L'un des chanteurs Gana (folk urbain de Chennai) les plus populaires, connu pour ses morceaux festifs viraux.",
        bio: [
          "Senthil Ganesh s'est fait connaître par des morceaux de style Gana devenus des hymnes populaires lors des célébrations en Inde du Sud, contribuant à la reconnaissance de ce genre au cinéma.",
        ],
        keyDates: ["2010s — Perce avec des titres Gana devenus viraux.", "2010s-2020s — Multiplie les apparitions dans des bandes originales du cinéma Tamil."],
        latest: "Se produit régulièrement lors d'évènements populaires en Inde du Sud.",
      },
      en: {
        tag: "Tamil folk singer (Gana)",
        short: "One of the most popular Gana (Chennai urban folk) singers, known for his viral festive tracks.",
        bio: [
          "Senthil Ganesh became known for Gana-style tracks that became popular anthems at celebrations across South India, helping bring recognition to the genre in cinema.",
        ],
        keyDates: ["2010s — Breaks through with Gana tracks that went viral.", "2010s-2020s — Numerous appearances on Tamil cinema soundtracks."],
        latest: "Performs regularly at popular events across South India.",
      },
      de: {
        tag: "Tamilischer Folk-Sänger (Gana)",
        short: "Einer der populärsten Gana-Sänger (urbaner Folk aus Chennai), bekannt für seine viral gegangenen Festsongs.",
        bio: [
          "Senthil Ganesh wurde bekannt durch Songs im Gana-Stil, die bei Feiern in Südindien zu populären Hymnen wurden und zur Anerkennung des Genres im Kino beitrugen.",
        ],
        keyDates: ["2010er-Jahre — Durchbruch mit viral gegangenen Gana-Titeln.", "2010er-2020er-Jahre — Zahlreiche Auftritte auf Soundtracks des tamilischen Kinos."],
        latest: "Tritt regelmäßig bei populären Veranstaltungen in Südindien auf.",
      },
    },
  },
  {
    slug: "dhanush",
    image: "/artists/dhanush.jpg",
    icon: "mic",
    color: "from-slate-700 to-slate-500",
    name: "Dhanush",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Acteur/chanteur Tamil",
        short: "Acteur Tamil également chanteur, auteur du titre mondialement viral « Why This Kolaveri Di ».",
        bio: [
          "Dhanush est avant tout une star du cinéma Tamil, mais son incursion dans la chanson avec « Why This Kolaveri Di » (2011) est devenue un phénomène viral mondial, l'une des premières chansons indiennes à devenir virale à cette échelle sur internet.",
        ],
        keyDates: ["2011 — Interprète « Why This Kolaveri Di », succès viral mondial.", "2010s-2020s — Poursuit une carrière de premier plan comme acteur du cinéma Tamil."],
        latest: "Reste actif principalement comme acteur et réalisateur, avec des apparitions ponctuelles en chant.",
      },
      en: {
        tag: "Tamil actor/singer",
        short: "A Tamil actor who is also a singer, behind the globally viral hit \"Why This Kolaveri Di\".",
        bio: [
          "Dhanush is first and foremost a Tamil cinema star, but his foray into singing with \"Why This Kolaveri Di\" (2011) became a global viral phenomenon, one of the first Indian songs to go viral on the internet at this scale.",
        ],
        keyDates: ["2011 — Performs \"Why This Kolaveri Di\", a global viral hit.", "2010s-2020s — Continues a leading career as a Tamil cinema actor."],
        latest: "Remains active mainly as an actor and director, with occasional singing appearances.",
      },
      de: {
        tag: "Tamilischer Schauspieler/Sänger",
        short: "Ein tamilischer Schauspieler, der auch als Sänger tätig ist und den weltweit viral gegangenen Hit „Why This Kolaveri Di\" schuf.",
        bio: [
          "Dhanush ist in erster Linie ein Star des tamilischen Kinos, doch sein Ausflug in die Musik mit „Why This Kolaveri Di\" (2011) wurde zu einem weltweiten viralen Phänomen — eines der ersten indischen Lieder, das im Internet in diesem Ausmaß viral ging.",
        ],
        keyDates: ["2011 — Interpretiert „Why This Kolaveri Di\", weltweiter viraler Erfolg.", "2010er-2020er-Jahre — Verfolgt eine erstklassige Karriere als Schauspieler im tamilischen Kino."],
        latest: "Ist weiterhin hauptsächlich als Schauspieler und Regisseur aktiv, mit gelegentlichen Gesangsauftritten.",
      },
    },
  },
  {
    slug: "vijay-prakash",
    image: "/artists/vijay-prakash.jpg",
    icon: "mic",
    color: "from-orange-600 to-orange-400",
    name: "Vijay Prakash",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteur playback sud-indien",
        short: "Chanteur de playback très polyvalent, actif dans le cinéma Tamil, kannada, télougou et hindi.",
        bio: [
          "Vijay Prakash s'est imposé par sa polyvalence entre chant classique carnatique et morceaux populaires, devenant l'une des voix masculines les plus demandées du cinéma sud-indien.",
        ],
        keyDates: ["2000s — Débute sa carrière de chanteur playback.", "2010s-2020s — Multiplie les récompenses régionales."],
        latest: "Se produit régulièrement en concert en Inde du Sud et à l'international.",
      },
      en: {
        tag: "South Indian playback singer",
        short: "A highly versatile playback singer, active in Tamil, Kannada, Telugu and Hindi cinema.",
        bio: [
          "Vijay Prakash made his mark through his versatility between classical Carnatic singing and popular tracks, becoming one of the most in-demand male voices in South Indian cinema.",
        ],
        keyDates: ["2000s — Begins his career as a playback singer.", "2010s-2020s — Wins numerous regional awards."],
        latest: "Performs regularly in concert across South India and internationally.",
      },
      de: {
        tag: "Südindischer Playback-Sänger",
        short: "Ein äußerst vielseitiger Playback-Sänger, aktiv im tamilischen, kannada-, telugu- und hindisprachigen Kino.",
        bio: [
          "Vijay Prakash machte sich durch seine Vielseitigkeit zwischen klassischem karnatischem Gesang und populären Songs einen Namen und wurde zu einer der gefragtesten männlichen Stimmen des südindischen Kinos.",
        ],
        keyDates: ["2000er-Jahre — Beginn seiner Karriere als Playback-Sänger.", "2010er-2020er-Jahre — Zahlreiche regionale Auszeichnungen."],
        latest: "Tritt regelmäßig in Südindien und international live auf.",
      },
    },
  },
  {
    slug: "saindhavi",
    image: "/artists/saindhavi.jpg",
    icon: "mic",
    color: "from-emerald-800 to-emerald-600",
    name: "Saindhavi",
    region: "Tamil",
    featured: false,
    translations: {
      fr: {
        tag: "Chanteuse playback Tamil",
        short: "Chanteuse de playback Tamil appréciée pour sa voix douce, active depuis le milieu des années 2000.",
        bio: [
          "Saindhavi s'est imposée dans le cinéma Tamil par des interprétations délicates de chansons romantiques et folkloriques, devenant une voix féminine régulière de l'industrie.",
        ],
        keyDates: ["2006 — Débute sa carrière de playback.", "2010s-2020s — Multiplie les collaborations avec les grands compositeurs Tamil."],
        latest: "Se produit régulièrement en concert en Inde du Sud.",
      },
      en: {
        tag: "Tamil playback singer",
        short: "A Tamil playback singer appreciated for her gentle voice, active since the mid-2000s.",
        bio: [
          "Saindhavi established herself in Tamil cinema through delicate performances of romantic and folk songs, becoming a regular female voice of the industry.",
        ],
        keyDates: ["2006 — Begins her playback career.", "2010s-2020s — Numerous collaborations with major Tamil composers."],
        latest: "Performs regularly in concert across South India.",
      },
      de: {
        tag: "Tamilische Playback-Sängerin",
        short: "Eine tamilische Playback-Sängerin, geschätzt für ihre sanfte Stimme, aktiv seit Mitte der 2000er-Jahre.",
        bio: [
          "Saindhavi etablierte sich im tamilischen Kino durch einfühlsame Interpretationen romantischer und folkloristischer Lieder und wurde zu einer festen weiblichen Stimme der Branche.",
        ],
        keyDates: ["2006 — Beginn ihrer Playback-Karriere.", "2010er-2020er-Jahre — Zahlreiche Kollaborationen mit bedeutenden tamilischen Komponisten."],
        latest: "Tritt regelmäßig in Südindien live auf.",
      },
    },
  },
];
