export const categories = ["Templates", "Design Resources", "Business Tools"] as const;
export const gameFilters = ["All games", "NovaVerse", "Arcane Realms", "Neon Circuit"] as const;

export type Category = (typeof categories)[number];
export type GameFilter = (typeof gameFilters)[number];
export type PriceRange = "all" | "budget" | "standard" | "premium";
export type PriceSort = "featured" | "price-asc" | "price-desc";
export type DisplayCurrency = "USD" | "EUR" | "RUB";

export const displayCurrencyRates: Record<DisplayCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  RUB: 91,
};

export type MarketplaceProduct = {
  id: string;
  slug: string;
  title: string;
  category: Category;
  game: string;
  currency: string;
  bundleLabel: string;
  delivery: string;
  price: number;
  description: string;
  longDescription: string;
  creator: string;
  creatorInitials: string;
  image: string;
  accent: "violet" | "cyan" | "indigo" | "lilac";
  includes: string[];
};

export type Creator = {
  name: string;
  initials: string;
  productCount: number;
  role: string;
  accent: "violet" | "cyan" | "indigo" | "lilac";
};

export type SearchSuggestion = {
  id: string;
  label: string;
  detail: string;
  type: "bundle" | "game" | "currency";
  productSlug: string;
  query: string;
};

const novaImage = "/manus-storage/pixelgame-world-novaverse-v2_89f75f77.png";
const arcaneImage = "/manus-storage/pixelgame-world-arcane-v2_d0db31c9.png";
const arcadeImage = "/manus-storage/pixelgame-world-neon-v2_f2a96e53.png";

export const products: MarketplaceProduct[] = [
  {
    id: "product-nova-explorer",
    slug: "novaverse-explorer-cache",
    title: "Explorer Cache",
    category: "Templates",
    game: "NovaVerse",
    currency: "Nova Credits",
    bundleLabel: "1,200 + 120 bonus",
    delivery: "Digital credit delivery",
    price: 7,
    description: "A focused credit top-up for your next expedition.",
    longDescription:
      "Start a new run with a practical Nova Credits cache for fictional NovaVerse account top-ups. This local storefront preview demonstrates a transparent bundle, price, and delivery experience before a real commerce catalog is connected.",
    creator: "Nebula Forge",
    creatorInitials: "NF",
    image: novaImage,
    accent: "cyan",
    includes: ["1,200 Nova Credits", "120 bonus credits", "Digital delivery preview"],
  },
  {
    id: "product-nova-vanguard",
    slug: "novaverse-vanguard-vault",
    title: "Vanguard Vault",
    category: "Templates",
    game: "NovaVerse",
    currency: "Nova Credits",
    bundleLabel: "4,000 + 600 bonus",
    delivery: "Digital credit delivery",
    price: 20,
    description: "A higher-value credit vault for long-haul missions.",
    longDescription:
      "The Vanguard Vault provides a larger fictional Nova Credits bundle with a clear bonus indicator and a simple virtual-delivery handoff. It is structured for players who want one concise, high-value top-up option.",
    creator: "Nebula Forge",
    creatorInitials: "NF",
    image: novaImage,
    accent: "indigo",
    includes: ["4,000 Nova Credits", "600 bonus credits", "Digital delivery preview"],
  },
  {
    id: "product-aether-trailblazer",
    slug: "arcane-realms-trailblazer-pouch",
    title: "Trailblazer Pouch",
    category: "Design Resources",
    game: "Arcane Realms",
    currency: "Aether Coins",
    bundleLabel: "850 + 85 bonus",
    delivery: "Digital coin delivery",
    price: 6,
    description: "A compact Aether Coins bundle for the next quest.",
    longDescription:
      "Trailblazer Pouch is a fictional Arcane Realms currency bundle designed around an easy-to-read value proposition. Its local preview flow makes quantity, bonus, price, and virtual delivery expectations visible before checkout.",
    creator: "Arcane Studio",
    creatorInitials: "AS",
    image: arcaneImage,
    accent: "violet",
    includes: ["850 Aether Coins", "85 bonus coins", "Digital delivery preview"],
  },
  {
    id: "product-aether-royal",
    slug: "arcane-realms-royal-treasury",
    title: "Royal Treasury",
    category: "Design Resources",
    game: "Arcane Realms",
    currency: "Aether Coins",
    bundleLabel: "3,500 + 525 bonus",
    delivery: "Digital coin delivery",
    price: 22,
    description: "A royal coin reserve with an extra-value bonus.",
    longDescription:
      "Royal Treasury is a fictional Arcane Realms coin bundle for more substantial local top-up demonstrations. The offer highlights exactly what is included and routes the shopper through the same clear cart experience.",
    creator: "Arcane Studio",
    creatorInitials: "AS",
    image: arcaneImage,
    accent: "lilac",
    includes: ["3,500 Aether Coins", "525 bonus coins", "Digital delivery preview"],
  },
  {
    id: "product-pulse-matchday",
    slug: "neon-circuit-matchday-stack",
    title: "Matchday Stack",
    category: "Business Tools",
    game: "Neon Circuit",
    currency: "Pulse Tokens",
    bundleLabel: "1,500 + 150 bonus",
    delivery: "Digital token delivery",
    price: 9,
    description: "A bright pulse-token stack for everyday play.",
    longDescription:
      "Matchday Stack presents a fictional Neon Circuit token bundle in a fast, game-forward merchandising layout. It prioritizes an easy comparison between the main token amount, the bonus, and the listed price.",
    creator: "Neon Circuit Co.",
    creatorInitials: "NC",
    image: arcadeImage,
    accent: "cyan",
    includes: ["1,500 Pulse Tokens", "150 bonus tokens", "Digital delivery preview"],
  },
  {
    id: "product-pulse-champion",
    slug: "neon-circuit-champion-bundle",
    title: "Champion Bundle",
    category: "Business Tools",
    game: "Neon Circuit",
    currency: "Pulse Tokens",
    bundleLabel: "5,000 + 1,000 bonus",
    delivery: "Digital token delivery",
    price: 28,
    description: "A high-value token bundle for a full season of play.",
    longDescription:
      "Champion Bundle is a fictional Neon Circuit top-up option that gives the catalog a strong premium anchor. It retains the local cart and checkout simulation while making the virtual delivery context explicit.",
    creator: "Neon Circuit Co.",
    creatorInitials: "NC",
    image: arcadeImage,
    accent: "violet",
    includes: ["5,000 Pulse Tokens", "1,000 bonus tokens", "Digital delivery preview"],
  },
  {
    id: "product-nova-orbit",
    slug: "novaverse-orbit-reserve",
    title: "Orbit Reserve",
    category: "Templates",
    game: "NovaVerse",
    currency: "Nova Credits",
    bundleLabel: "8,500 + 1,700 bonus",
    delivery: "Digital credit delivery",
    price: 39,
    description: "A long-range reserve for an extended fictional campaign.",
    longDescription:
      "Orbit Reserve is the largest fictional NovaVerse credit option in the local catalogue. It makes the total, bonus, and simulated delivery context explicit before the shopper starts a local checkout.",
    creator: "Nebula Forge",
    creatorInitials: "NF",
    image: novaImage,
    accent: "indigo",
    includes: ["8,500 Nova Credits", "1,700 bonus credits", "Digital delivery preview"],
  },
  {
    id: "product-aether-moonlit",
    slug: "arcane-realms-moonlit-cache",
    title: "Moonlit Cache",
    category: "Design Resources",
    game: "Arcane Realms",
    currency: "Aether Coins",
    bundleLabel: "6,200 + 1,240 bonus",
    delivery: "Digital coin delivery",
    price: 35,
    description: "A premium coin reserve for the next fictional chapter.",
    longDescription:
      "Moonlit Cache is a premium fictional Aether Coins offer built for clear comparison. The local preview keeps its bundle amount, bonus, price, and simulated checkout expectation in one transparent path.",
    creator: "Arcane Studio",
    creatorInitials: "AS",
    image: arcaneImage,
    accent: "lilac",
    includes: ["6,200 Aether Coins", "1,240 bonus coins", "Digital delivery preview"],
  },
  {
    id: "product-pulse-overdrive",
    slug: "neon-circuit-overdrive-case",
    title: "Overdrive Case",
    category: "Business Tools",
    game: "Neon Circuit",
    currency: "Pulse Tokens",
    bundleLabel: "9,000 + 2,250 bonus",
    delivery: "Digital token delivery",
    price: 46,
    description: "A maximum charge case for a fictional arcade season.",
    longDescription:
      "Overdrive Case anchors the Neon Circuit range with an original, fictional premium bundle. Its content is clearly scoped to a local cart and simulated payment experience until a verified catalogue is connected.",
    creator: "Neon Circuit Co.",
    creatorInitials: "NC",
    image: arcadeImage,
    accent: "cyan",
    includes: ["9,000 Pulse Tokens", "2,250 bonus tokens", "Digital delivery preview"],
  },
];

export const creators: Creator[] = [
  { name: "NovaVerse", initials: "NV", productCount: 3, role: "Sci-fi frontier", accent: "cyan" },
  { name: "Arcane Realms", initials: "AR", productCount: 3, role: "Fantasy adventure", accent: "violet" },
  { name: "Neon Circuit", initials: "NC", productCount: 3, role: "Competitive arcade", accent: "indigo" },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function filterProducts(
  productsToFilter: MarketplaceProduct[],
  category: Category | "All",
  query: string,
  game: GameFilter = "All games",
) {
  const normalizedQuery = query.trim().toLowerCase();
  return productsToFilter.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesGame = game === "All games" || product.game === game;
    const searchable = `${product.title} ${product.category} ${product.game} ${product.currency} ${product.bundleLabel} ${product.creator} ${product.description}`.toLowerCase();
    return matchesCategory && matchesGame && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function filterAndSortProducts(
  productsToFilter: MarketplaceProduct[],
  category: Category | "All",
  query: string,
  game: GameFilter,
  priceRange: PriceRange,
  priceSort: PriceSort,
) {
  const priceMatched = filterProducts(productsToFilter, category, query, game).filter((product) => {
    if (priceRange === "budget") return product.price <= 10;
    if (priceRange === "standard") return product.price > 10 && product.price <= 20;
    if (priceRange === "premium") return product.price > 20;
    return true;
  });

  return [...priceMatched].sort((left, right) => {
    if (priceSort === "price-asc") return left.price - right.price;
    if (priceSort === "price-desc") return right.price - left.price;
    return productsToFilter.indexOf(left) - productsToFilter.indexOf(right);
  });
}

export function getSearchSuggestions(query: string, limit = 5): SearchSuggestion[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const candidates: SearchSuggestion[] = products.flatMap((product) => [
    { id: `${product.id}:bundle`, label: product.title, detail: `${product.game} · ${product.bundleLabel}`, type: "bundle" as const, productSlug: product.slug, query: product.title },
    { id: `${product.id}:game`, label: product.game, detail: `${product.currency} · ${product.title}`, type: "game" as const, productSlug: product.slug, query: product.game },
    { id: `${product.id}:currency`, label: product.currency, detail: `${product.game} · ${product.bundleLabel}`, type: "currency" as const, productSlug: product.slug, query: product.currency },
  ]);

  const uniqueCandidates = candidates.filter((candidate, index, items) => items.findIndex((item) => item.label === candidate.label && item.type === candidate.type) === index);
  return uniqueCandidates
    .filter((candidate) => `${candidate.label} ${candidate.detail}`.toLowerCase().includes(normalizedQuery))
    .sort((left, right) => {
      const leftLabel = left.label.toLowerCase();
      const rightLabel = right.label.toLowerCase();
      const leftRank = leftLabel === normalizedQuery ? 0 : leftLabel.startsWith(normalizedQuery) ? 1 : 2;
      const rightRank = rightLabel === normalizedQuery ? 0 : rightLabel.startsWith(normalizedQuery) ? 1 : 2;
      return leftRank - rightRank || left.label.localeCompare(right.label);
    })
    .slice(0, limit);
}

export function formatPrice(price: number, currency: DisplayCurrency = "USD") {
  const locale = currency === "RUB" ? "ru-RU" : currency === "EUR" ? "de-DE" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price * displayCurrencyRates[currency]);
}
