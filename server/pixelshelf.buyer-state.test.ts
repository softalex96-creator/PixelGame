import { describe, expect, it } from "vitest";
import { canCompleteSimulatedCheckout, getBuyerAccountState, getPaymentActionState, resolveCheckoutViewState, restoreOrderToCart, toSimulatedOrderLines } from "../client/src/lib/buyer-state";
import { makeSimulatedOrder } from "../client/src/contexts/OrdersContext";
import { filterAndSortProducts, products } from "../client/src/lib/pixelshelf-data";

describe("PixelGame checkout state", () => {
  const cartLine = { product: products[0]!, quantity: 2 };

  it("keeps checkout disabled for an empty cart or incomplete local preview form", () => {
    expect(canCompleteSimulatedCheckout([], "buyer@pixelgame.local", "Demo#001")).toBe(false);
    expect(canCompleteSimulatedCheckout([cartLine], "", "Demo#001")).toBe(false);
    expect(canCompleteSimulatedCheckout([cartLine], "buyer@pixelgame.local", "")).toBe(false);
    expect(canCompleteSimulatedCheckout([cartLine], "buyer@pixelgame.local", "Demo#001")).toBe(true);
  });

  it("converts cart lines into the local order snapshot used by a successful checkout", () => {
    expect(toSimulatedOrderLines([cartLine])).toEqual([{
      productId: products[0]!.id,
      title: products[0]!.title,
      game: products[0]!.game,
      currency: products[0]!.currency,
      bundleLabel: products[0]!.bundleLabel,
      image: products[0]!.image,
      quantity: 2,
      unitPrice: products[0]!.price,
    }]);
  });

  it("resolves the direct empty, ready, and success states shown by the checkout page", () => {
    const order = makeSimulatedOrder(toSimulatedOrderLines([cartLine]), new Date("2026-08-18T10:00:00.000Z"));
    expect(resolveCheckoutViewState([], [], null)).toEqual({ kind: "empty" });
    expect(resolveCheckoutViewState([cartLine], [], null)).toEqual({ kind: "ready" });
    expect(resolveCheckoutViewState([], [order], order.id)).toEqual({ kind: "success", order });
    expect(resolveCheckoutViewState([], [order], "unknown")).toEqual({ kind: "empty" });
  });

  it("prioritizes the visible processing state while a simulated payment is completing", () => {
    expect(getPaymentActionState(false, false)).toBe("disabled");
    expect(getPaymentActionState(true, false)).toBe("ready");
    expect(getPaymentActionState(true, true)).toBe("processing");
  });
});

describe("PixelGame buyer account state", () => {
  it("shows persisted order counts and catalog-backed saved bundles while ignoring stale IDs", () => {
    const order = makeSimulatedOrder(toSimulatedOrderLines([{ product: products[0]!, quantity: 1 }]), new Date("2026-08-18T10:00:00.000Z"));
    const state = getBuyerAccountState([order], [products[0]!.id, "removed-product"]);

    expect(state.orderCount).toBe(1);
    expect(state.savedProducts).toEqual([products[0]]);
    expect(state.hasOrderHistory).toBe(true);
    expect(state.hasSavedItems).toBe(true);
  });

  it("represents empty order history and an empty saved list as the account's empty sections", () => {
    const state = getBuyerAccountState([], []);
    expect(state).toMatchObject({ orderCount: 0, savedProducts: [], hasOrderHistory: false, hasSavedItems: false });
  });

  it("restores current products and quantities for a repeat order while skipping removed catalogue items", () => {
    const order = makeSimulatedOrder(toSimulatedOrderLines([{ product: products[0]!, quantity: 2 }]), new Date("2026-08-18T10:00:00.000Z"));
    expect(restoreOrderToCart(order)).toEqual([{ product: products[0], quantity: 2 }]);
    expect(restoreOrderToCart(order, [])).toEqual([]);
  });
});

describe("PixelGame price controls", () => {
  it("filters packs by price tier and sorts the filtered result without mutating the catalogue", () => {
    expect(filterAndSortProducts(products, "All", "", "All games", "budget", "price-asc").map((product) => product.price)).toEqual([6, 7, 9]);
    expect(filterAndSortProducts(products, "All", "", "All games", "standard", "price-desc").map((product) => product.price)).toEqual([20]);
    expect(filterAndSortProducts(products, "All", "", "All games", "premium", "featured").map((product) => product.price)).toEqual([22, 28]);
    expect(products.map((product) => product.price)).toEqual([7, 20, 6, 22, 9, 28]);
  });
});
