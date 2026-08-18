import { useFavourites } from "@/contexts/FavouritesContext";
import { getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { useOrders } from "@/contexts/OrdersContext";
import { getBuyerAccountState } from "@/lib/buyer-state";
import { restoreOrderToCart } from "@/lib/buyer-state";
import { formatPrice, products } from "@/lib/pixelshelf-data";
import { useLocalCart } from "@/contexts/LocalCartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CheckCircle2, Heart, PackageOpen, RotateCcw, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Account() {
  const { orders } = useOrders();
  const { favouriteIds } = useFavourites();
  const { lines, replaceItems } = useLocalCart();
  const [, navigate] = useLocation();
  const { locale, t } = useLanguage();
  const { currency } = useCurrency();
  const buyerState = getBuyerAccountState(orders, favouriteIds, products, lines);
  const savedProducts = buyerState.savedProducts.map((product) => getLocalizedProduct(product, locale));

  function repeatOrder(order: (typeof orders)[number]) {
    const restoredLines = restoreOrderToCart(order);
    if (!restoredLines.length) return;
    replaceItems(restoredLines);
    navigate("/checkout");
  }

  return <main className="account-page"><div className="container account-layout">
    <header className="account-hero"><p className="eyebrow">{t.accountEyebrow}</p><h1>{t.accountTitle}</h1><p>{t.accountDescription}</p>
      <div className="account-stats"><span><b>{buyerState.orderCount}</b>{t.ordersCount}</span><span><b>{buyerState.pendingItemCount}</b>{t.inCartCount}</span><span><b>{savedProducts.length}</b>{t.savedCount}</span></div>
    </header>
    {buyerState.hasPendingCart && <section className="account-section pending-account-section"><div className="section-heading"><div><p className="eyebrow">{t.pendingCart}</p><h2>{t.pendingCart}</h2></div><Link href="/checkout" className="button button-primary">{t.continueCheckout}</Link></div><div className="pending-cart-card panel-shell"><p>{t.pendingCartDescription}</p><div className="pending-cart-lines">{buyerState.pendingCartLines.map(({ product, quantity }) => { const localized = getLocalizedProduct(product, locale); return <div key={product.id}><span>{localized.game} · {localized.title} <small>× {quantity}</small></span><b>{formatPrice(localized.price * quantity, currency)}</b></div>; })}</div></div></section>}
    <section className="account-section"><div className="section-heading"><div><p className="eyebrow">{t.orderHistoryEyebrow}</p><h2>{t.orderHistory}</h2></div></div>
      {buyerState.hasOrderHistory ? <div className="order-list">{orders.map((order) => <article className="order-card" key={order.id}>
        <div className="order-card-head"><div><span className="status-pill"><CheckCircle2 size={13} />{t.paidSimulated}</span><h3>{order.id}</h3><p>{new Date(order.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short", year: "numeric" })}</p></div><strong>{formatPrice(order.total, currency)}</strong></div>
        <div className="order-items">{order.lines.map((line) => <div key={`${order.id}:${line.productId}`}><img src={line.image} alt="" /><span>{line.game} · {line.title} <small>× {line.quantity}</small></span><b>{formatPrice(line.unitPrice * line.quantity, currency)}</b></div>)}</div>
        <div className="order-card-actions"><button className="button button-outline repeat-order-button" onClick={() => repeatOrder(order)} disabled={!restoreOrderToCart(order).length}><RotateCcw size={15} />{t.repeatOrder}</button></div>
      </article>)}</div> : <div className="account-empty panel-shell"><span className="empty-icon"><PackageOpen size={26} /></span><h3>{t.noOrders}</h3><p>{t.noOrdersCopy}</p><Link href="/#catalog" className="button button-outline">{t.explorePacks}</Link></div>}
    </section>
    <section className="account-section"><div className="section-heading"><div><p className="eyebrow">{t.savedForLaterEyebrow}</p><h2>{t.savedForLater}</h2></div><Link href="/?saved=true#catalog" className="view-link">{t.showSaved} →</Link></div>
      {buyerState.hasSavedItems ? <div className="saved-account-grid">{savedProducts.map((product) => <Link href={`/product/${product.slug}`} className="saved-account-card" key={product.id}><img src={product.image} alt="" /><span><small>{product.game}</small><strong>{product.title}</strong><em>{formatPrice(product.price, currency)}</em></span></Link>)}</div> : <div className="account-empty panel-shell"><span className="empty-icon"><Heart size={26} /></span><h3>{t.noSavedBundles}</h3><p>{t.noSavedBundlesCopy}</p><Link href="/#catalog" className="button button-outline">{t.explorePacks}</Link></div>}
    </section>
    <Link href="/#catalog" className="account-browse-link"><ShoppingBag size={17} />{t.browseCurrencyPacks}</Link>
  </div></main>;
}
