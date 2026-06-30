"use client";

import Link from "next/link";
import { Grid2X2, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/components/CartProvider";
import { useCartDrawer } from "@/app/components/CartDrawerProvider";
import { useWishlist } from "@/app/components/WishlistProvider";
import AccountAction from "@/app/components/AccountAction";

export default function HeaderActions() {
  const { totalItems } = useCart();
  const { openDrawer } = useCartDrawer();
  const { items: wishlistItems } = useWishlist();

  return (
    <div className="store-header-actions">
      <AccountAction />
      <Link href="/categories" aria-label="Browse categories" title="Categories">
        <Grid2X2 size={20} />
        <span>Categories</span>
      </Link>
      <Link href="/wishlist" aria-label="Open wishlist" title="Wishlist">
        <Heart size={20} />
        <span>Wishlist</span>
        {wishlistItems.length > 0 ? <b>{wishlistItems.length}</b> : null}
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
