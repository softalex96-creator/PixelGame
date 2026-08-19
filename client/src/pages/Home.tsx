import { categories, creators, filterAndSortProducts, formatPrice, gameFilters, products, rarityFilters, type Category, type GameFilter, type MarketplaceProduct, type PriceRange, type PriceSort, type Rarity } from "@/lib/pixelshelf-data";
import { ArrowRight, BookOpen, Gamepad2, Heart, MonitorCog, ShieldCheck, ShoppingBag, Sparkles, Wand2, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedCategory, getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { consumePendingHomeSectionState, homeSectionStateEvent, type PendingHomeSectionState } from "@/components/HomeSectionLink";
import { editorialDrops } from "@/lib/editorial-drops";

const arcadeIcons: Record<Category, typeof Zap> = { Currency: Zap, Skins: Wand2, Mods: MonitorCog, Guides: BookOpen };

function ProductCard({ product }: { product: MarketplaceProduct }) {
  const { addItem } = useLocalCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { locale } = useLanguage();
  const { currency } = useCurrency();
  const asset = getLocalizedProduct(product, locale);
  const Icon = arcadeIcons[asset.category];
  const rarityLabel: Record<Rarity, string> = locale === "ru" ? { Common: "Обычный", Uncommon: "Необычный", Rare: "Редкий", Epic: "Эпический", Legendary: "Легендарный" } : { Common: "Common", Uncommon: "Uncommon", Rare: "Rare", Epic: "Epic", Legendary: "Legendary" };
  return <article className={`product-card retro-product-card accent-${asset.accent}`}>
    <Link href={`/product/${asset.slug}`} className="product-image-wrap retro-product-image" aria-label={`Open ${asset.title}`}>
      <img src={asset.image} alt={`${asset.title} fictional ${asset.category.toLowerCase()} preview`} />
      <span className="retro-type-badge"><Icon size={13} /> {getLocalizedCategory(asset.category, locale)}</span>
      <span className={`retro-rarity-badge rarity-${asset.rarity.toLowerCase()}`}>{rarityLabel[asset.rarity]}</span>
      <span className="retro-game-stamp">{asset.game}</span>
    </Link>
    <button className={`favourite-button ${isFavourite(product.id) ? "is-saved" : ""}`} onClick={() => toggleFavourite(product.id)} aria-label={isFavourite(product.id) ? `Remove ${asset.title} from saved` : `Save ${asset.title}`} aria-pressed={isFavourite(product.id)}><Heart size={17} fill={isFavourite(product.id) ? "currentColor" : "none"} /></button>
    <div className="product-card-copy">
      <p className="creator-small"><span>{asset.creatorInitials}</span>{asset.category} / {asset.game}</p>
      <div className="product-title-row"><Link href={`/product/${asset.slug}`}><h3>{asset.title}</h3></Link><span>{formatPrice(asset.price, currency)}</span></div>
      <p className="product-description"><strong>{asset.bundleLabel}</strong> · {asset.description}</p>
      <div className="product-card-actions"><Link href={`/product/${asset.slug}`} className="view-link">Inspect item <ArrowRight size={15} /></Link><button className="mini-cart-button" onClick={() => addItem(product)} aria-label={`Add ${asset.title} to local preview cart`}><ShoppingBag size={16} /></button></div>
    </div>
  </article>;
}

export default function Home() {
  const params = new URLSearchParams(window.location.search);
  const [pendingSectionState] = useState(consumePendingHomeSectionState);
  const requestedCategory = params.get("category");
  const initialCategory = categories.includes(requestedCategory as Category) ? (requestedCategory as Category) : "All";
  const [category, setCategory] = useState<Category | "All">(initialCategory);
  const [arcadeLane, setArcadeLane] = useState<Category>(initialCategory === "All" ? "Currency" : initialCategory);
  const [game, setGame] = useState<GameFilter>("All games");
  const [query, setQuery] = useState(params.get("search") ?? pendingSectionState?.query ?? "");
  const [showSaved, setShowSaved] = useState(params.get("saved") === "true" || pendingSectionState?.showSaved === true);
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [priceSort, setPriceSort] = useState<PriceSort>("featured");
  const [rarity, setRarity] = useState<Rarity | "All rarity">("All rarity");
  const { favouriteIds, isFavourite, toggleFavourite } = useFavourites();
  const { addItem } = useLocalCart();
  const { locale } = useLanguage();
  const { currency } = useCurrency();
  useEffect(() => {
    const applyPendingState = (event: Event) => {
      const state = (event as CustomEvent<PendingHomeSectionState>).detail;
      if (typeof state?.query === "string") setQuery(state.query);
      if (state?.showSaved) setShowSaved(true);
    };
    window.addEventListener(homeSectionStateEvent, applyPendingState);
    return () => window.removeEventListener(homeSectionStateEvent, applyPendingState);
  }, []);
  const localized = locale === "ru";
  const copy = localized ? {
    heroKicker: "PIXELGAME / РЕЖИМ АРКАДЫ", hero: "Ваша следующая", accent: "находка загружена.", description: "Вымышленные игровые товары в стиле аркад 80-х: валюта, скины, моды и гайды. Только локальная демонстрация — без реальной оплаты.", heroIndex: "АРКАДНАЯ БИБЛИОТЕКА", heroStats: [{ value: "16", label: "товаров" }, { value: "4", label: "мира" }, { value: "5", label: "редкостей" }], deck: "ВСТАВЬТЕ МОНЕТУ", deckTitle: "Выберите режим витрины.", deckNote: "Каждая кнопка открывает свою линию товаров.", featured: "ГОРЯЧАЯ ПОЛКА", featuredTitle: "Выбор игрового автомата", drops: "НОВЫЕ КАРТРИДЖИ", dropsTitle: "Редакторская полка реальных игр", dropsDescription: "Три реальных релиза с разными игровыми форматами. Это редакторская подборка, а не товары PixelGame.", official: "Официальная страница", editorialNote: "Факты сверены с официальными страницами игр. Без оценок и пользовательских отзывов.", catalog: "ХРАНИЛИЩЕ КАРТРИДЖЕЙ", catalogTitle: "Весь каталог", catalogDesc: "Фильтруйте оригинальные товары по миру, типу и цене.", saved: "Сохранённое", all: "Все товары", inspect: "Открыть", add: "Добавить", local: "Локальная симуляция", how: "КАК ЭТО РАБОТАЕТ", stepTitle: "Три хода до локального заказа", footer: "PixelGame / 1986 mode / local preview only" } : {
    heroKicker: "PIXELGAME / ARCADE MODE", hero: "Your next", accent: "upgrade is loading.", description: "Fictional game goods in an 80s arcade format: currency, skins, mods and guides. Local preview only—no real payment.", heroIndex: "ARCADE LIBRARY", heroStats: [{ value: "16", label: "goods" }, { value: "4", label: "worlds" }, { value: "5", label: "rarities" }], deck: "INSERT COIN", deckTitle: "Select a storefront lane.", deckNote: "Each cabinet button opens its own item rail.", featured: "HOT SHELF", featuredTitle: "Arcade cabinet picks", drops: "NEW CARTRIDGE DROPS", dropsTitle: "Editorial shelf: real games", dropsDescription: "Three real releases with different play formats. This is an editorial selection, not PixelGame merchandise.", official: "Official site", editorialNote: "Facts are checked against official game pages. No scores or user reviews.", catalog: "CARTRIDGE VAULT", catalogTitle: "Browse the full vault", catalogDesc: "Filter original goods by world, type and price.", saved: "Saved items", all: "All items", inspect: "Inspect item", add: "Add to preview", local: "Local preview only", how: "HOW THE ARCADE WORKS", stepTitle: "Three moves to a local order", footer: "PixelGame / 1986 mode / local preview only" };
  const visibleProducts = useMemo(() => filterAndSortProducts(products, category, query, game, priceRange, priceSort, rarity).filter((product) => !showSaved || favouriteIds.includes(product.id)), [category, favouriteIds, game, priceRange, priceSort, query, rarity, showSaved]);
  const activeLaneProducts = products.filter((product) => product.category === arcadeLane);
  const featuredProducts = activeLaneProducts.slice(0, 3);

  function browseCatalog(nextCategory: Category | "All" = category) { setCategory(nextCategory); setShowSaved(false); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }
  function chooseLane(lane: Category) { setArcadeLane(lane); setCategory(lane); setShowSaved(false); }
  function resetControls() { setCategory("All"); setGame("All games"); setRarity("All rarity"); setPriceRange("all"); setPriceSort("featured"); setShowSaved(false); setQuery(""); }

  return <div className="retro-home">
    <section className="retro-hero">
      <div className="retro-scanlines" aria-hidden="true" />
      <div className="retro-grid-floor" aria-hidden="true" />
      <img className="retro-hero-art" src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663899529266/oWVWGFhAlxuRGpau.png" alt="" aria-hidden="true" />
      <div className="container retro-hero-layout">
        <div className="retro-hero-copy"><p className="retro-kicker"><Gamepad2 size={15} /> {copy.heroKicker}</p><h1>{copy.hero} <em>{copy.accent}</em></h1><p>{copy.description}</p><SearchAutocomplete value={query} onChange={setQuery} onSubmit={() => browseCatalog("All")} onSelect={(suggestion) => { setQuery(suggestion.query); browseCatalog("All"); }} placeholder={localized ? "Ищите валюту, скин, мод или гайд" : "Search currency, skins, mods or guides"} ariaLabel={localized ? "Поиск по хранилищу" : "Search the vault"} submitLabel={localized ? "Найти" : "Search"} /></div>
        <aside className="retro-hero-index" aria-label={copy.local}><div className="retro-hero-index-heading"><span>{copy.heroIndex}</span><b>PG/86</b></div><div className="retro-hero-stats">{copy.heroStats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><small>{stat.label}</small></div>)}</div><p><ShieldCheck size={14} /> {copy.local}</p></aside>
      </div>
    </section>

    <section className="arcade-deck-section"><div className="container arcade-deck"><div className="arcade-deck-intro"><p className="retro-kicker"><Sparkles size={14} /> {copy.deck}</p><h2>{copy.deckTitle}</h2><p>{copy.deckNote}</p><span><ShieldCheck size={14} /> {copy.local}</span></div><div className="arcade-lane-buttons" role="tablist" aria-label={copy.deckTitle}>{categories.map((lane) => { const Icon = arcadeIcons[lane]; return <button role="tab" aria-selected={arcadeLane === lane} className={`arcade-lane-button lane-${lane.toLowerCase()} ${arcadeLane === lane ? "is-active" : ""}`} key={lane} onClick={() => chooseLane(lane)}><Icon size={22} /><strong>{getLocalizedCategory(lane, locale)}</strong><small>{lane === "Currency" ? localized ? "Пополнения" : "Top-ups" : lane === "Skins" ? localized ? "Косметика" : "Cosmetics" : lane === "Mods" ? localized ? "Мод-паки" : "Mod packs" : localized ? "Маршруты" : "Routes"}</small></button>; })}</div><div className="arcade-lane-now"><span>{localized ? "АКТИВНЫЙ РЕЖИМ" : "ACTIVE LANE"}</span><strong>{getLocalizedCategory(arcadeLane, locale)}</strong><button onClick={() => browseCatalog(arcadeLane)}>{localized ? "Смотреть товары" : "View items"} <ArrowRight size={15} /></button></div></div></section>

    <section className="retro-featured-section container"><div className="retro-section-heading"><div><p className="retro-kicker">{copy.featured}</p><h2>{copy.featuredTitle}</h2></div><button className="retro-link-button" onClick={() => browseCatalog(arcadeLane)}>{localized ? "Открыть полку" : "Open shelf"} <ArrowRight size={16} /></button></div><div className="retro-featured-grid">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>

    <section className="editorial-drop-section" aria-labelledby="editorial-drops-title"><div className="container"><div className="editorial-drop-heading"><div><p className="retro-kicker"><Sparkles size={14} /> {copy.drops}</p><h2 id="editorial-drops-title">{copy.dropsTitle}</h2><p>{copy.dropsDescription}</p></div><span className="editorial-drop-stamp">EDITORIAL / 03</span></div><div className="editorial-drop-grid">{editorialDrops.map((drop, index) => { const localizedDrop = drop.copy[locale]; return <article className={`editorial-drop-card drop-${drop.tone}`} key={drop.id}><div className="editorial-drop-visual" aria-hidden="true"><span>DROP/{String(index + 1).padStart(2, "0")}</span><strong>{drop.code}</strong><i /><em>{drop.format}</em></div><div className="editorial-drop-copy"><p>{localizedDrop.label}</p><h3>{drop.title}</h3><span>{drop.format}</span><p className="editorial-drop-description">{localizedDrop.description}</p><a href={drop.officialUrl} target="_blank" rel="noreferrer" aria-label={`${copy.official}: ${drop.title}`}>{copy.official} <ArrowRight size={15} /></a></div></article>; })}</div><p className="editorial-drop-note"><ShieldCheck size={15} /> {copy.editorialNote}</p></div></section>

    <section id="catalog" className="retro-catalog-section container"><div className="retro-section-heading"><div><p className="retro-kicker">{copy.catalog}</p><h2>{copy.catalogTitle}</h2></div><p>{copy.catalogDesc}</p></div><div className="retro-catalog-controls"><div className="retro-filter-block"><span>{localized ? "МИР" : "WORLD"}</span><div className="filter-row game-filter-row">{gameFilters.map((item) => <button key={item} className={game === item ? "is-active" : ""} onClick={() => setGame(item)}>{item === "All games" ? localized ? "Все" : "All" : item}</button>)}</div></div><div className="retro-filter-block"><span>{localized ? "ТИП" : "TYPE"}</span><div className="filter-row">{(["All", ...categories] as const).map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item === "All" ? copy.all : getLocalizedCategory(item, locale)}</button>)}</div></div><div className="retro-filter-block"><span>{localized ? "РЕДКОСТЬ" : "RARITY"}</span><div className="filter-row rarity-filter-row">{rarityFilters.map((item) => <button key={item} className={`${rarity === item ? "is-active" : ""} rarity-control-${item.toLowerCase().replace(" ", "-")}`} onClick={() => setRarity(item)}>{item === "All rarity" ? localized ? "Все" : "All" : localized ? ({ Common: "Обыч.", Uncommon: "Необыч.", Rare: "Редкий", Epic: "Эпич.", Legendary: "Легенд." } as Record<Rarity, string>)[item] : item}</button>)}</div></div><div className="retro-filter-block retro-filter-actions"><button className={`saved-filter ${showSaved ? "is-active" : ""}`} onClick={() => setShowSaved((current) => !current)}><Heart size={14} fill={showSaved ? "currentColor" : "none"} /> {copy.saved}</button><label><span>{localized ? "ЦЕНА" : "PRICE"}</span><select value={priceRange} onChange={(event) => setPriceRange(event.target.value as PriceRange)}><option value="all">{localized ? "Любая" : "Any"}</option><option value="budget">{localized ? "До $8" : "Up to $8"}</option><option value="standard">{localized ? "$9–14" : "$9–14"}</option><option value="premium">{localized ? "От $15" : "$15+"}</option></select></label><label><span>{localized ? "СОРТ." : "SORT"}</span><select value={priceSort} onChange={(event) => setPriceSort(event.target.value as PriceSort)}><option value="featured">{localized ? "Выбор" : "Featured"}</option><option value="price-asc">{localized ? "Дешевле" : "Low to high"}</option><option value="price-desc">{localized ? "Дороже" : "High to low"}</option></select></label><button className="reset-catalog-controls" onClick={resetControls}>{localized ? "Сброс" : "Reset"}</button></div></div><div className="retro-result-line"><span>{visibleProducts.length} {localized ? "товаров в автомате" : "items in the cabinet"}</span></div>{visibleProducts.length ? <div className="product-grid retro-product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="catalog-empty"><Sparkles size={22} /><h3>{localized ? "В этой ячейке пока пусто" : "This cabinet slot is empty"}</h3><p>{localized ? "Сбросьте фильтры или попробуйте другой мир." : "Reset filters or choose another world."}</p></div>}</section>

    <section id="how-it-works" className="retro-how-section"><div className="container"><div className="retro-section-heading"><div><p className="retro-kicker">{copy.how}</p><h2>{copy.stepTitle}</h2></div></div><div className="retro-steps"><article><b>01</b><h3>{localized ? "Выберите режим" : "Choose a lane"}</h3><p>{localized ? "Валюта, скины, моды или гайды — всё разложено по отдельным слотам." : "Currency, skins, mods and guides each keep a separate arcade slot."}</p></article><article><b>02</b><h3>{localized ? "Проверьте картридж" : "Inspect the cartridge"}</h3><p>{localized ? "Карточка показывает тип, мир, формат и цену до добавления в корзину." : "Every card shows its type, world, format and price before it reaches cart."}</p></article><article><b>03</b><h3>{localized ? "Оформите локально" : "Checkout locally"}</h3><p>{localized ? "Корзина и заказ работают только как прозрачная симуляция." : "Cart and checkout remain a transparent local simulation."}</p></article></div></div></section>
  </div>;
}
