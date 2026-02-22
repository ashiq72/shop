"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/app/components/CartProvider";
import { apiPost } from "@/lib/clientApi";

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const countries = ["Bangladesh", "United States", "Canada", "United Kingdom"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, ready } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(countries[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        variantSku: item.variantSku || undefined,
      })),
    [items],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!name || !email || !line1 || !city || !country) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: orderItems,
        customer: { name, email, phone },
        shippingAddress: { name, email, phone, line1, city, country },
        billingAddress: { name, email, phone, line1, city, country },
      };

      const response = await apiPost<{ orderNumber?: string }>(
        "/ecommerce/orders/guest",
        payload,
      );

      clearCart();
      setSuccess(
        response.data?.orderNumber
          ? `Order placed: ${response.data.orderNumber}`
          : "Order placed successfully",
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-slate-500">
            Add items to your cart before checking out.
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
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="text-sm text-slate-500">Confirm delivery details.</p>
        </div>
        <Link href="/cart" className="text-sm font-semibold text-slate-500">
          Back to cart
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <h2 className="text-lg font-semibold">Shipping details</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="Address line"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          {success ? <p className="text-xs text-emerald-600">{success}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-deep px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Placing order..." : "Place order"}
          </button>
        </form>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    Qty {item.quantity}
                    {item.variantSku ? ` � ${item.variantSku}` : ""}
                  </p>
                </div>
                <span className="font-semibold">
                  {formatMoney(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Shipping</span>
              <span className="font-semibold">Calculated after order</span>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-semibold">{formatMoney(subtotal)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
