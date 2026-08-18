import { useLocalCart } from "@/contexts/LocalCartContext";
import { formatPrice, getProductBySlug } from "@/lib/pixelshelf-data";
import { ArrowLeft, Check, Download, ShoppingBag, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const product = getProductBySlug(params?.slug ?? "");
  const { addItem, openCart } = useLocalCart();

  if (!product) {
    return (
      <section className="missing-product container">
        <Sparkles size={28} />
        <h1>That asset has moved off the shelf.</h1>
        <Link href="/" className="button button-dark">Browse PixelShelf</Link>
      </section>
    );
  }

  const asset = product;

  function addToCart() {
    addItem(asset);
  }

  function buyNow() {
    addItem(asset);
    openCart();
  }

  return (
    <div className="product-detail-page">
      <section className="container product-detail">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Back to catalog</Link>
        <div className="detail-grid">
          <div className={`detail-preview accent-${asset.accent}`}>
            <div className="preview-orbit orbit-one" />
            <div className="preview-orbit orbit-two" />
            <img src={asset.image} alt={`${asset.title} preview`} />
            <span className="preview-label"><Sparkles size={14} /> Digital asset preview</span>
          </div>

          <div className="detail-copy">
            <p className="detail-category">{asset.game} · {asset.currency}</p>
            <h1>{asset.title}</h1>
            <p className="creator-line"><span className={`creator-dot accent-${asset.accent}`}>{asset.creatorInitials}</span> {asset.bundleLabel} · {asset.delivery}</p>
            <p className="detail-description">{asset.longDescription}</p>
            <div className="detail-price">{formatPrice(asset.price)} <span>virtual currency bundle</span></div>
            <div className="detail-actions">
              <button className="button button-primary instant-button" onClick={addToCart}><Download size={18} /> Instant download</button>
              <button className="button button-outline" onClick={buyNow}><ShoppingBag size={17} /> Add to top-up</button>
            </div>
            <div className="includes-card">
              <p>What’s included</p>
              <ul>
                {asset.includes.map((item) => <li key={item}><Check size={16} />{item}</li>)}
              </ul>
            </div>
            <p className="detail-note">A local top-up flow is active for this preview. Connect approved virtual-item checkout and fulfillment only after your real catalog is ready.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
