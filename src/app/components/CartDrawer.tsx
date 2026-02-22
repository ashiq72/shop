"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/components/CartProvider";

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const CartDrawer = ({ open, onClose }: Props) => {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Your cart</h2>
            <p className="text-xs text-slate-500">{items.length} items</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-2 py-1 text-sm"
          >
            X
          </button>
        </div>

        <div className="px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Your cart is empty.
              <Link
                href="/products"
                className="mt-4 inline-flex rounded-full bg-deep px-5 py-2 text-xs font-semibold text-white"
                onClick={onClose}
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.name}
                    </p>
                    {item.variantSku ? (
                      <p className="text-xs text-slate-500">{item.variantSku}</p>
                    ) : null}
                    <p className="text-xs font-semibold text-slate-900">
                      {formatMoney(item.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="h-6 w-6 rounded-full border border-slate-200 text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="h-6 w-6 rounded-full border border-slate-200 text-xs"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-[11px] font-semibold text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold">{formatMoney(subtotal)}</span>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/checkout"
                className="rounded-full bg-deep px-5 py-3 text-center text-sm font-semibold text-white"
                onClick={onClose}
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-500"
              >
                Clear cart
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CartDrawer;
