import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/pixelshelf-data";
import { CircleAlert, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { lines, subtotal, isCartOpen, closeCart, updateQuantity, removeItem } = useLocalCart();
  const { locale, t } = useLanguage();
  const { currency } = useCurrency();
  const [, navigate] = useLocation();
  const [isCheckoutConfirmationOpen, setCheckoutConfirmationOpen] = useState(false);

  useEffect(() => {
    if (!isCheckoutConfirmationOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCheckoutConfirmationOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isCheckoutConfirmationOpen]);

  function closeDrawer() {
    setCheckoutConfirmationOpen(false);
    closeCart();
  }

  function proceedToSimulatedCheckout() {
    setCheckoutConfirmationOpen(false);
    closeCart();
    navigate("/checkout");
  }

  return (
    <>
      <button aria-label={t.closeCart} className={`cart-scrim ${isCartOpen ? "is-visible" : ""}`} onClick={closeDrawer} tabIndex={isCartOpen ? 0 : -1} type="button" />
      <aside className={`cart-drawer ${isCartOpen ? "is-open" : ""}`} aria-label="Shopping cart" aria-hidden={!isCartOpen}>
        <div className="cart-drawer-header">
          <div><p className="eyebrow">{t.yourTopUp}</p><h2>{t.cart}</h2></div>
          <button className="icon-button" onClick={closeDrawer} aria-label={t.closeCart} type="button"><X size={20} /></button>
        </div>
        {lines.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-icon"><ShoppingBag size={25} /></span><h3>{t.queueClear}</h3><p>{t.queueCopy}</p>
            <button className="text-button" onClick={closeDrawer} type="button">{t.explorePacks}</button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map(({ product, quantity }) => {
                const localizedProduct = getLocalizedProduct(product, locale);
                return <article className="cart-line" key={product.id}>
                  <img src={localizedProduct.image} alt="" />
                  <div className="cart-line-content">
                    <p className="cart-line-category">{localizedProduct.game}</p><h3>{localizedProduct.title}</h3><p className="cart-line-price">{formatPrice(localizedProduct.price, currency)}</p>
                    <div className="quantity-row">
                      <div className="quantity-control" aria-label={`${t.quantityLabel}: ${localizedProduct.title}`} role="group">
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={t.decrease} type="button" disabled={quantity <= 1}><Minus size={14} /></button>
                        <span aria-live="polite" aria-label={`${t.quantityLabel}: ${quantity}`}>{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label={t.increase} type="button"><Plus size={14} /></button>
                      </div>
                      <button className="remove-button" onClick={() => removeItem(product.id)} aria-label={t.remove} type="button"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </article>;
              })}
            </div>
            <div className="cart-summary">
              <div><span>{t.subtotal}</span><strong>{formatPrice(subtotal, currency)}</strong></div><p>{t.cartNote}</p>
              <button className="button button-primary checkout-button" onClick={() => setCheckoutConfirmationOpen(true)} type="button">{t.continueTopUp}</button>
            </div>
          </>
        )}
      </aside>
      {isCheckoutConfirmationOpen && (
        <div className="simulated-checkout-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutConfirmationOpen(false); }}>
          <section className="simulated-checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="simulated-checkout-title" aria-describedby="simulated-checkout-description">
            <div className="simulated-dialog-header">
              <span className="simulated-status"><CircleAlert size={15} /> {t.simulationOnly}</span>
              <button className="icon-button" onClick={() => setCheckoutConfirmationOpen(false)} aria-label={t.returnToCart} type="button"><X size={18} /></button>
            </div>
            <p className="eyebrow">{t.reviewSimulation}</p><h2 id="simulated-checkout-title">{t.checkoutConfirmTitle}</h2>
            <p id="simulated-checkout-description" className="simulated-dialog-copy">{t.checkoutConfirmCopy}</p>
            <div className="simulated-order-preview" aria-label={t.checkoutConfirmQueue}>
              {lines.map(({ product, quantity }) => {
                const localizedProduct = getLocalizedProduct(product, locale);
                return <div key={product.id}><span>{localizedProduct.title} <small>× {quantity}</small></span><b>{formatPrice(product.price * quantity, currency)}</b></div>;
              })}
              <div className="simulated-order-total"><span>{t.subtotal}</span><strong>{formatPrice(subtotal, currency)}</strong></div>
            </div>
            <p className="simulated-dialog-notice">{t.checkoutConfirmNotice}</p>
            <div className="simulated-dialog-actions">
              <button className="button button-outline" onClick={() => setCheckoutConfirmationOpen(false)} type="button">{t.returnToCart}</button>
              <button className="button button-primary" onClick={proceedToSimulatedCheckout} type="button" autoFocus>{t.openSimulatedCheckout}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
