"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Heart,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  MapPin,
  PackageCheck,
  Save,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import type { AccountUser, ShopOrder } from "@/lib/types";
import {
  apiGetAuth,
  apiPatchAuth,
} from "@/lib/clientApi";
import { useAccount } from "@/app/components/AccountProvider";
import { useWishlist } from "@/app/components/WishlistProvider";
import ProductCard from "@/app/components/ProductCard";

type AccountTab = "profile" | "wishlist" | "orders" | "security";

const money = (amount = 0, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const accountTabs: Array<{
  id: AccountTab;
  label: string;
  icon: typeof UserRound;
}> = [
  { id: "profile", label: "Your information", icon: UserRound },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "security", label: "Password", icon: ShieldCheck },
];

export default function AccountProfilePage() {
  const router = useRouter();
  const { user, ready, signedIn, signOut, refreshAccount } = useAccount();
  const { items: wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");

  useEffect(() => {
    if (ready && !signedIn) {
      router.replace("/account/login?returnTo=%2Faccount%2Fprofile");
    }
  }, [ready, router, signedIn]);

  if (!ready || !user) {
    return (
      <main className="account-center-loading store-shell">
        <LoaderCircle size={22} className="animate-spin" />
        Loading your account...
      </main>
    );
  }

  const logout = () => {
    signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <main className="account-center store-shell">
      <header className="account-center-header">
        <div className="account-profile-identity">
          <span className="account-profile-avatar">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "Account"}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              (user.name || user.email || "A").slice(0, 1).toUpperCase()
            )}
          </span>
          <span>
            <p>Customer account</p>
            <h1>{user.name || "Your profile"}</h1>
            <small>{user.email}</small>
          </span>
        </div>
        <div className="account-profile-summary">
          <span>
            <Heart size={16} />
            <strong>{wishlistItems.length}</strong>
            saved
          </span>
          <button type="button" onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>

      <div className="account-center-layout">
        <nav className="account-center-nav" aria-label="Account sections">
          {accountTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={17} />
              <span>{tab.label}</span>
              <ArrowRight size={14} />
            </button>
          ))}
        </nav>

        <section className="account-center-content">
          {activeTab === "profile" ? (
            <ProfileInformation
              key={user._id || user.userId || user.email}
              user={user}
              onSaved={refreshAccount}
            />
          ) : null}
          {activeTab === "wishlist" ? <ProfileWishlist /> : null}
          {activeTab === "orders" ? <ProfileOrders /> : null}
          {activeTab === "security" ? <PasswordSecurity /> : null}
        </section>
      </div>
    </main>
  );
}

function ProfileInformation({
  user,
  onSaved,
}: {
  user: AccountUser;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: user.name || "",
    gender: user.gender || "",
    bio: user.bio || "",
    location: user.location || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await apiPatchAuth<AccountUser>("/users/update-user", {
        name: form.name.trim(),
        gender: form.gender || undefined,
        bio: form.bio.trim(),
        location: form.location.trim(),
      });
      await onSaved();
      setMessage("Your information has been updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-section">
      <header>
        <p>Personal details</p>
        <h2>Your information</h2>
        <span>Keep your delivery contact and profile details current.</span>
      </header>
      <form className="profile-information-form" onSubmit={submit}>
        <label>
          Full name
          <input
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            autoComplete="name"
            required
          />
        </label>
        <label>
          Email address
          <input value={user.email || ""} readOnly />
          <small>Verified account email</small>
        </label>
        <label>
          Gender
          <select
            value={form.gender}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gender: event.target.value as AccountUser["gender"] | "",
              }))
            }
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Location
          <div className="profile-input-icon">
            <MapPin size={16} />
            <input
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder="City or region"
            />
          </div>
        </label>
        <label className="profile-field-wide">
          About you
          <textarea
            rows={4}
            value={form.bio}
            onChange={(event) =>
              setForm((current) => ({ ...current, bio: event.target.value }))
            }
            placeholder="Optional profile note"
          />
        </label>
        {message ? <p className="account-form-success">{message}</p> : null}
        {error ? <p className="account-form-error">{error}</p> : null}
        <button type="submit" disabled={saving}>
          {saving ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save information"}
        </button>
      </form>
    </div>
  );
}

function ProfileWishlist() {
  const { items, ready, clearWishlist } = useWishlist();
  return (
    <div className="account-section">
      <header className="account-section-actions">
        <div>
          <p>Saved products</p>
          <h2>Your wishlist</h2>
          <span>{items.length} products saved to your account.</span>
        </div>
        {items.length ? (
          <button type="button" onClick={() => void clearWishlist()}>
            Clear wishlist
          </button>
        ) : null}
      </header>
      {!ready ? (
        <div className="account-inline-loading">
          <LoaderCircle size={18} className="animate-spin" />
          Loading wishlist...
        </div>
      ) : items.length ? (
        <div className="profile-wishlist-grid">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="account-empty-state">
          <Heart size={30} />
          <h3>No saved products</h3>
          <p>Use the heart button on a product to keep it here.</p>
        </div>
      )}
    </div>
  );
}

function ProfileOrders() {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGetAuth<ShopOrder[]>("/ecommerce/orders/my?limit=50")
      .then((response) => setOrders(response.data || []))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Orders could not be loaded"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="account-section">
      <header>
        <p>Purchase history</p>
        <h2>Your orders</h2>
        <span>Review payment, delivery, and fulfillment progress.</span>
      </header>
      {loading ? (
        <div className="account-inline-loading">
          <LoaderCircle size={18} className="animate-spin" />
          Loading orders...
        </div>
      ) : error ? (
        <p className="account-form-error">{error}</p>
      ) : orders.length ? (
        <div className="profile-order-list">
          {orders.map((order) => (
            <article key={order._id}>
              <header>
                <span>
                  <small>Order</small>
                  <strong>{order.orderNumber || order._id.slice(-8)}</strong>
                </span>
                <span className={`profile-order-status ${order.status || "pending"}`}>
                  {order.status || "pending"}
                </span>
              </header>
              <div className="profile-order-items">
                {(order.items || []).slice(0, 3).map((item, index) => (
                  <div key={`${item.product || item.name}-${index}`}>
                    <span className="profile-order-image">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="42px"
                          className="object-cover"
                        />
                      ) : (
                        <PackageCheck size={17} />
                      )}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>
                        Qty {item.quantity}
                        {item.variantSku ? ` / ${item.variantSku}` : ""}
                      </small>
                    </span>
                  </div>
                ))}
                {(order.items?.length || 0) > 3 ? (
                  <small>+{(order.items?.length || 0) - 3} more items</small>
                ) : null}
              </div>
              <footer>
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "Recent order"}
                </span>
                <span>{order.shippingMethod?.name || "Delivery pending"}</span>
                <strong>{money(order.total, order.currency)}</strong>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="account-empty-state">
          <ShoppingBag size={30} />
          <h3>No orders yet</h3>
          <p>Your completed storefront orders will appear here.</p>
        </div>
      )}
    </div>
  );
}

function PasswordSecurity() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await apiPatchAuth<null>("/auth/change-password", form);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-section">
      <header>
        <p>Account security</p>
        <h2>Change password</h2>
        <span>Use a unique password containing letters and numbers.</span>
      </header>
      <form className="profile-password-form" onSubmit={submit}>
        <label>
          Current password
          <div>
            <LockKeyhole size={16} />
            <input
              type="password"
              value={form.currentPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
              autoComplete="current-password"
              required
            />
          </div>
        </label>
        <label>
          New password
          <div>
            <LockKeyhole size={16} />
            <input
              type="password"
              value={form.newPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>
        </label>
        <label>
          Confirm new password
          <div>
            <ShieldCheck size={16} />
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>
        </label>
        {message ? <p className="account-form-success">{message}</p> : null}
        {error ? <p className="account-form-error">{error}</p> : null}
        <button type="submit" disabled={saving}>
          {saving ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <LockKeyhole size={16} />
          )}
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

