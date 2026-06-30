"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  image?: string;
  price: number;
  currency: string;
  quantity: number;
  variantSku?: string;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  ready: boolean;
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({
  children,
  tenantId,
}: {
  children: ReactNode;
  tenantId: string;
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const storageKey = `commerce360_cart_${tenantId || "store"}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore corrupted storage
    } finally {
      setReady(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, ready, storageKey]);

  const addItem = useCallback((item: Omit<CartItem, "key">) => {
    const key = `${item.productId}:${item.variantSku || ""}`;
    setItems((prev) => {
      const existing = prev.find((entry) => entry.key === key);
      if (existing) {
        return prev.map((entry) =>
          entry.key === key
            ? {
                ...entry,
                quantity: entry.quantity + item.quantity,
              }
            : entry,
        );
      }
      return [...prev, { ...item, key }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((entry) => entry.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((entry) => entry.key !== key);
      }
      return prev.map((entry) =>
        entry.key === key ? { ...entry, quantity } : entry,
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      ready,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, subtotal, ready, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
