"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Minus,
  PackageOpen,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCart } from "@/app/components/CartProvider";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
    ready,
  } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const currency = items[0]?.currency || "USD";

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => closeButtonRef.current?.focus(), 180);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div
      className={`cart-drawer-layer ${open ? "open" : ""}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="cart-drawer-backdrop"
        onClick={onClose}
        aria-label="Close shopping bag"
        tabIndex={open ? 0 : -1}
      />

      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <header className="cart-drawer-header">
          <div>
            <span className="cart-drawer-title-icon">
              <ShoppingBag size={18} />
            </span>
            <span>
              <strong>Your bag</strong>
              <small>
                {totalItems
                  ? `${totalItems} ${totalItems === 1 ? "item" : "items"}`
                  : "Ready when you are"}
              </small>
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="Close shopping bag"
            title="Close"
          >
            <X size={19} />
          </button>
        </header>

        {!ready ? (
          <div className="cart-drawer-loading">
            <i />
            <i />
            <i />
          </div>
        ) : items.length ? (
          <>
            <div className="cart-drawer-context">
              <Truck size={16} />
              <span>
                Delivery options and final rates are confirmed at checkout.
              </span>
            </div>

            <div className="cart-drawer-items">
              {items.map((item) => (
                <article className="cart-drawer-item" key={item.key}>
                  <Link
                    href={`/products/${item.productId}`}
                    className="cart-item-image"
                    onClick={onClose}
                    aria-label={`Open ${item.name}`}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="84px"
                        className="object-cover"
                      />
                    ) : (
                      <PackageOpen size={24} />
                    )}
                    <b>{item.quantity}</b>
                  </Link>

                  <div className="cart-item-content">
                    <div className="cart-item-heading">
                      <span>
                        <Link
                          href={`/products/${item.productId}`}
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        {item.variantSku ? (
                          <small>Variant: {item.variantSku}</small>
                        ) : (
                          <small>Standard product</small>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remove ${item.name}`}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-item-quantity" aria-label="Quantity">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              item.key,
                              Math.max(
                                1,
                                Math.floor(Number(event.target.value) || 1),
                              ),
                            )
                          }
                          aria-label={`${item.name} quantity`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="cart-item-pricing">
                        <strong>
                          {money(
                            item.price * item.quantity,
                            item.currency || currency,
                          )}
                        </strong>
                        {item.quantity > 1 ? (
                          <small>
                            {money(item.price, item.currency || currency)} each
                          </small>
                        ) : null}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="cart-drawer-footer">
              <div className="cart-drawer-subtotal">
                <span>
                  <strong>Subtotal</strong>
                  <small>Taxes and delivery calculated at checkout</small>
                </span>
                <strong>{money(subtotal, currency)}</strong>
              </div>

              <Link
                href="/checkout"
                className="cart-checkout-button"
                onClick={onClose}
              >
                Secure checkout
                <ArrowRight size={17} />
              </Link>
              <div className="cart-drawer-secondary-actions">
                <Link href="/cart" onClick={onClose}>
                  View full bag
                </Link>
                <button type="button" onClick={clearCart}>
                  Clear bag
                </button>
              </div>
              <p className="cart-drawer-assurance">
                <ShieldCheck size={14} />
                Inventory and pricing are rechecked before your order is placed.
              </p>
            </footer>
          </>
        ) : (
          <div className="cart-drawer-empty">
            <span>
              <ShoppingBag size={30} />
            </span>
            <p>Your bag is empty</p>
            <h2>Find something worth bringing home.</h2>
            <small>
              Browse the catalog, choose your options, and your items will
              appear here.
            </small>
            <Link href="/products" onClick={onClose}>
              Explore products
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

