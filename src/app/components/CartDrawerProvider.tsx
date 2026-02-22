"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import CartDrawer from "@/app/components/CartDrawer";

type CartDrawerContextValue = {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

const CartDrawerContext = createContext<CartDrawerContextValue | undefined>(
  undefined,
);

export const CartDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({ open, openDrawer, closeDrawer, toggleDrawer }),
    [open, openDrawer, closeDrawer, toggleDrawer],
  );

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
      <CartDrawer open={open} onClose={closeDrawer} />
    </CartDrawerContext.Provider>
  );
};

export const useCartDrawer = () => {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) {
    throw new Error("useCartDrawer must be used within CartDrawerProvider");
  }
  return ctx;
};
