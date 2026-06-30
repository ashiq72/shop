"use client";

import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/app/components/WishlistProvider";

export default function WishlistButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { hasItem, toggleItem, ready } = useWishlist();
  const active = ready && hasItem(product._id);

  return (
    <button
      type="button"
      className={compact ? "wishlist-button compact" : "wishlist-button"}
      onClick={(event) => {
        event.preventDefault();
        toggleItem(product);
      }}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
    >
      <Heart size={compact ? 17 : 19} fill={active ? "currentColor" : "none"} />
      {!compact ? <span>{active ? "Saved" : "Save for later"}</span> : null}
    </button>
  );
}
