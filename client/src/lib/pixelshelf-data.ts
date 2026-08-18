export const categories = ["Currency", "Skins", "Mods", "Guides"] as const;
export const gameFilters = ["All games", "Neon Drift", "Star Siege '86", "Ironwood Quest", "Circuit Brawl"] as const;
export const rarityFilters = ["All rarity", "Common", "Uncommon", "Rare", "Epic", "Legendary"] as const;

export type Category = (typeof categories)[number];
export type GameFilter = (typeof gameFilters)[number];
export type Rarity = Exclude<(typeof rarityFilters)[number], "All rarity">;
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
  rarity: Rarity;
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

// Public CDN assets; no preview-only /manus-storage routes are used here.
const neonDriftImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/rSurZwBdAuMnPVxI.png";
const starSiegeImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/jzjfnFcQWRiHsqZa.png";
const ironwoodImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/xjpzxmIZbLDjppHN.png";
const circuitBrawlImage = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/AhhbVSAbjKvExeUl.png";

type ProductSeed = Omit<MarketplaceProduct, "id" | "slug" | "creator" | "creatorInitials" | "delivery" | "longDescription">;

function arcadeProduct(seed: ProductSeed): MarketplaceProduct {
  return {
    ...seed,
    id: `retro-${seed.game.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${seed.category.toLowerCase()}`,
    slug: `${seed.game.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${seed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    creator: "PixelGame Arcade Lab",
    creatorInitials: "PG",
    delivery: "Local preview delivery",
    longDescription: `${seed.title} is an original fictional ${seed.category.toLowerCase()} listing for ${seed.game}. This PixelGame arcade preview makes its format, contents and price clear before a local simulated checkout. No real charge, delivery, game account, third-party title or official licence is involved.`,
  };
}

export const products: MarketplaceProduct[] = [
  arcadeProduct({ title: "Turbo Credit Stack", category: "Currency", rarity: "Uncommon", game: "Neon Drift", currency: "Turbo Credits", bundleLabel: "1,600 + 160 bonus", price: 8, description: "A bright credit stack for the next night run.", image: neonDriftImage, accent: "cyan", includes: ["1,600 Turbo Credits", "160 bonus credits", "Local delivery preview"] }),
  arcadeProduct({ title: "Chrome Comet Helmet", category: "Skins", rarity: "Epic", game: "Neon Drift", currency: "Cosmetic skin", bundleLabel: "Helmet slot · Neon rare", price: 14, description: "A chrome-and-pink cosmetic shell for the pit lane.", image: neonDriftImage, accent: "lilac", includes: ["Helmet cosmetic", "Neon rare tier", "Preview card"] }),
  arcadeProduct({ title: "Drift HUD Booster", category: "Mods", rarity: "Rare", game: "Neon Drift", currency: "Interface mod", bundleLabel: "Version 1.4 · Setup card", price: 6, description: "A fictional HUD layout pack for clearer split-second calls.", image: neonDriftImage, accent: "indigo", includes: ["HUD layout pack", "Version 1.4 label", "Setup guide preview"] }),
  arcadeProduct({ title: "Perfect Lap Field Guide", category: "Guides", rarity: "Common", game: "Neon Drift", currency: "Strategy guide", bundleLabel: "PDF style · Beginner route", price: 4, description: "A compact routebook for learning the clean line.", image: neonDriftImage, accent: "cyan", includes: ["Route notes", "Beginner checkpoints", "Guide preview"] }),
  arcadeProduct({ title: "Energy Cell Cache", category: "Currency", rarity: "Rare", game: "Star Siege '86", currency: "Sector Cells", bundleLabel: "2,400 + 240 bonus", price: 12, description: "A reserve of cells for the next sector jump.", image: starSiegeImage, accent: "violet", includes: ["2,400 Sector Cells", "240 bonus cells", "Local delivery preview"] }),
  arcadeProduct({ title: "Ion Ranger Suit", category: "Skins", rarity: "Legendary", game: "Star Siege '86", currency: "Cosmetic skin", bundleLabel: "Suit slot · Arcade epic", price: 16, description: "A luminous explorer suit with an old-school reactor glow.", image: starSiegeImage, accent: "violet", includes: ["Suit cosmetic", "Arcade epic tier", "Preview card"] }),
  arcadeProduct({ title: "Star Map Mod Kit", category: "Mods", rarity: "Epic", game: "Star Siege '86", currency: "Navigation mod", bundleLabel: "Version 2.1 · Route pins", price: 7, description: "A fictional navigation overhaul for sector planning.", image: starSiegeImage, accent: "indigo", includes: ["Map marker set", "Version 2.1 label", "Setup guide preview"] }),
  arcadeProduct({ title: "Sector Zero Routebook", category: "Guides", rarity: "Common", game: "Star Siege '86", currency: "Strategy guide", bundleLabel: "PDF style · Mid-game", price: 5, description: "A tactical handbook for calm decisions past the first jump.", image: starSiegeImage, accent: "lilac", includes: ["Sector notes", "Loadout tips", "Guide preview"] }),
  arcadeProduct({ title: "Gold Sprite Satchel", category: "Currency", rarity: "Uncommon", game: "Ironwood Quest", currency: "Sprite Gold", bundleLabel: "1,100 + 110 bonus", price: 10, description: "A golden satchel for the next forest quest.", image: ironwoodImage, accent: "cyan", includes: ["1,100 Sprite Gold", "110 bonus gold", "Local delivery preview"] }),
  arcadeProduct({ title: "Mossbound Cloak", category: "Skins", rarity: "Rare", game: "Ironwood Quest", currency: "Cosmetic skin", bundleLabel: "Cloak slot · Forest rare", price: 13, description: "A pixel-green cosmetic cloak for quiet dungeon entries.", image: ironwoodImage, accent: "lilac", includes: ["Cloak cosmetic", "Forest rare tier", "Preview card"] }),
  arcadeProduct({ title: "Quest Journal Pack", category: "Mods", rarity: "Uncommon", game: "Ironwood Quest", currency: "Journal mod", bundleLabel: "Version 1.8 · Journal tabs", price: 5, description: "A fictional quest log expansion for organised adventurers.", image: ironwoodImage, accent: "indigo", includes: ["Journal tab set", "Version 1.8 label", "Setup guide preview"] }),
  arcadeProduct({ title: "Ironwood Boss Atlas", category: "Guides", rarity: "Epic", game: "Ironwood Quest", currency: "Strategy guide", bundleLabel: "PDF style · Boss routes", price: 5, description: "A pocket atlas of the forest’s fictional boss routes.", image: ironwoodImage, accent: "violet", includes: ["Boss route cards", "Party tips", "Guide preview"] }),
  arcadeProduct({ title: "Fight Token Roll", category: "Currency", rarity: "Uncommon", game: "Circuit Brawl", currency: "Fight Tokens", bundleLabel: "1,800 + 180 bonus", price: 9, description: "An arcade roll of tokens for the next bracket.", image: circuitBrawlImage, accent: "cyan", includes: ["1,800 Fight Tokens", "180 bonus tokens", "Local delivery preview"] }),
  arcadeProduct({ title: "Pink Shock Gloves", category: "Skins", rarity: "Epic", game: "Circuit Brawl", currency: "Cosmetic skin", bundleLabel: "Glove slot · Ring rare", price: 15, description: "A vivid cosmetic glove set for the centre stage.", image: circuitBrawlImage, accent: "lilac", includes: ["Glove cosmetic", "Ring rare tier", "Preview card"] }),
  arcadeProduct({ title: "Arena Announcer Mod", category: "Mods", rarity: "Rare", game: "Circuit Brawl", currency: "Audio mod", bundleLabel: "Version 1.2 · Voice cues", price: 7, description: "A fictional announcer cue pack for local arcade bouts.", image: circuitBrawlImage, accent: "indigo", includes: ["Cue pack", "Version 1.2 label", "Setup guide preview"] }),
  arcadeProduct({ title: "Combo Notes ’88", category: "Guides", rarity: "Common", game: "Circuit Brawl", currency: "Strategy guide", bundleLabel: "PDF style · Combo drills", price: 4, description: "An 8-bit training notebook for building reliable combos.", image: circuitBrawlImage, accent: "violet", includes: ["Combo drills", "Practice routine", "Guide preview"] }),
];

export const creators: Creator[] = [
  { name: "Neon Drift", initials: "ND", productCount: 4, role: "Midnight street racing", accent: "cyan" },
  { name: "Star Siege '86", initials: "SS", productCount: 4, role: "Cabinet space opera", accent: "violet" },
  { name: "Ironwood Quest", initials: "IQ", productCount: 4, role: "Pixel fantasy quest", accent: "lilac" },
  { name: "Circuit Brawl", initials: "CB", productCount: 4, role: "Tournament fighter", accent: "indigo" },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function filterProducts(productsToFilter: MarketplaceProduct[], category: Category | "All", query: string, game: GameFilter = "All games", rarity: Rarity | "All rarity" = "All rarity") {
  const normalizedQuery = query.trim().toLowerCase();
  return productsToFilter.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesGame = game === "All games" || product.game === game;
    const matchesRarity = rarity === "All rarity" || product.rarity === rarity;
    const searchable = `${product.title} ${product.category} ${product.rarity} ${product.game} ${product.currency} ${product.bundleLabel} ${product.creator} ${product.description}`.toLowerCase();
    return matchesCategory && matchesGame && matchesRarity && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function filterAndSortProducts(productsToFilter: MarketplaceProduct[], category: Category | "All", query: string, game: GameFilter, priceRange: PriceRange, priceSort: PriceSort, rarity: Rarity | "All rarity" = "All rarity") {
  const priceMatched = filterProducts(productsToFilter, category, query, game, rarity).filter((product) => {
    if (priceRange === "budget") return product.price <= 8;
    if (priceRange === "standard") return product.price > 8 && product.price <= 14;
    if (priceRange === "premium") return product.price > 14;
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
    { id: `${product.id}:game`, label: product.game, detail: `${product.category} · ${product.title}`, type: "game" as const, productSlug: product.slug, query: product.game },
    { id: `${product.id}:currency`, label: product.category, detail: `${product.game} · ${product.title}`, type: "currency" as const, productSlug: product.slug, query: product.category },
  ]);
  const uniqueCandidates = candidates.filter((candidate, index, items) => items.findIndex((item) => item.label === candidate.label && item.type === candidate.type) === index);
  return uniqueCandidates.filter((candidate) => `${candidate.label} ${candidate.detail}`.toLowerCase().includes(normalizedQuery)).sort((left, right) => {
    const leftLabel = left.label.toLowerCase();
    const rightLabel = right.label.toLowerCase();
    const leftRank = leftLabel === normalizedQuery ? 0 : leftLabel.startsWith(normalizedQuery) ? 1 : 2;
    const rightRank = rightLabel === normalizedQuery ? 0 : rightLabel.startsWith(normalizedQuery) ? 1 : 2;
    return leftRank - rightRank || left.label.localeCompare(right.label);
  }).slice(0, limit);
}

export function formatPrice(price: number, currency: DisplayCurrency = "USD") {
  const locale = currency === "RUB" ? "ru-RU" : currency === "EUR" ? "de-DE" : "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(price * displayCurrencyRates[currency]);
}
