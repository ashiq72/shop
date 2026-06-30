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
import type { Product } from "@/lib/types";

type WishlistContextValue = {
  items: Product[];
  ready: boolean;
  hasItem: (id: string) => boolean;
  toggleItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({
  children,
  tenantId,
}: {
  children: ReactNode;
  tenantId: string;
}) {
  const [items, setItems] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const storageKey = `commerce360_wishlist_${tenantId || "store"}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Wishlist remains available for the current browser session.
    }
  }, [items, ready, storageKey]);

  const hasItem = useCallback(
    (id: string) => items.some((item) => item._id === id),
    [items],
  );

  const toggleItem = useCallback((product: Product) => {
    setItems((current) =>
      current.some((item) => item._id === product._id)
        ? current.filter((item) => item._id !== product._id)
        : [...current, product],
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item._id !== id));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, ready, hasItem, toggleItem, removeItem, clearWishlist }),
    [items, ready, hasItem, toggleItem, removeItem, clearWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
