import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { useOrders } from "@/contexts/OrdersContext";
import { formatPrice } from "@/lib/pixelshelf-data";
import { CheckCircle2, CreditCard, LockKeyhole, ShoppingBag } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { lines, subtotal, clearCart } = useLocalCart();
  const { createOrder, getOrder } = useOrders();
  const { locale, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [playerTag, setPlayerTag] = useState("");
  const [orderId, setOrderId] = useState<string | null>(() => typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("success"));
  const order = orderId ? getOrder(orderId) : undefined;

  function completePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length || !email.trim() || !playerTag.trim()) return;
    const createdOrder = createOrder(lines.map(({ product, quantity }) => ({
      productId: product.id,
      title: product.title,
      game: product.game,
      currency: product.currency,
      bundleLabel: product.bundleLabel,
      image: product.image,
      quantity,
      unitPrice: product.price,
    })));
    clearCart();
    setOrderId(createdOrder.id);
    navigate(`/checkout?success=${createdOrder.id}`, { replace: true });
  }

  if (order) {
    return <main className="checkout-page"><section className="checkout-success panel-shell">
      <span className="success-orb"><CheckCircle2 size={30} /></span>
      <p className="eyebrow">{t.paymentSuccessEyebrow}</p>
      <h1>{t.paymentSuccess}</h1>
      <p>{t.paymentSuccessCopy}</p>
      <div className="success-order-meta"><span>{t.orderNumber}</span><strong>{order.id}</strong><span>{formatPrice(order.total)}</span></div>
      <div className="success-actions"><Link href="/account" className="button button-primary">{t.viewAccount}</Link><Link href="/#catalog" className="button button-outline">{t.keepBrowsing}</Link></div>
    </section></main>;
  }

  if (!lines.length) {
    return <main className="checkout-page"><section className="checkout-empty panel-shell">
      <span className="empty-icon"><ShoppingBag size={27} /></span>
      <h1>{t.checkoutEmpty}</h1><p>{t.checkoutEmptyCopy}</p>
      <Link href="/#catalog" className="button button-primary">{t.explorePacks}</Link>
    </section></main>;
  }

  return <main className="checkout-page"><div className="container checkout-layout">
    <section className="checkout-form-column">
      <Link href="/#catalog" className="back-link">← {t.backToCatalog}</Link>
      <p className="eyebrow">{t.checkoutEyebrow}</p>
      <h1>{t.checkoutTitle}</h1>
      <p className="checkout-lede">{t.checkoutDescription}</p>
      <div className="checkout-demo-note"><LockKeyhole size={16} /><span>{t.checkoutDemo}</span></div>
      <form className="checkout-form" onSubmit={completePayment}>
        <label>{t.billingEmail}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="player@example.com" required /></label>
        <label>{t.playerTag}<input value={playerTag} onChange={(event) => setPlayerTag(event.target.value)} placeholder="NovaRunner#001" required /></label>
        <div className="simulated-method"><CreditCard size={18} /><div><strong>{t.simulatedPayment}</strong><span>{t.simulatedPaymentCopy}</span></div></div>
        <button className="button button-primary payment-button" type="submit">{t.payDemo} · {formatPrice(subtotal)}</button>
      </form>
    </section>
    <aside className="checkout-summary panel-shell">
      <p className="eyebrow">{t.orderSummary}</p>
      <h2>{t.yourTopUp}</h2>
      <div className="checkout-lines">{lines.map(({ product, quantity }) => {
        const localized = getLocalizedProduct(product, locale);
        return <article key={product.id}><img src={localized.image} alt="" /><div><strong>{localized.title}</strong><span>{localized.game} · {localized.bundleLabel}</span><small>× {quantity}</small></div><b>{formatPrice(localized.price * quantity)}</b></article>;
      })}</div>
      <div className="checkout-total"><span>{t.subtotal}</span><strong>{formatPrice(subtotal)}</strong></div>
    </aside>
  </div></main>;
}
