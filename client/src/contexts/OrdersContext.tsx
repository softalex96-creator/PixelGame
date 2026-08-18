import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type SimulatedOrderLine = {
  productId: string;
  title: string;
  game: string;
  currency: string;
  bundleLabel: string;
  image: string;
  quantity: number;
  unitPrice: number;
};

export type SimulatedOrder = {
  id: string;
  createdAt: string;
  status: "paid";
  total: number;
  lines: SimulatedOrderLine[];
};

type OrdersContextValue = {
  orders: SimulatedOrder[];
  createOrder: (lines: SimulatedOrderLine[]) => SimulatedOrder;
  getOrder: (id: string) => SimulatedOrder | undefined;
};

const STORAGE_KEY = "pixelgame:orders";
const OrdersContext = createContext<OrdersContextValue | null>(null);

export function makeSimulatedOrder(lines: SimulatedOrderLine[], now = new Date()): SimulatedOrder {
  return {
    id: `PG-${now.getTime().toString(36).toUpperCase()}`,
    createdAt: now.toISOString(),
    status: "paid",
    total: lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    lines,
  };
}

export function readStoredOrders(serialized: string | null): SimulatedOrder[] {
  if (!serialized) return [];
  try {
    const parsed = JSON.parse(serialized) as SimulatedOrder[];
    return Array.isArray(parsed)
      ? parsed.filter((order) => typeof order?.id === "string" && Array.isArray(order.lines) && typeof order.total === "number")
      : [];
  } catch {
    return [];
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<SimulatedOrder[]>(() =>
    typeof window === "undefined" ? [] : readStoredOrders(window.localStorage.getItem(STORAGE_KEY)),
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const value = useMemo<OrdersContextValue>(() => ({
    orders,
    createOrder: (lines) => {
      const order = makeSimulatedOrder(lines);
      setOrders((current) => [order, ...current]);
      return order;
    },
    getOrder: (id) => orders.find((order) => order.id === id),
  }), [orders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within OrdersProvider");
  return context;
}
