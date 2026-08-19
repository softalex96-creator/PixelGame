export type EditorialDropLocale = "en" | "ru";

export type EditorialDropTone = "ember" | "signal" | "lumen" | "amber" | "cobalt" | "forest";

export type EditorialDrop = {
  id: string;
  title: string;
  code: string;
  tone: EditorialDropTone;
  format: string;
  officialUrl: string;
  sourceUrl: string;
  copy: Record<EditorialDropLocale, { label: string; description: string }>;
};

export const editorialDrops: EditorialDrop[] = [
  {
    id: "hades-ii",
    title: "Hades II",
    code: "II",
    tone: "ember",
    format: "Rogue-like / mythic action",
    officialUrl: "https://www.supergiantgames.com/games/hades-ii/",
    sourceUrl: "https://www.supergiantgames.com/games/hades-ii/",
    copy: {
      en: { label: "Beyond the Underworld", description: "A rogue-like dungeon crawler sequel where dark sorcery meets the Titan of Time." },
      ru: { label: "За пределами Подземного мира", description: "Сиквел rogue-like dungeon crawler: тёмная магия против Titan of Time." },
    },
  },
  {
    id: "split-fiction",
    title: "Split Fiction",
    code: "SF",
    tone: "signal",
    format: "Two-player / co-op adventure",
    officialUrl: "https://www.ea.com/games/split-fiction",
    sourceUrl: "https://www.ea.com/games/split-fiction",
    copy: {
      en: { label: "Built for two players", description: "A split-screen co-op adventure that swaps between sci-fi and fantasy worlds." },
      ru: { label: "Создана для двоих", description: "Split-screen кооператив, который переключается между мирами sci-fi и фэнтези." },
    },
  },
  {
    id: "expedition-33",
    title: "Clair Obscur: Expedition 33",
    code: "E33",
    tone: "lumen",
    format: "Turn-based RPG / real-time mechanics",
    officialUrl: "https://www.expedition33.com/",
    sourceUrl: "https://www.expedition33.com/",
    copy: {
      en: { label: "Belle Époque expedition", description: "A turn-based RPG with real-time mechanics set in a world inspired by Belle Époque France." },
      ru: { label: "Экспедиция Belle Époque", description: "Пошаговая RPG с механиками в реальном времени, вдохновлённая Belle Époque France." },
    },
  },
];

export const retroClassics: EditorialDrop[] = [
  {
    id: "tetris",
    title: "Tetris",
    code: "T",
    tone: "amber",
    format: "Puzzle / 1984",
    officialUrl: "https://tetris.com/",
    sourceUrl: "https://tetris.com/",
    copy: {
      en: { label: "Block logic in motion", description: "The official Tetris site identifies the 1984 puzzle game and its Tetrimino-based play." },
      ru: { label: "Логика блоков в движении", description: "Официальный сайт Tetris указывает на puzzle game 1984 года и игру с Tetriminos." },
    },
  },
  {
    id: "pac-man",
    title: "PAC-MAN",
    code: "PM",
    tone: "cobalt",
    format: "Maze / 1980",
    officialUrl: "https://www.pacman.com/en/history/",
    sourceUrl: "https://www.pacman.com/en/history/",
    copy: {
      en: { label: "Maze rules, clear inputs", description: "The official history records PAC-MAN’s 1980 debut and the series’ maze-and-dot play rules." },
      ru: { label: "Лабиринт и ясные правила", description: "Официальная история отмечает дебют PAC-MAN в 1980 году и правила прохождения лабиринта с точками." },
    },
  },
  {
    id: "legend-of-zelda",
    title: "The Legend of Zelda",
    code: "Z",
    tone: "forest",
    format: "Adventure / Hyrule",
    officialUrl: "https://zelda.nintendo.com/",
    sourceUrl: "https://zelda.nintendo.com/",
    copy: {
      en: { label: "A journey through Hyrule", description: "Nintendo’s official series home frames Hyrule’s history around the Triforce and its long-running adventure." },
      ru: { label: "Путешествие по Hyrule", description: "Официальный сайт Nintendo связывает историю Hyrule с Triforce и классическим приключенческим форматом серии." },
    },
  },
];
