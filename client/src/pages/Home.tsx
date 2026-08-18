import { creators, categories, filterProducts, formatPrice, gameFilters, products, type Category, type GameFilter, type MarketplaceProduct } from "@/lib/pixelshelf-data";
import { ArrowRight, ChevronRight, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedCategory, getLocalizedCreatorRole, getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";

function ProductCard({ product }: { product: MarketplaceProduct }) {
  const { addItem } = useLocalCart();
  const { locale, t } = useLanguage();
  const asset = getLocalizedProduct(product, locale);
  return (
    <article className={`product-card accent-${asset.accent}`}>
      <Link href={`/product/${asset.slug}`} className="product-image-wrap" aria-label={`${t.viewBundle}: ${asset.title}`}>
        <img src={asset.image} alt={`${asset.title} preview`} />
        <span className="product-category-badge">{asset.game}</span>
      </Link>
      <div className="product-card-copy">
        <p className="creator-small"><span>{asset.creatorInitials}</span>{asset.game}</p>
        <div className="product-title-row">
          <Link href={`/product/${asset.slug}`}><h3>{asset.title}</h3></Link>
          <span>{formatPrice(asset.price)}</span>
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
  const visibleProducts = useMemo(() => filterProducts(products, category, query, game), [category, game, query]);
  const { locale, t } = useLanguage();

  function browseAssets() {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      <section className="hero-section">
        <div className="hero-grid-pattern" />
        <div className="hero-pulse pulse-one" />
        <div className="hero-pulse pulse-two" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light"><Sparkles size={14} /> {t.heroEyebrow}</p>
            <h1>{t.heroHeading} <em>{t.heroAccent}</em></h1>
            <p className="hero-description">{t.heroDescription}</p>
            <div className="hero-search">
              <Search size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchGames} aria-label={t.searchCurrencyPacks} />
              <button onClick={browseAssets} aria-label={t.search}>{t.search}</button>
            </div>
            <button className="button button-hero call-to-action" onClick={browseAssets}>{t.browseCurrencyPacks} <ArrowRight size={18} /></button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-disc disc-cyan" />
            <div className="art-card art-card-back"><span /></div>
            <div className="art-card art-card-front">
              <div className="art-card-icon"><Sparkles size={28} /></div>
              <span>{t.heroArtLabel}</span>
              <strong>{t.heroArtTitle}</strong>
              <div className="art-card-bars"><i /><i /><i /></div>
            </div>
            <div className="art-token token-one">⌁</div>
            <div className="art-token token-two">+</div>
          </div>
        </div>
      </section>

      <section id="catalog" className="catalog-section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.freshDrops}</p>
            <h2>{t.catalogHeading}</h2>
          </div>
          <p>{t.catalogDescription}</p>
        </div>

        <div className="catalog-controls">
          <div className="catalog-filter-stack">
            <div className="filter-row game-filter-row" aria-label="Game worlds">
              {gameFilters.map((item) => (
                <button key={item} className={game === item ? "is-active" : ""} onClick={() => setGame(item)}>{item === "All games" ? t.allGames : item}</button>
              ))}
            </div>
            <div className="pack-type-filter" aria-label="Currency pack types">
              <span>{t.packType}</span>
              <div className="filter-row">
                {(["All", ...categories] as const).map((item) => (
                  <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item === "All" ? t.allPackTypes : getLocalizedCategory(item, locale)}</button>
                ))}
              </div>
            </div>
          </div>
          <span className="result-count">{visibleProducts.length} {t.packs}</span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="catalog-empty"><Sparkles size={22} /><h3>{t.noPacks}</h3><p>{t.noPacksCopy}</p></div>
        )}
      </section>

      <section className="spotlight-section" id="how-it-works">
        <div className="container">
          <div className="section-heading spotlight-heading">
            <div>
              <p className="eyebrow">{t.featuredWorlds}</p>
              <h2>{t.featuredHeading}</h2>
            </div>
            <button className="round-arrow" onClick={() => document.getElementById("creator-track")?.scrollBy({ left: 330, behavior: "smooth" })} aria-label="Scroll creator spotlight"><ChevronRight size={19} /></button>
          </div>
          <div className="creator-track" id="creator-track">
            {creators.map((creator) => (
              <article className={`creator-card accent-${creator.accent}`} key={creator.name}>
                <span className="creator-avatar">{creator.initials}</span>
                <div><p>{getLocalizedCreatorRole(creator.role, locale)}</p><h3>{creator.name}</h3><span>{creator.productCount} {t.packs}</span></div>
                <ArrowRight className="creator-arrow" size={18} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-section container">
        <div className="closing-card">
          <span className="closing-orbit" />
          <div><p className="eyebrow eyebrow-light">{t.nextRun}</p><h2>{t.closingHeading}</h2></div>
          <button className="button button-white" onClick={browseAssets}>{t.exploreAllPacks} <ArrowRight size={17} /></button>
        </div>
      </section>
    </div>
  );
}
