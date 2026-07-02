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
import {
  apiDeleteAuth,
  apiGetAuth,
  apiPostAuth,
} from "@/lib/clientApi";
import { useAccount } from "@/app/components/AccountProvider";

type WishlistContextValue = {
  items: Product[];
  ready: boolean;
  hasItem: (id: string) => boolean;
  toggleItem: (product: Product) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { ready: accountReady, signedIn } = useAccount();
  const [items, setItems] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!signedIn) {
      setItems([]);
      setReady(accountReady);
      return;
    }
    try {
      const response = await apiGetAuth<Product[]>("/ecommerce/wishlist");
      setItems(response.data || []);
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, [accountReady, signedIn]);

  useEffect(() => {
    const handleWishlistChanged = () => {
      void refreshWishlist();
    };

    void refreshWishlist();
    window.addEventListener(
      "commerce360-wishlist-changed",
      handleWishlistChanged,
    );

    return () => {
      window.removeEventListener(
        "commerce360-wishlist-changed",
        handleWishlistChanged,
      );
    };
  }, [refreshWishlist]);

  const hasItem = useCallback(
    (id: string) => items.some((item) => item._id === id),
    [items],
  );

  const toggleItem = useCallback(
    async (product: Product) => {
      const exists = items.some((item) => item._id === product._id);
      const previous = items;
      setItems((current) =>
        exists
          ? current.filter((item) => item._id !== product._id)
          : [...current, product],
      );
      try {
        const response = exists
          ? await apiDeleteAuth<Product[]>(
              `/ecommerce/wishlist/${product._id}`,
            )
          : await apiPostAuth<Product[]>("/ecommerce/wishlist", {
              productId: product._id,
            });
        setItems(response.data || []);
      } catch (error) {
        setItems(previous);
        throw error;
      }
    },
    [items],
  );

  const removeItem = useCallback(async (id: string) => {
    const response = await apiDeleteAuth<Product[]>(
      `/ecommerce/wishlist/${id}`,
    );
    setItems(response.data || []);
  }, []);

  const clearWishlist = useCallback(async () => {
    await apiDeleteAuth<Product[]>("/ecommerce/wishlist/clear");
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      ready,
      hasItem,
      toggleItem,
      removeItem,
      clearWishlist,
      refreshWishlist,
    }),
    [
      clearWishlist,
      hasItem,
      items,
      ready,
      refreshWishlist,
      removeItem,
      toggleItem,
    ],
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
