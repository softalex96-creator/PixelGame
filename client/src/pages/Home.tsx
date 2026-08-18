import { creators, categories, filterProducts, formatPrice, gameFilters, products, type Category, type GameFilter, type MarketplaceProduct } from "@/lib/pixelshelf-data";
import { ArrowRight, ChevronRight, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useLocalCart } from "@/contexts/LocalCartContext";

function ProductCard({ product }: { product: MarketplaceProduct }) {
  const { addItem } = useLocalCart();
  return (
    <article className={`product-card accent-${product.accent}`}>
      <Link href={`/product/${product.slug}`} className="product-image-wrap" aria-label={`View ${product.title}`}>
        <img src={product.image} alt={`${product.title} preview`} />
        <span className="product-category-badge">{product.game}</span>
      </Link>
      <div className="product-card-copy">
        <p className="creator-small"><span>{product.creatorInitials}</span>{product.game}</p>
        <div className="product-title-row">
          <Link href={`/product/${product.slug}`}><h3>{product.title}</h3></Link>
          <span>{formatPrice(product.price)}</span>
        </div>
        <p className="product-description"><strong>{product.bundleLabel}</strong> · {product.description}</p>
        <div className="product-card-actions">
          <Link href={`/product/${product.slug}`} className="view-link">View bundle <ArrowRight size={15} /></Link>
          <button className="mini-cart-button" onClick={() => addItem(product)} aria-label={`Add ${product.title} to cart`}><ShoppingBag size={16} /></button>
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
            <p className="eyebrow eyebrow-light"><Sparkles size={14} /> Virtual currency, ready for the next run</p>
            <h1>Power up your <em>next play.</em></h1>
            <p className="hero-description">Browse original game-currency packs with clear bonus values, instant local cart updates, and a streamlined top-up flow.</p>
            <div className="hero-search">
              <Search size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games, currencies, or bundles" aria-label="Search currency packs" />
              <button onClick={browseAssets} aria-label="Search the catalog">Search</button>
            </div>
            <button className="button button-hero call-to-action" onClick={browseAssets}>Browse currency packs <ArrowRight size={18} /></button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-disc disc-cyan" />
            <div className="art-card art-card-back"><span /></div>
            <div className="art-card art-card-front">
              <div className="art-card-icon"><Sparkles size={28} /></div>
              <span>PixelShelf / Game Vault</span>
              <strong>More play, ready when you are.</strong>
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
            <p className="eyebrow">Fresh drops</p>
            <h2>Choose your world. Stack your currency.</h2>
          </div>
          <p>Compare curated local currency bundles across a set of fictional game worlds.</p>
        </div>

        <div className="catalog-controls">
          <div className="catalog-filter-stack">
            <div className="filter-row game-filter-row" aria-label="Game worlds">
              {gameFilters.map((item) => (
                <button key={item} className={game === item ? "is-active" : ""} onClick={() => setGame(item)}>{item}</button>
              ))}
            </div>
            <div className="pack-type-filter" aria-label="Currency pack types">
              <span>Pack type</span>
              <div className="filter-row">
                {(["All", ...categories] as const).map((item) => (
                  <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>
                ))}
              </div>
            </div>
          </div>
          <span className="result-count">{visibleProducts.length} packs</span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="catalog-empty"><Sparkles size={22} /><h3>No packs matched your search.</h3><p>Try a different game, currency, or pack type.</p></div>
        )}
      </section>

      <section className="spotlight-section" id="how-it-works">
        <div className="container">
          <div className="section-heading spotlight-heading">
            <div>
              <p className="eyebrow">Featured worlds</p>
              <h2>Find the game you want to power up.</h2>
            </div>
            <button className="round-arrow" onClick={() => document.getElementById("creator-track")?.scrollBy({ left: 330, behavior: "smooth" })} aria-label="Scroll creator spotlight"><ChevronRight size={19} /></button>
          </div>
          <div className="creator-track" id="creator-track">
            {creators.map((creator) => (
              <article className={`creator-card accent-${creator.accent}`} key={creator.name}>
                <span className="creator-avatar">{creator.initials}</span>
                <div><p>{creator.role}</p><h3>{creator.name}</h3><span>{creator.productCount} products</span></div>
                <ArrowRight className="creator-arrow" size={18} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-section container">
        <div className="closing-card">
          <span className="closing-orbit" />
          <div><p className="eyebrow eyebrow-light">Ready for the next run</p><h2>Pick a bundle. Power your play.</h2></div>
          <button className="button button-white" onClick={browseAssets}>Explore all packs <ArrowRight size={17} /></button>
        </div>
      </section>
    </div>
  );
}
