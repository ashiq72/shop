"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/app/components/WishlistProvider";
import { useAccount } from "@/app/components/AccountProvider";

export default function WishlistButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { hasItem, toggleItem, ready } = useWishlist();
  const { signedIn, ready: accountReady } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const active = ready && hasItem(product._id);

  return (
    <button
      type="button"
      className={compact ? "wishlist-button compact" : "wishlist-button"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!accountReady) return;
        if (!signedIn) {
          sessionStorage.setItem("pending_wishlist_product", product._id);
          const returnTo = pathname || `/products/${product._id}`;
          router.push(
            `/account/login?returnTo=${encodeURIComponent(returnTo)}`,
          );
          return;
        }
        void toggleItem(product);
      }}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      disabled={!accountReady}
    >
      <Heart size={compact ? 17 : 19} fill={active ? "currentColor" : "none"} />
      {!compact ? <span>{active ? "Saved" : "Save for later"}</span> : null}
    </button>
  );
}
