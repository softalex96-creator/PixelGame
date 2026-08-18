import { useLocalCart } from "@/contexts/LocalCartContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { getLocalizedCategory, getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice, getProductBySlug } from "@/lib/pixelshelf-data";
import { ArrowLeft, Check, Download, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const product = getProductBySlug(params?.slug ?? "");
  const { addItem, openCart } = useLocalCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { locale, t } = useLanguage();
  const { currency } = useCurrency();

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
  const isRussian = locale === "ru";
  const itemCopy = isRussian
    ? { kind: "цифровой товар / симуляция", add: "Добавить в локальную корзину", open: "Открыть локальную корзину", note: "Это демонстрационная карточка PixelGame. Реальная оплата, выдача или подключение к стороннему игровому аккаунту не выполняются." }
    : { kind: "digital item / simulated", add: "Add to local cart", open: "Open local cart", note: "This is a PixelGame preview listing. No real payment, delivery or third-party game-account connection is performed." };

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
            <p className="detail-category">{asset.game} · {getLocalizedCategory(asset.category, locale)}</p>
            <h1>{asset.title}</h1>
            <p className="creator-line"><span className={`creator-dot accent-${asset.accent}`}>{asset.creatorInitials}</span> {asset.bundleLabel} · {asset.delivery}</p>
            <p className="detail-description">{asset.longDescription}</p>
            <div className="detail-price">{formatPrice(asset.price, currency)} <span>{itemCopy.kind}</span></div>
            <div className="detail-actions">
              <button className="button button-primary instant-button" onClick={addToCart}><Download size={18} /> {itemCopy.add}</button>
              <button className="button button-outline" onClick={buyNow}><ShoppingBag size={17} /> {itemCopy.open}</button>
              <button className={`button button-outline favorite-detail ${isFavourite(product.id) ? "is-saved" : ""}`} onClick={() => toggleFavourite(product.id)} aria-pressed={isFavourite(product.id)}><Heart size={17} fill={isFavourite(product.id) ? "currentColor" : "none"} /> {isFavourite(product.id) ? t.removeSavedBundle : t.saveBundle}</button>
            </div>
            <div className="includes-card">
              <p>{t.included}</p>
              <ul>
                {asset.includes.map((item) => <li key={item}><Check size={16} />{item}</li>)}
              </ul>
            </div>
            <p className="detail-note">{itemCopy.note}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
