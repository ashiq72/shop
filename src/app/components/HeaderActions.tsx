"use client";

import Link from "next/link";
import { Grid2X2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/components/CartProvider";
import { useCartDrawer } from "@/app/components/CartDrawerProvider";

export default function HeaderActions() {
  const { totalItems } = useCart();
  const { openDrawer } = useCartDrawer();

  return (
    <div className="store-header-actions">
      <Link href="/categories" aria-label="Browse categories" title="Categories">
        <Grid2X2 size={20} />
        <span>Categories</span>
      </Link>
      <button
        type="button"
        onClick={openDrawer}
        aria-label="Open shopping bag"
        title="Shopping bag"
      >
        <ShoppingBag size={20} />
        <span>Bag</span>
        {totalItems > 0 ? <b>{totalItems}</b> : null}
      </button>
    </div>
  );
}
