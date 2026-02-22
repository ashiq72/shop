"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/types";
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
};

const AddToCart = ({ product }: Props) => {
  const { addItem } = useCart();
  const { openDrawer } = useCartDrawer();
  const variants = useMemo(
    () => (product.variants || []).filter((v) => v.isActive !== false),
    [product.variants],
  );
  const [variantSku, setVariantSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    if (!variantSku) return undefined;
    return variants.find((variant) => variant.sku === variantSku);
  }, [variantSku, variants]);

  const price =
    selectedVariant?.salePrice ??
    selectedVariant?.price ??
    product.salePrice ??
    product.price;

  const image = product.thumbnail || product.images?.[0];

  const handleAdd = () => {
    setMessage("");
    if (variants.length > 0 && !variantSku) {
      setMessage("Select a variant first.");
      return;
    }
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      setMessage("Quantity must be at least 1.");
      return;
    }
    addItem({
      productId: product._id,
      name: product.name,
      price,
      quantity: qty,
      variantSku: variantSku || undefined,
      image,
    });
    openDrawer();
    setMessage("Added to cart.");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Add to cart</h3>
        <span className="text-sm font-semibold text-slate-900">
          {formatMoney(price)}
        </span>
      </div>

      {variants.length > 0 ? (
        <select
          value={variantSku}
          onChange={(e) => setVariantSku(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Select variant</option>
          {variants.map((variant) => (
            <option key={variant.sku} value={variant.sku || ""}>
              {variant.sku || "Variant"}
            </option>
          ))}
        </select>
      ) : null}

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-full bg-deep px-5 py-3 text-sm font-semibold text-white"
        >
          Add to cart
        </button>
      </div>

      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </div>
  );
};

export default AddToCart;
