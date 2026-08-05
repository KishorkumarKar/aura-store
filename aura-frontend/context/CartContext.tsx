"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, variantKey: string, quantity: number) => void;
  removeItem: (productId: string, variantKey: string) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "aura-cart";

// A cart line is uniquely identified by productId + variantKey (variant
// options joined, or "default" for simple products).
function lineKey(productId: string, variantKey: string): string {
  return `${productId}::${variantKey}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const key = lineKey(newItem.productId, newItem.variantKey);
      const existing = prev.find(
        (i) => lineKey(i.productId, i.variantKey) === key
      );
      if (existing) {
        return prev.map((i) =>
          lineKey(i.productId, i.variantKey) === key
            ? {
                ...i,
                quantity: Math.min(i.quantity + newItem.quantity, i.stock),
              }
            : i
        );
      }
      return [...prev, newItem];
    });
  }

  function updateQuantity(productId: string, variantKey: string, quantity: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          lineKey(i.productId, i.variantKey) === lineKey(productId, variantKey)
            ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId: string, variantKey: string) {
    setItems((prev) =>
      prev.filter(
        (i) => lineKey(i.productId, i.variantKey) !== lineKey(productId, variantKey)
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;
    const tax = Math.round(subtotal * 0.07 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;
    return { subtotal, count, shipping, tax, total };
  }, [items]);

  const value: CartContextValue = {
    items,
    hydrated,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
