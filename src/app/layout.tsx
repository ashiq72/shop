import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { PackageCheck, Search } from "lucide-react";
import "./globals.css";
import "./brands.css";
import "./cart-drawer.css";
import "./account-profile.css";
import { apiGetSafe, getStoreTenantId } from "@/lib/api";
import type { Branding, Category } from "@/lib/types";
import { CartProvider } from "@/app/components/CartProvider";
import HeaderActions from "@/app/components/HeaderActions";
import { CartDrawerProvider } from "@/app/components/CartDrawerProvider";
import { WishlistProvider } from "@/app/components/WishlistProvider";
import { AccountProvider } from "@/app/components/AccountProvider";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fallbackStoreName =
  process.env.NEXT_PUBLIC_STORE_NAME || "Commerce360 Store";

export async function generateMetadata(): Promise<Metadata> {
  const response = await apiGetSafe<Branding>("/ecommerce/branding");
  const branding = response.data || {};
  const storeName = branding.storeName || fallbackStoreName;
  return {
    title: {
      default: storeName,
      template: `%s | ${storeName}`,
    },
    description:
      branding.tagline ||
      "Shop quality products from a trusted local storefront.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [categoriesResponse, brandingResponse] = await Promise.all([
    apiGetSafe<Category[]>("/ecommerce/categories/tree"),
    apiGetSafe<Branding>("/ecommerce/branding"),
  ]);
  const categories = categoriesResponse.data || [];
  const branding = brandingResponse.data || {};
  const storeName = branding.storeName || fallbackStoreName;
  const desktopLogo = branding.logoDesktop || branding.logoMobile;
  const mobileLogo = branding.logoMobile || branding.logoDesktop;
  const navigationCategories = categories.slice(0, 7);

  return (
    <html lang="en">
      <body className={bodyFont.variable} suppressHydrationWarning>
        <AccountProvider>
          <CartProvider tenantId={getStoreTenantId()}>
            <WishlistProvider>
              <CartDrawerProvider>
            <div className="store-page">
              <header className="store-header">
                {branding.announcement ? (
                  <div className="store-announcement">
                    <PackageCheck size={15} />
                    <span>{branding.announcement}</span>
                  </div>
                ) : null}

                <div className="store-shell store-header-main">
                  <Link href="/" className="store-brand" aria-label={storeName}>
                    {desktopLogo || mobileLogo ? (
                      <>
                        {mobileLogo ? (
                          <Image
                            src={mobileLogo}
                            alt=""
                            width={42}
                            height={42}
                            className="store-logo-mobile"
                          />
                        ) : null}
                        {desktopLogo ? (
                          <Image
                            src={desktopLogo}
                            alt=""
                            width={150}
                            height={44}
                            className="store-logo-desktop"
                          />
                        ) : null}
                      </>
                    ) : (
                      <span className="store-brand-mark">
                        {storeName.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <strong>{storeName}</strong>
                  </Link>

                  <form className="store-search" action="/products">
                    <Search size={18} />
                    <input
                      name="search"
                      aria-label="Search products"
                      placeholder="Search products, brands, or categories"
                    />
                    <button type="submit">Search</button>
                  </form>

                  <HeaderActions />
                </div>

                <nav className="store-category-nav" aria-label="Product categories">
                  <div className="store-shell">
                    <Link href="/products">Shop all</Link>
                    <Link href="/collections">Collections</Link>
                    <Link href="/campaigns">Offers</Link>
                    <Link href="/brands">Brands</Link>
                    {navigationCategories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/products?category=${category._id}`}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link href="/categories">All categories</Link>
                    <Link href="/cart" className="mobile-nav-cart">
                      Bag
                    </Link>
                    <Link href="/wishlist" className="mobile-nav-cart">
                      Wishlist
                    </Link>
                    <Link href="/account/login" className="mobile-nav-cart">
                      Account
                    </Link>
                  </div>
                </nav>
              </header>

              {children}

              <footer className="store-footer">
                <div className="store-shell store-footer-grid">
                  <div>
                    <div className="store-footer-brand">
                      <span>{storeName.slice(0, 1).toUpperCase()}</span>
                      <strong>{storeName}</strong>
                    </div>
                    <p>
                      {branding.tagline ||
                        "Thoughtful products, clear pricing, and dependable service."}
                    </p>
                  </div>
                  <div>
                    <strong>Shop</strong>
                    <Link href="/products">All products</Link>
                    <Link href="/categories">Categories</Link>
                    <Link href="/brands">Brands</Link>
                    <Link href="/collections">Collections</Link>
                    <Link href="/campaigns">Offers</Link>
                    <Link href="/wishlist">Wishlist</Link>
                    <Link href="/account/login">Account</Link>
                    <Link href="/cart">Shopping bag</Link>
                  </div>
                  <div>
                    <strong>Customer care</strong>
                    <span>{branding.supportEmail || "Support email coming soon"}</span>
                    <span>{branding.supportPhone || "Support phone coming soon"}</span>
                    <span>{branding.address || "Online storefront"}</span>
                  </div>
                </div>
                <div className="store-shell store-footer-bottom">
                  <span>© 2026 {storeName}</span>
                  <span>Secure tenant storefront</span>
                </div>
              </footer>
            </div>
              </CartDrawerProvider>
            </WishlistProvider>
          </CartProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
