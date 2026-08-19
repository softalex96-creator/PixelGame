export type EditorialDropLocale = "en" | "ru";

export type EditorialDrop = {
  id: "hades-ii" | "split-fiction" | "expedition-33";
  title: string;
  code: string;
  tone: "ember" | "signal" | "lumen";
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
