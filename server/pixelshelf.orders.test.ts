import { describe, expect, it } from "vitest";
import { makeSimulatedOrder, readStoredOrders, type SimulatedOrderLine } from "../client/src/contexts/OrdersContext";

const line: SimulatedOrderLine = {
  productId: "product-nova-explorer",
  title: "Explorer Cache",
  game: "NovaVerse",
  currency: "Nova Credits",
  bundleLabel: "1,200 + 120 bonus",
  image: "/preview.png",
  quantity: 2,
  unitPrice: 7,
};

describe("simulated PixelGame checkout orders", () => {
  it("creates a paid local order with a deterministic total and identifier", () => {
    const order = makeSimulatedOrder([line], new Date("2026-08-18T10:00:00.000Z"));

    expect(order).toMatchObject({
      id: "PG-MSYHRGG0",
      createdAt: "2026-08-18T10:00:00.000Z",
      status: "paid",
      total: 14,
      lines: [line],
    });
  });

  it("restores only structurally valid local order history", () => {
    const validOrder = makeSimulatedOrder([line], new Date("2026-08-18T10:00:00.000Z"));
    expect(readStoredOrders(JSON.stringify([validOrder, { id: 4 }, { id: "missing-lines", total: 9 }]))).toEqual([validOrder]);
    expect(readStoredOrders("broken-json")).toEqual([]);
  });
});
