import { useLocalCart } from "@/contexts/LocalCartContext";
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

  return (
    <>
      <button
        aria-label="Close cart overlay"
        className={`cart-scrim ${isCartOpen ? "is-visible" : ""}`}
        onClick={closeCart}
        tabIndex={isCartOpen ? 0 : -1}
      />
      <aside className={`cart-drawer ${isCartOpen ? "is-open" : ""}`} aria-label="Shopping cart" aria-hidden={!isCartOpen}>
        <div className="cart-drawer-header">
          <div>
            <p className="eyebrow">Your top-up</p>
            <h2>Cart</h2>
          </div>
          <button className="icon-button" onClick={closeCart} aria-label="Close cart"><X size={20} /></button>
        </div>

        {checkoutComplete ? (
          <div className="cart-complete">
            <span className="complete-icon"><CheckCircle2 size={24} /></span>
            <h3>Top-up request complete</h3>
            <p>This local preview cleared your cart. Connect the action to an approved virtual-currency checkout when your live catalog is ready.</p>
            <button className="button button-dark" onClick={resetCheckout}>Keep browsing</button>
          </div>
        ) : lines.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-icon"><ShoppingBag size={25} /></span>
            <h3>Your queue is clear</h3>
            <p>Add a currency pack and it will stay here while you browse.</p>
            <button className="text-button" onClick={closeCart}>Explore packs</button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map(({ product, quantity }) => (
                <article className="cart-line" key={product.id}>
                  <img src={product.image} alt="" />
                  <div className="cart-line-content">
                    <p className="cart-line-category">{product.category}</p>
                    <h3>{product.title}</h3>
                    <p className="cart-line-price">{formatPrice(product.price)}</p>
                    <div className="quantity-row">
                      <div className="quantity-control" aria-label={`Quantity for ${product.title}`}>
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                        <span>{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                      </div>
                      <button className="remove-button" onClick={() => removeItem(product.id)} aria-label={`Remove ${product.title}`}><Trash2 size={15} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <p>Local preview checkout. Connect only approved virtual-item checkout and fulfillment after your catalog is ready.</p>
              <button className="button button-primary checkout-button" onClick={completeCheckout}>Continue to top-up</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
