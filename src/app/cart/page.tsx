"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/components/CartProvider";

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart, ready } = useCart();

  if (!ready) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          Loading cart...
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse products and add your favorites to the cart.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-deep px-6 py-3 text-sm font-semibold text-white"
          >
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your cart</h1>
          <p className="text-sm text-slate-500">Review items before checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-[180px]">
                <h3 className="text-sm font-semibold text-slate-800">
                  {item.name}
                </h3>
                {item.variantSku ? (
                  <p className="text-xs text-slate-500">SKU: {item.variantSku}</p>
                ) : null}
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatMoney(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.key, item.quantity - 1)}
                  className="h-8 w-8 rounded-full border border-slate-200 text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.key, Number(e.target.value))}
                  className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-center text-sm"
                />
                <button
                  onClick={() => updateQuantity(item.key, item.quantity + 1)}
                  className="h-8 w-8 rounded-full border border-slate-200 text-sm"
                >
                  +
                </button>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatMoney(item.price * item.quantity)}
              </div>
              <button
                onClick={() => removeItem(item.key)}
                className="text-xs font-semibold text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold">{formatMoney(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Shipping</span>
            <span className="font-semibold">Calculated at checkout</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-semibold">{formatMoney(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="block rounded-full bg-deep px-6 py-3 text-center text-sm font-semibold text-white"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
