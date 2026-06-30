"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/app/components/CartProvider";
import { useCartDrawer } from "@/app/components/CartDrawerProvider";

const formatMoney = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

type Props = {
  product: Product;
  badge?: string;
};

export default function ProductCard({ product, badge }: Props) {
  const { addItem } = useCart();
  const { openDrawer } = useCartDrawer();
  const price = product.salePrice ?? product.price;
  const currency = product.currency || "USD";
  const image = product.thumbnail || product.images?.[0] || "/store-hero.jpg";
  const unavailable =
    product.trackStock !== false && Number(product.stock || 0) <= 0;

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (unavailable || product.variants?.length) return;
    addItem({
      productId: product._id,
      name: product.name,
      price,
      currency,
      quantity: 1,
      image,
    });
    openDrawer();
  };

  return (
    <article className="product-card">
      <Link href={`/products/${product._id}`} className="product-card-link">
        <div className="product-card-media">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
          {badge ? <span className="product-badge">{badge}</span> : null}
          {unavailable ? <span className="product-stock-badge">Sold out</span> : null}
        </div>
        <div className="product-card-copy">
          <span>{product.brand || "Everyday essentials"}</span>
          <h2>{product.name}</h2>
          <div className="product-card-price">
            <strong>{formatMoney(price, currency)}</strong>
            {product.salePrice !== undefined && product.salePrice < product.price ? (
              <del>{formatMoney(product.price, currency)}</del>
            ) : null}
          </div>
        </div>
      </Link>
      {product.variants?.length && !unavailable ? (
        <Link
          href={`/products/${product._id}`}
          className="product-card-action"
          aria-label={`Choose options for ${product.name}`}
        >
          <ShoppingBag size={17} />
          Choose options
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          disabled={unavailable}
          className="product-card-action"
          aria-label={`Add ${product.name} to bag`}
        >
          <ShoppingBag size={17} />
          {unavailable ? "Unavailable" : "Add to bag"}
        </button>
      )}
    </article>
  );
}
