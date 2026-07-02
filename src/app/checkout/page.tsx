"use client";

import { postCheckoutOrder as apiPost } from "@/lib/orderClient";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Check,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/app/components/CartProvider";
import { apiGetClient } from "@/lib/clientApi";
import type { CheckoutQuote, ShippingMethod } from "@/lib/types";

const formatMoney = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

const countries = ["Bangladesh", "United States", "Canada", "United Kingdom"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, ready } = useCart();
  const currency = items[0]?.currency || "USD";
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: countries[0],
  });
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState({ line1: "", city: "", country: countries[0] });
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [shippingMethodId, setShippingMethodId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash_on_delivery" | "bank_transfer"
  >("cash_on_delivery");
  const [campaignCode, setCampaignCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [campaignError, setCampaignError] = useState("");
  const [success, setSuccess] = useState<{ number?: string; total?: number } | null>(
    null,
  );

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        variantSku: item.variantSku || undefined,
      })),
    [items],
  );

  useEffect(() => {
    if (!ready || !items.length) return;
    let active = true;
    setLoadingMethods(true);
    apiGetClient<ShippingMethod[]>("/ecommerce/shipping-methods/available", {
      country: address.country,
      subtotal,
    })
      .then((response) => {
        if (!active) return;
        const methods = response.data || [];
        setShippingMethods(methods);
        setShippingMethodId((current) =>
          methods.some((method) => method._id === current)
            ? current
            : methods[0]?._id || "",
        );
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Delivery options failed");
      })
      .finally(() => {
        if (active) setLoadingMethods(false);
      });
    return () => {
      active = false;
    };
  }, [address.country, items.length, ready, subtotal]);

  useEffect(() => {
    if (!shippingMethodId || !orderItems.length) {
      setQuote(null);
      return;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      setQuoting(true);
      setCampaignError("");
      apiPost<CheckoutQuote>("/ecommerce/orders/quote", {
        items: orderItems,
        country: address.country,
        shippingMethodId,
        campaignCode: appliedCode || undefined,
      })
        .then((response) => {
          if (active) setQuote(response.data);
        })
        .catch((err: unknown) => {
          if (!active) return;
          setQuote(null);
          const message = err instanceof Error ? err.message : "Quote failed";
          if (appliedCode) setCampaignError(message);
          else setError(message);
        })
        .finally(() => {
          if (active) setQuoting(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [address.country, appliedCode, orderItems, shippingMethodId]);

  const applyCampaign = () => {
    setCampaignError("");
    setAppliedCode(campaignCode.trim().toUpperCase());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!quote || !shippingMethodId) {
      setError("Choose a delivery method and wait for the order total.");
      return;
    }
    if (!contact.name || !contact.email || !contact.phone) {
      setError("Complete your contact information.");
      return;
    }
    if (!address.line1 || !address.city || !address.country) {
      setError("Complete your delivery address.");
      return;
    }
    if (!billingSame && (!billing.line1 || !billing.city || !billing.country)) {
      setError("Complete your billing address.");
      return;
    }

    const shippingAddress = { ...contact, ...address };
    const billingAddress = billingSame
      ? shippingAddress
      : { ...contact, ...billing };

    setLoading(true);
    try {
      const response = await apiPost<{ orderNumber?: string; total?: number }>(
        "/ecommerce/orders/guest",
        {
          items: orderItems,
          customer: contact,
          shippingAddress,
          billingAddress,
          shippingMethodId,
          campaignCode: appliedCode || undefined,
          paymentMethod,
        },
      );
      setSuccess({
        number: response.data?.orderNumber,
        total: response.data?.total,
      });
      clearCart();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return <main className="checkout-loading">Preparing secure checkout...</main>;
  }

  if (success) {
    return (
      <main className="checkout-success store-shell">
        <div>
          <BadgeCheck size={52} />
          <p>Order confirmed</p>
          <h1>Thank you for your order.</h1>
          <span>
            {success.number ? `Order ${success.number}` : "Your order was created"}
            {success.total !== undefined
              ? ` for ${formatMoney(success.total, currency)}`
              : ""}
            .
          </span>
          <Link href="/products">Continue shopping</Link>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="checkout-empty store-shell">
        <PackageCheck size={42} />
        <h1>Your bag is empty</h1>
        <p>Add a few products before starting checkout.</p>
        <Link href="/products">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="checkout-page store-shell">
      <div className="checkout-title">
        <div>
          <Link href="/cart">
            <ArrowLeft size={16} />
            Return to bag
          </Link>
          <h1>Checkout</h1>
          <p>Delivery and totals are verified securely before your order is placed.</p>
        </div>
        <span>
          <ShieldCheck size={18} />
          Secure tenant checkout
        </span>
      </div>

      <form onSubmit={handleSubmit} className="checkout-layout">
        <div className="checkout-flow">
          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>1</span>
              <div>
                <h2>Contact</h2>
                <p>We use this for delivery updates.</p>
              </div>
            </div>
            <div className="checkout-fields">
              <label>
                Full name
                <input
                  value={contact.name}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, name: event.target.value }))
                  }
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={contact.email}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, email: event.target.value }))
                  }
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Phone
                <input
                  value={contact.phone}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, phone: event.target.value }))
                  }
                  autoComplete="tel"
                  required
                />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>2</span>
              <div>
                <h2>Delivery address</h2>
                <p>Choose the country first to see eligible logistics.</p>
              </div>
            </div>
            <div className="checkout-fields">
              <label className="field-wide">
                Address
                <input
                  value={address.line1}
                  onChange={(event) =>
                    setAddress((current) => ({ ...current, line1: event.target.value }))
                  }
                  autoComplete="address-line1"
                  required
                />
              </label>
              <label className="field-wide">
                Apartment, suite, or unit
                <input
                  value={address.line2}
                  onChange={(event) =>
                    setAddress((current) => ({ ...current, line2: event.target.value }))
                  }
                  autoComplete="address-line2"
                />
              </label>
              <label>
                City
                <input
                  value={address.city}
                  onChange={(event) =>
                    setAddress((current) => ({ ...current, city: event.target.value }))
                  }
                  required
                />
              </label>
              <label>
                State or district
                <input
                  value={address.state}
                  onChange={(event) =>
                    setAddress((current) => ({ ...current, state: event.target.value }))
                  }
                />
              </label>
              <label>
                Postal code
                <input
                  value={address.postalCode}
                  onChange={(event) =>
                    setAddress((current) => ({
                      ...current,
                      postalCode: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Country
                <select
                  value={address.country}
                  onChange={(event) =>
                    setAddress((current) => ({ ...current, country: event.target.value }))
                  }
                >
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>3</span>
              <div>
                <h2>Delivery method</h2>
                <p>Rates and estimates come from the store logistics settings.</p>
              </div>
            </div>
            <div className="shipping-options">
              {loadingMethods ? <p>Loading delivery options...</p> : null}
              {!loadingMethods && !shippingMethods.length ? (
                <p>No delivery method is available for this country.</p>
              ) : null}
              {shippingMethods.map((method) => (
                <label
                  key={method._id}
                  className={
                    shippingMethodId === method._id
                      ? "shipping-option selected"
                      : "shipping-option"
                  }
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method._id}
                    checked={shippingMethodId === method._id}
                    onChange={() => setShippingMethodId(method._id)}
                  />
                  <Truck size={20} />
                  <span>
                    <strong>{method.name}</strong>
                    <small>
                      {method.description ||
                        `${method.minDeliveryDays}-${method.maxDeliveryDays} business days`}
                    </small>
                  </span>
                  <b>
                    {method.calculatedPrice === 0
                      ? "Free"
                      : formatMoney(method.calculatedPrice, currency)}
                  </b>
                </label>
              ))}
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-title">
              <span>4</span>
              <div>
                <h2>Payment</h2>
                <p>Select how this order will be paid.</p>
              </div>
            </div>
            <div className="payment-options">
              <label className={paymentMethod === "cash_on_delivery" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={() => setPaymentMethod("cash_on_delivery")}
                />
                <Banknote size={20} />
                <span>
                  <strong>Cash on delivery</strong>
                  <small>Pay when your order arrives</small>
                </span>
              </label>
              <label className={paymentMethod === "bank_transfer" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                />
                <CreditCard size={20} />
                <span>
                  <strong>Bank transfer</strong>
                  <small>Payment instructions follow confirmation</small>
                </span>
              </label>
            </div>
            <label className="billing-toggle">
              <input
                type="checkbox"
                checked={billingSame}
                onChange={(event) => setBillingSame(event.target.checked)}
              />
              Billing address is the same as delivery
            </label>
            {!billingSame ? (
              <div className="checkout-fields billing-fields">
                <label className="field-wide">
                  Billing address
                  <input
                    value={billing.line1}
                    onChange={(event) =>
                      setBilling((current) => ({ ...current, line1: event.target.value }))
                    }
                  />
                </label>
                <label>
                  City
                  <input
                    value={billing.city}
                    onChange={(event) =>
                      setBilling((current) => ({ ...current, city: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Country
                  <select
                    value={billing.country}
                    onChange={(event) =>
                      setBilling((current) => ({
                        ...current,
                        country: event.target.value,
                      }))
                    }
                  >
                    {countries.map((country) => (
                      <option key={country}>{country}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.key}>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    Qty {item.quantity}
                    {item.variantSku ? ` / ${item.variantSku}` : ""}
                  </small>
                </span>
                <b>{formatMoney(item.price * item.quantity, item.currency)}</b>
              </div>
            ))}
          </div>

          <div className="campaign-code">
            <label htmlFor="campaignCode">Campaign code</label>
            <div>
              <input
                id="campaignCode"
                value={campaignCode}
                onChange={(event) => setCampaignCode(event.target.value)}
                placeholder="SAVE10"
              />
              <button type="button" onClick={applyCampaign} disabled={!campaignCode.trim()}>
                Apply
              </button>
            </div>
            {quote?.campaign ? (
              <p className="campaign-applied">
                <Check size={14} />
                {quote.campaign.name} applied
              </p>
            ) : null}
            {campaignError ? <p className="checkout-error">{campaignError}</p> : null}
          </div>

          <dl className="checkout-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(quote?.subtotal ?? subtotal, currency)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>
                {quoting
                  ? "Calculating..."
                  : quote
                    ? quote.shipping === 0
                      ? "Free"
                      : formatMoney(quote.shipping, currency)
                    : "Select method"}
              </dd>
            </div>
            {quote?.discount ? (
              <div className="discount">
                <dt>Discount</dt>
                <dd>-{formatMoney(quote.discount, currency)}</dd>
              </div>
            ) : null}
            <div className="total">
              <dt>Total</dt>
              <dd>{formatMoney(quote?.total ?? subtotal, currency)}</dd>
            </div>
          </dl>

          {error ? <p className="checkout-error">{error}</p> : null}
          <button
            type="submit"
            className="place-order-button"
            disabled={loading || quoting || !quote}
          >
            {loading ? "Placing order..." : "Place order"}
          </button>
          <p className="checkout-assurance">
            <MapPin size={15} />
            Delivery availability and price are rechecked when you order.
          </p>
        </aside>
      </form>
    </main>
  );
}
