import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/pixelshelf-data";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const {
    lines,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useLocalCart();
  const { locale, t } = useLanguage();
  const { currency } = useCurrency();
  const [, navigate] = useLocation();

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

        {lines.length === 0 ? (
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
                    <p className="cart-line-price">{formatPrice(localizedProduct.price, currency)}</p>
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
              <div><span>{t.subtotal}</span><strong>{formatPrice(subtotal, currency)}</strong></div>
              <p>{t.cartNote}</p>
              <button className="button button-primary checkout-button" onClick={() => { closeCart(); navigate("/checkout"); }}>{t.continueTopUp}</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
