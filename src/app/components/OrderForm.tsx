"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { apiPost } from "@/lib/clientApi";

const countries = ["Bangladesh", "United States", "Canada", "United Kingdom"];

type Props = {
  product: Product;
};

const OrderForm = ({ product }: Props) => {
  const variants = useMemo(
    () => (product.variants || []).filter((v) => v.isActive !== false),
    [product.variants],
  );

  const [quantity, setQuantity] = useState(1);
  const [variantSku, setVariantSku] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(countries[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !line1 || !city || !country) {
      setError("Please fill in all required fields.");
      return;
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      setError("Quantity must be at least 1.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: [
          {
            productId: product._id,
            quantity: qty,
            variantSku: variantSku || undefined,
          },
        ],
        customer: {
          name,
          email,
          phone,
        },
        shippingAddress: {
          name,
          email,
          phone,
          line1,
          city,
          country,
        },
        billingAddress: {
          name,
          email,
          phone,
          line1,
          city,
          country,
        },
      };

      const response = await apiPost<{ orderNumber?: string }>(
        "/ecommerce/orders/guest",
        payload,
      );

      setSuccess(
        response.data?.orderNumber
          ? `Order placed: ${response.data.orderNumber}`
          : "Order placed successfully",
      );
      setQuantity(1);
      setVariantSku("");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h3 className="text-sm font-semibold text-slate-700">Quick checkout</h3>
        <p className="text-xs text-slate-500">
          Place a guest order for this product.
        </p>
      </div>

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

      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          type="number"
          min={1}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Quantity"
        />
        {variants.length > 0 ? (
          <select
            value={variantSku}
            onChange={(e) => setVariantSku(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:col-span-2"
          >
            <option value="">Select variant</option>
            {variants.map((variant) => (
              <option key={variant.sku} value={variant.sku || ""}>
                {variant.sku || "Variant"}
              </option>
            ))}
          </select>
        ) : (
          <div className="md:col-span-2 rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-400">
            No variants available
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && <p className="text-xs text-emerald-600">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-deep px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
};

export default OrderForm;
