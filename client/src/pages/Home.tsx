import { creators, categories, filterAndSortProducts, formatPrice, gameFilters, products, type Category, type GameFilter, type MarketplaceProduct, type PriceRange, type PriceSort } from "@/lib/pixelshelf-data";
import { ArrowRight, ChevronRight, Heart, Layers3, ShieldCheck, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedCategory, getLocalizedCreatorRole, getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import SearchAutocomplete from "@/components/SearchAutocomplete";

function ProductCard({ product }: { product: MarketplaceProduct }) {
  const { addItem } = useLocalCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { locale, t } = useLanguage();
  const { currency } = useCurrency();
  const asset = getLocalizedProduct(product, locale);
  return (
    <article className={`product-card accent-${asset.accent}`}>
      <Link href={`/product/${asset.slug}`} className="product-image-wrap" aria-label={`${t.viewBundle}: ${asset.title}`}>
        <img src={asset.image} alt={`${asset.title} preview`} />
        <span className="product-category-badge">{asset.game}</span>
      </Link>
      <button className={`favourite-button ${isFavourite(product.id) ? "is-saved" : ""}`} onClick={() => toggleFavourite(product.id)} aria-label={isFavourite(product.id) ? `${t.removeSavedBundle}: ${asset.title}` : `${t.saveBundle}: ${asset.title}`} aria-pressed={isFavourite(product.id)}>
        <Heart size={17} fill={isFavourite(product.id) ? "currentColor" : "none"} />
      </button>
      <div className="product-card-copy">
        <p className="creator-small"><span>{asset.creatorInitials}</span>{asset.game}</p>
        <div className="product-title-row">
          <Link href={`/product/${asset.slug}`}><h3>{asset.title}</h3></Link>
          <span>{formatPrice(asset.price, currency)}</span>
        </div>
        <p className="product-description"><strong>{asset.bundleLabel}</strong> · {asset.description}</p>
        <div className="product-card-actions">
          <Link href={`/product/${asset.slug}`} className="view-link">{t.viewBundle} <ArrowRight size={15} /></Link>
          <button className="mini-cart-button" onClick={() => addItem(product)} aria-label={`${t.addToTopUp}: ${asset.title}`}><ShoppingBag size={16} /></button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");
  const initialCategory = categories.includes(requestedCategory as Category) ? (requestedCategory as Category) : "All";
  const [category, setCategory] = useState<Category | "All">(initialCategory);
  const [game, setGame] = useState<GameFilter>("All games");
  const [query, setQuery] = useState(params.get("search") ?? "");
  const [showSaved, setShowSaved] = useState(params.get("saved") === "true");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [priceSort, setPriceSort] = useState<PriceSort>("featured");
  const [quickWorld, setQuickWorld] = useState<GameFilter>("NovaVerse");
  const [quickProductId, setQuickProductId] = useState("product-nova-explorer");
  const { favouriteIds } = useFavourites();
  const { addItem } = useLocalCart();
  const { locale, t } = useLanguage();
  const { currency } = useCurrency();
  const visibleProducts = useMemo(() => filterAndSortProducts(products, category, query, game, priceRange, priceSort).filter((product) => !showSaved || favouriteIds.includes(product.id)), [category, favouriteIds, game, priceRange, priceSort, query, showSaved]);
  const quickWorlds = gameFilters.filter((world): world is Exclude<GameFilter, "All games"> => world !== "All games");
  const quickProducts = products.filter((product) => product.game === quickWorld);
  const quickProduct = quickProducts.find((product) => product.id === quickProductId) ?? quickProducts[0];
  const popularProducts = quickWorlds.map((world) => products.find((product) => product.game === world)).filter((product): product is MarketplaceProduct => Boolean(product));

  function browseAssets() {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseQuickWorld(world: Exclude<GameFilter, "All games">) {
    setQuickWorld(world);
    setQuickProductId(products.find((product) => product.game === world)?.id ?? "");
  }

  function openWorld(world: Exclude<GameFilter, "All games">) {
    setGame(world);
    setShowSaved(false);
    browseAssets();
  }

  function resetCatalogControls() {
    setCategory("All");
    setGame("All games");
    setPriceRange("all");
    setPriceSort("featured");
    setShowSaved(false);
    setQuery("");
  }

  return (
    <div className="loadout-home">
      <section className="hero-section loadout-hero">
        <div className="hero-grid-pattern" />
        <div className="hero-pulse pulse-one" />
        <div className="hero-pulse pulse-two" />
        <img className="loadout-hero-image" src="/manus-storage/pixelgame-arcade-loadout-hero_bdf826df.png" alt="" aria-hidden="true" />
        <div className="container loadout-hero-layout">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light"><Sparkles size={14} /> {t.heroEyebrow}</p>
            <h1>{t.heroHeading} <em>{t.heroAccent}</em></h1>
            <p className="hero-description">{t.heroDescription}</p>
            <SearchAutocomplete value={query} onChange={setQuery} onSubmit={browseAssets} onSelect={(suggestion) => { setQuery(suggestion.query); browseAssets(); }} placeholder={t.searchGames} ariaLabel={t.searchCurrencyPacks} submitLabel={t.search} />
          </div>
          <div className="hero-console-label" aria-hidden="true"><span>PG / 01</span><i /><span>LOADOUT READY</span></div>
        </div>
      </section>

      <section className="quick-loadout-section">
        <div className="container quick-loadout-shell">
          <div className="quick-loadout-intro">
            <p className="eyebrow"><Zap size={14} /> {t.loadoutEyebrow}</p>
            <h2>{t.loadoutHeading}</h2>
            <p>{t.loadoutDescription}</p>
            <span className="preview-lock"><ShieldCheck size={14} /> {t.loadoutPreview}</span>
          </div>
          <div className="quick-loadout-controls">
            <div className="quick-field">
              <span>{t.loadoutWorldLabel}</span>
              <div className="world-select-row" role="group" aria-label={t.loadoutWorldLabel}>
                {quickWorlds.map((world) => <button key={world} className={quickWorld === world ? "is-active" : ""} onClick={() => chooseQuickWorld(world)}>{world}</button>)}
              </div>
            </div>
            <label className="quick-field quick-bundle-select"><span>{t.loadoutBundleLabel}</span><select value={quickProduct?.id} onChange={(event) => setQuickProductId(event.target.value)}>{quickProducts.map((product) => <option value={product.id} key={product.id}>{getLocalizedProduct(product, locale).title} · {getLocalizedProduct(product, locale).bundleLabel}</option>)}</select></label>
            {quickProduct && <div className="quick-selection-summary"><div><strong>{getLocalizedProduct(quickProduct, locale).currency}</strong><span>{getLocalizedProduct(quickProduct, locale).bundleLabel}</span></div><b>{formatPrice(quickProduct.price, currency)}</b></div>}
            {quickProduct && <button className="button button-primary quick-loadout-cta" onClick={() => addItem(quickProduct)}><ShoppingBag size={17} /> {t.loadoutAdd} <span>{formatPrice(quickProduct.price, currency)}</span></button>}
          </div>
        </div>
      </section>

      <section className="world-directory-section container">
        <div className="section-heading world-directory-heading"><div><p className="eyebrow"><Layers3 size={14} /> {t.worldDirectoryEyebrow}</p><h2>{t.worldDirectoryHeading}</h2></div><p>{t.worldDirectoryDescription}</p></div>
        <div className="world-directory-grid">
          {creators.map((creator) => {
            const worldProduct = products.find((product) => product.game === creator.name)!;
            return <button className={`world-directory-card accent-${creator.accent}`} key={creator.name} onClick={() => openWorld(creator.name as Exclude<GameFilter, "All games">)}>
              <img src={worldProduct.image} alt="" />
              <span className="world-directory-overlay" />
              <span className="world-directory-content"><small>{getLocalizedCreatorRole(creator.role, locale)}</small><strong>{creator.name}</strong><em>{creator.productCount} {t.packs} <ArrowRight size={15} /></em></span>
            </button>;
          })}
        </div>
      </section>

      <section className="popular-loadouts-section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow">{t.popularEyebrow}</p><h2>{t.popularHeading}</h2></div><p>{t.popularDescription}</p></div>
          <div className="popular-loadout-grid">{popularProducts.map((product) => <ProductCard key={`popular-${product.id}`} product={product} />)}</div>
          <button className="button button-outline catalog-jump" onClick={browseAssets}>{t.showFullCatalog} <ArrowRight size={16} /></button>
        </div>
      </section>

      <section id="catalog" className="catalog-section container">
        <div className="section-heading">
          <div><p className="eyebrow">{t.freshDrops}</p><h2>{t.catalogHeading}</h2></div>
          <p>{t.catalogDescription}</p>
        </div>
        <div className="catalog-controls">
          <div className="catalog-filter-stack">
            <div className="filter-row game-filter-row" aria-label="Game worlds">{gameFilters.map((item) => <button key={item} className={game === item ? "is-active" : ""} onClick={() => setGame(item)}>{item === "All games" ? t.allGames : item}</button>)}</div>
            <div className="pack-type-filter"><span>{t.packType}</span><div className="filter-row">{(["All", ...categories] as const).map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item === "All" ? t.allPackTypes : getLocalizedCategory(item, locale)}</button>)}</div></div>
            <button className={`saved-filter ${showSaved ? "is-active" : ""}`} onClick={() => setShowSaved((current) => !current)} aria-pressed={showSaved}><Heart size={14} fill={showSaved ? "currentColor" : "none"} /> {showSaved ? t.showAllPacks : t.showSaved}</button>
            <div className="price-control-row"><label><span>{t.priceRange}</span><select value={priceRange} onChange={(event) => setPriceRange(event.target.value as PriceRange)}><option value="all">{t.allPrices}</option><option value="budget">{t.budgetPrice}</option><option value="standard">{t.standardPrice}</option><option value="premium">{t.premiumPrice}</option></select></label><label><span>{t.sortBy}</span><select value={priceSort} onChange={(event) => setPriceSort(event.target.value as PriceSort)}><option value="featured">{t.featuredSort}</option><option value="price-asc">{t.lowToHigh}</option><option value="price-desc">{t.highToLow}</option></select></label><button className="reset-catalog-controls" onClick={resetCatalogControls}>{t.resetFilters}</button></div>
          </div>
          <span className="result-count">{visibleProducts.length} {t.packs}</span>
        </div>
        {visibleProducts.length > 0 ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="catalog-empty"><Sparkles size={22} /><h3>{showSaved ? t.noSavedBundles : t.noPacks}</h3><p>{showSaved ? t.noSavedBundlesCopy : t.noPacksCopy}</p></div>}
      </section>

      <section className="spotlight-section" id="how-it-works"><div className="container"><div className="section-heading spotlight-heading"><div><p className="eyebrow">{t.featuredWorlds}</p><h2>{t.featuredHeading}</h2></div><button className="round-arrow" onClick={() => document.getElementById("creator-track")?.scrollBy({ left: 330, behavior: "smooth" })} aria-label="Scroll creator spotlight"><ChevronRight size={19} /></button></div><div className="creator-track" id="creator-track">{creators.map((creator) => <article className={`creator-card accent-${creator.accent}`} key={creator.name}><span className="creator-avatar">{creator.initials}</span><div><p>{getLocalizedCreatorRole(creator.role, locale)}</p><h3>{creator.name}</h3><span>{creator.productCount} {t.packs}</span></div><ArrowRight className="creator-arrow" size={18} /></article>)}</div></div></section>

      <section className="closing-section container"><div className="closing-card"><span className="closing-orbit" /><div><p className="eyebrow eyebrow-light">{t.nextRun}</p><h2>{t.closingHeading}</h2></div><button className="button button-white" onClick={browseAssets}>{t.exploreAllPacks} <ArrowRight size={17} /></button></div></section>
    </div>
  );
}
