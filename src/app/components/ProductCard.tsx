"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/app/components/CartProvider";
import { useCartDrawer } from "@/app/components/CartDrawerProvider";

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

type Props = {
  product: Product;
  className?: string;
  badge?: string;
};

const ProductCard = ({ product, className, badge }: Props) => {
  const { addItem } = useCart();
  const { openDrawer } = useCartDrawer();

  const price = product.salePrice ?? product.price;
  const image = product.thumbnail || product.images?.[0] || "/next.svg";

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      productId: product._id,
      name: product.name,
      price,
      quantity: 1,
      image,
    });
    openDrawer();
  };

  return (
    <div
      className={`group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${className || ""}`}
    >
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
          {badge ? (
            <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-semibold text-white">
              {badge}
            </span>
          ) : null}
          <Image
            src={image}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-4 space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            {product.name}
          </h2>
          <p className="text-sm text-slate-500">
            {product.brand || "Base360"}
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="text-slate-900">{formatMoney(price)}</span>
            {product.salePrice && (
              <span className="text-slate-400 line-through">
                {formatMoney(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleAdd}
          className="w-full rounded-full bg-deep px-4 py-2 text-xs font-semibold text-white"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
