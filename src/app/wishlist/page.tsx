"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { useWishlist } from "@/app/components/WishlistProvider";

export default function WishlistPage() {
  const { items, ready, clearWishlist } = useWishlist();

  if (!ready) {
    return <main className="store-shell store-state-page">Loading wishlist...</main>;
  }

  return (
    <main className="store-shell store-list-page">
      <div className="store-list-title">
        <div>
          <p>Saved for later</p>
          <h1>Your wishlist</h1>
          <span>{items.length} saved products</span>
        </div>
        {items.length ? (
          <button type="button" onClick={clearWishlist}>
            <Trash2 size={16} />
            Clear wishlist
          </button>
        ) : null}
      </div>

      {items.length ? (
        <div className="product-grid">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <section className="store-state-page compact">
          <Heart size={42} />
          <h2>Nothing saved yet</h2>
          <p>Use the heart on any product to keep it close.</p>
          <Link href="/products">Explore products</Link>
        </section>
      )}
    </main>
  );
}

