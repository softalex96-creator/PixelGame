import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { formatPrice, getProductBySlug } from "@/lib/pixelshelf-data";
import { ArrowLeft, Check, Download, ShoppingBag, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const product = getProductBySlug(params?.slug ?? "");
  const { addItem, openCart } = useLocalCart();
  const { locale, t } = useLanguage();

  if (!product) {
    return (
      <section className="missing-product container">
        <Sparkles size={28} />
        <h1>{t.missingTitle}</h1>
        <Link href="/" className="button button-dark">{t.browseVault}</Link>
      </section>
    );
  }

  const asset = getLocalizedProduct(product, locale);

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
        <Link href="/" className="back-link"><ArrowLeft size={16} /> {t.backToCatalog}</Link>
        <div className="detail-grid">
          <div className={`detail-preview accent-${asset.accent}`}>
            <div className="preview-orbit orbit-one" />
            <div className="preview-orbit orbit-two" />
            <img src={asset.image} alt={`${asset.title} preview`} />
            <span className="preview-label"><Sparkles size={14} /> {t.preview}</span>
          </div>

          <div className="detail-copy">
            <p className="detail-category">{asset.game} · {asset.currency}</p>
            <h1>{asset.title}</h1>
            <p className="creator-line"><span className={`creator-dot accent-${asset.accent}`}>{asset.creatorInitials}</span> {asset.bundleLabel} · {asset.delivery}</p>
            <p className="detail-description">{asset.longDescription}</p>
            <div className="detail-price">{formatPrice(asset.price)} <span>{t.virtualCurrencyBundle}</span></div>
            <div className="detail-actions">
              <button className="button button-primary instant-button" onClick={addToCart}><Download size={18} /> {t.instantDownload}</button>
              <button className="button button-outline" onClick={buyNow}><ShoppingBag size={17} /> {t.addToTopUp}</button>
            </div>
            <div className="includes-card">
              <p>{t.included}</p>
              <ul>
                {asset.includes.map((item) => <li key={item}><Check size={16} />{item}</li>)}
              </ul>
            </div>
            <p className="detail-note">{t.detailNote}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
