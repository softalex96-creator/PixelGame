import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/pixelshelf-data";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export default function CartDrawer() {
  const {
    lines,
    subtotal,
    isCartOpen,
    checkoutComplete,
    closeCart,
    updateQuantity,
    removeItem,
    completeCheckout,
    resetCheckout,
  } = useLocalCart();
  const { locale, t } = useLanguage();

  return (
    <>
      <button
        aria-label={t.closeCart}
        className={`cart-scrim ${isCartOpen ? "is-visible" : ""}`}
        onClick={closeCart}
        tabIndex={isCartOpen ? 0 : -1}
      />
      <aside className={`cart-drawer ${isCartOpen ? "is-open" : ""}`} aria-label="Shopping cart" aria-hidden={!isCartOpen}>
        <div className="cart-drawer-header">
          <div>
            <p className="eyebrow">{t.yourTopUp}</p>
            <h2>{t.cart}</h2>
          </div>
          <button className="icon-button" onClick={closeCart} aria-label={t.closeCart}><X size={20} /></button>
        </div>

        {checkoutComplete ? (
          <div className="cart-complete">
            <span className="complete-icon"><CheckCircle2 size={24} /></span>
            <h3>{t.topUpRequestComplete}</h3>
            <p>{t.topUpCompleteCopy}</p>
            <button className="button button-dark" onClick={resetCheckout}>{t.keepBrowsing}</button>
          </div>
        ) : lines.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-icon"><ShoppingBag size={25} /></span>
            <h3>{t.queueClear}</h3>
            <p>{t.queueCopy}</p>
            <button className="text-button" onClick={closeCart}>{t.explorePacks}</button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map(({ product, quantity }) => {
                const localizedProduct = getLocalizedProduct(product, locale);
                return <article className="cart-line" key={product.id}>
                  <img src={localizedProduct.image} alt="" />
                  <div className="cart-line-content">
                    <p className="cart-line-category">{localizedProduct.game}</p>
                    <h3>{localizedProduct.title}</h3>
                    <p className="cart-line-price">{formatPrice(localizedProduct.price)}</p>
                    <div className="quantity-row">
                      <div className="quantity-control" aria-label={localizedProduct.title}>
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={t.decrease}><Minus size={14} /></button>
                        <span>{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label={t.increase}><Plus size={14} /></button>
                      </div>
                      <button className="remove-button" onClick={() => removeItem(product.id)} aria-label={t.remove}><Trash2 size={15} /></button>
                    </div>
                  </div>
                </article>;
              })}
            </div>
            <div className="cart-summary">
              <div><span>{t.subtotal}</span><strong>{formatPrice(subtotal)}</strong></div>
              <p>{t.cartNote}</p>
              <button className="button button-primary checkout-button" onClick={completeCheckout}>{t.continueTopUp}</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
