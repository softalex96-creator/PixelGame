import type { CartLine } from "@/contexts/LocalCartContext";
import type { SimulatedOrder, SimulatedOrderLine } from "@/contexts/OrdersContext";
import { products, type MarketplaceProduct } from "@/lib/pixelshelf-data";

export function canCompleteSimulatedCheckout(lines: CartLine[], email: string, playerTag: string) {
  return lines.length > 0 && email.trim().length > 0 && playerTag.trim().length > 0;
}

export function toSimulatedOrderLines(lines: CartLine[]): SimulatedOrderLine[] {
  return lines.map(({ product, quantity }) => ({
    productId: product.id,
    title: product.title,
    game: product.game,
    currency: product.currency,
    bundleLabel: product.bundleLabel,
    image: product.image,
    quantity,
    unitPrice: product.price,
  }));
}

export function restoreOrderToCart(order: SimulatedOrder, catalog: MarketplaceProduct[] = products): CartLine[] {
  return order.lines.flatMap((line) => {
    const product = catalog.find((item) => item.id === line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
}

export function getPaymentActionState(canSubmit: boolean, isProcessing: boolean) {
  if (isProcessing) return "processing" as const;
  return canSubmit ? "ready" as const : "disabled" as const;
}

export type CheckoutViewState =
  | { kind: "empty" }
  | { kind: "ready" }
  | { kind: "success"; order: SimulatedOrder };

export function resolveCheckoutViewState(lines: CartLine[], orders: SimulatedOrder[], successOrderId: string | null): CheckoutViewState {
  const completedOrder = successOrderId ? orders.find((order) => order.id === successOrderId) : undefined;
  if (completedOrder) return { kind: "success", order: completedOrder };
  return lines.length ? { kind: "ready" } : { kind: "empty" };
}

export function getBuyerAccountState(orders: SimulatedOrder[], favouriteIds: string[], catalog: MarketplaceProduct[] = products) {
  const savedProducts = catalog.filter((product) => favouriteIds.includes(product.id));
  return {
    orderCount: orders.length,
    savedProducts,
    hasOrderHistory: orders.length > 0,
    hasSavedItems: savedProducts.length > 0,
  };
}
