import { useLocalCart } from "@/contexts/LocalCartContext";
import { getLocalizedProduct, useLanguage } from "@/contexts/LanguageContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { canCompleteSimulatedCheckout, getPaymentActionState, resolveCheckoutViewState, toSimulatedOrderLines } from "@/lib/buyer-state";
import { formatPrice } from "@/lib/pixelshelf-data";
import { CheckCircle2, CreditCard, LoaderCircle, LockKeyhole, ShoppingBag } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { HomeSectionLink } from "@/components/HomeSectionLink";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { lines, subtotal, clearCart } = useLocalCart();
  const { createOrder, orders } = useOrders();
  const { locale, t } = useLanguage();
  const { currency } = useCurrency();
  const [email, setEmail] = useState("");
  const [playerTag, setPlayerTag] = useState("");
  const [orderId, setOrderId] = useState<string | null>(() => typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("success"));
  const [isProcessing, setIsProcessing] = useState(false);
  const checkoutView = resolveCheckoutViewState(lines, orders, orderId);
  const paymentState = getPaymentActionState(canCompleteSimulatedCheckout(lines, email, playerTag), isProcessing);

  function completePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (paymentState !== "ready") return;
    setIsProcessing(true);
    window.setTimeout(() => {
      const createdOrder = createOrder(toSimulatedOrderLines(lines));
      clearCart();
      setOrderId(createdOrder.id);
      setIsProcessing(false);
      navigate(`/checkout?success=${createdOrder.id}`, { replace: true });
    }, 700);
  }

  if (checkoutView.kind === "success") {
    const order = checkoutView.order;
    return <main className="checkout-page"><section className="checkout-success panel-shell">
      <span className="confetti-layer" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--piece": index } as React.CSSProperties} />)}</span>
      <span className="success-orb"><CheckCircle2 size={30} /></span>
      <p className="eyebrow">{t.paymentSuccessEyebrow}</p>
      <h1>{t.paymentSuccess}</h1>
      <p>{t.paymentSuccessCopy}</p>
      <div className="success-order-meta"><span>{t.orderNumber}</span><strong>{order.id}</strong><span>{formatPrice(order.total, currency)}</span></div>
      <div className="success-actions"><Link href="/account" className="button button-primary">{t.viewAccount}</Link><HomeSectionLink sectionId="catalog" className="button button-outline">{t.keepBrowsing}</HomeSectionLink></div>
    </section></main>;
  }

  if (checkoutView.kind === "empty") {
    return <main className="checkout-page"><section className="checkout-empty panel-shell">
      <span className="empty-icon"><ShoppingBag size={27} /></span>
      <h1>{t.checkoutEmpty}</h1><p>{t.checkoutEmptyCopy}</p>
      <HomeSectionLink sectionId="catalog" className="button button-primary">{t.explorePacks}</HomeSectionLink>
    </section></main>;
  }

  return <main className="checkout-page"><div className="container checkout-layout">
    <section className="checkout-form-column">
      <HomeSectionLink sectionId="catalog" className="back-link">← {t.backToCatalog}</HomeSectionLink>
      <p className="eyebrow">{t.checkoutEyebrow}</p>
      <h1>{t.checkoutTitle}</h1>
      <p className="checkout-lede">{t.checkoutDescription}</p>
      <div className="checkout-demo-note"><LockKeyhole size={16} /><span>{t.checkoutDemo}</span></div>
      <form className="checkout-form" onSubmit={completePayment}>
        <label>{t.billingEmail}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="player@example.com" required /></label>
        <label>{t.playerTag}<input value={playerTag} onChange={(event) => setPlayerTag(event.target.value)} placeholder="NovaRunner#001" required /></label>
        <div className="simulated-method"><CreditCard size={18} /><div><strong>{t.simulatedPayment}</strong><span>{t.simulatedPaymentCopy}</span></div></div>
        <button className="button button-primary payment-button" type="submit" disabled={paymentState !== "ready"} aria-busy={isProcessing}>{isProcessing ? <><LoaderCircle className="payment-spinner" size={17} />{t.processingPayment}</> : <>{t.payDemo} · {formatPrice(subtotal, currency)}</>}</button>
      </form>
    </section>
    <aside className="checkout-summary panel-shell">
      <p className="eyebrow">{t.orderSummary}</p>
      <h2>{t.yourTopUp}</h2>
      <div className="checkout-lines">{lines.map(({ product, quantity }) => {
        const localized = getLocalizedProduct(product, locale);
        return <article key={product.id}><img src={localized.image} alt="" /><div><strong>{localized.title}</strong><span>{localized.game} · {localized.bundleLabel}</span><small>× {quantity}</small></div><b>{formatPrice(localized.price * quantity, currency)}</b></article>;
      })}</div>
      <div className="checkout-total"><span>{t.subtotal}</span><strong>{formatPrice(subtotal, currency)}</strong></div>
    </aside>
  </div></main>;
}
