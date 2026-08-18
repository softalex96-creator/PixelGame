import { products, type MarketplaceProduct } from "@/lib/pixelshelf-data";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type CartLine = {
  product: MarketplaceProduct;
  quantity: number;
};

type StoredCartLine = { id: string; quantity: number };

export function addProductToLocalCart(lines: CartLine[], product: MarketplaceProduct): CartLine[] {
  const existing = lines.find((line) => line.product.id === product.id);
  return existing
    ? lines.map((line) => (line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line))
    : [...lines, { product, quantity: 1 }];
}

export function setLocalCartQuantity(lines: CartLine[], id: string, quantity: number): CartLine[] {
  return quantity <= 0
    ? lines.filter((line) => line.product.id !== id)
    : lines.map((line) => (line.product.id === id ? { ...line, quantity } : line));
}

type LocalCartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  checkoutComplete: boolean;
  addItem: (product: MarketplaceProduct) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  completeCheckout: () => void;
  resetCheckout: () => void;
};

const LocalCartContext = createContext<LocalCartContextValue | null>(null);

function readSavedCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem("pixelshelf:cart") ?? "[]") as StoredCartLine[];
    return saved
      .map(({ id, quantity }) => {
        const product = products.find((item) => item.id === id);
        return product && quantity > 0 ? { product, quantity } : null;
      })
      .filter((line): line is CartLine => line !== null);
  } catch {
    return [];
  }
}

export function LocalCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readSavedCart);
  const [isCartOpen, setIsCartOpen] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("cart") === "open");
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  useEffect(() => {
    const serializable = lines.map((line) => ({ id: line.product.id, quantity: line.quantity }));
    window.localStorage.setItem("pixelshelf:cart", JSON.stringify(serializable));
  }, [lines]);

  const value = useMemo<LocalCartContextValue>(() => {
    const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);

    return {
      lines,
      itemCount,
      subtotal,
      isCartOpen,
      checkoutComplete,
      addItem: (product) => {
        setLines((current) => addProductToLocalCart(current, product));
        setCheckoutComplete(false);
        setIsCartOpen(true);
      },
      updateQuantity: (id, quantity) => {
        setLines((current) => setLocalCartQuantity(current, id, quantity));
      },
      removeItem: (id) => setLines((current) => current.filter((line) => line.product.id !== id)),
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      completeCheckout: () => {
        setLines([]);
        setCheckoutComplete(true);
      },
      resetCheckout: () => setCheckoutComplete(false),
    };
  }, [checkoutComplete, isCartOpen, lines]);

  return <LocalCartContext.Provider value={value}>{children}</LocalCartContext.Provider>;
}

export function useLocalCart() {
  const context = useContext(LocalCartContext);
  if (!context) throw new Error("useLocalCart must be used within LocalCartProvider");
  return context;
}
