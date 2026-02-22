import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { apiGetSafe } from "@/lib/api";
import type { Branding, Category } from "@/lib/types";
import { CartProvider } from "@/app/components/CartProvider";
import HeaderActions from "@/app/components/HeaderActions";
import { CartDrawerProvider } from "@/app/components/CartDrawerProvider";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const displayFont = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "GroceryGo | Best Online Grocery Platform",
  description: "Fresh groceries, fast delivery, and weekly deals.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoriesRes = await apiGetSafe<Category[]>(
    "/ecommerce/categories/tree",
  );
  const categories = categoriesRes.data || [];
  const brandingRes = await apiGetSafe<Branding>("/ecommerce/branding");
  const branding = brandingRes.data || null;
  const desktopLogo = branding?.logoDesktop || branding?.logoMobile || "";
  const mobileLogo = branding?.logoMobile || branding?.logoDesktop || "";
  const rootCategories = categories.slice(0, 6);

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${bodyFont.variable} ${displayFont.variable} antialiased bg-cream text-slate-900`}
      >
        <CartProvider>
          <CartDrawerProvider>
            <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-white">
              <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Fresh delivery in 30-45 mins
                  </span>
                  <span>Call: +1 (800) 222-0148</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span>Email: hello@grocerygo.com</span>
                  <span>Mon - Sun: 7:00am - 11:00pm</span>
                </div>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-4">
              <Link href="/" className="flex items-center gap-3">
                {mobileLogo || desktopLogo ? (
                  <>
                    {mobileLogo ? (
                      <Image
                        src={mobileLogo}
                        alt="Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-contain md:hidden"
                      />
                    ) : null}
                    {desktopLogo ? (
                      <Image
                        src={desktopLogo}
                        alt="Logo"
                        width={120}
                        height={40}
                        className="hidden h-10 w-auto object-contain md:block"
                      />
                    ) : null}
                    <span className="text-xl font-semibold tracking-tight md:hidden">
                      GroceryGo
                    </span>
                  </>
                ) : (
                  <>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-deep text-lg font-semibold text-white shadow-sm">
                      G
                    </span>
                    <span className="text-xl font-semibold tracking-tight">
                      GroceryGo
                    </span>
                  </>
                )}
              </Link>

              <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 md:flex">
                {rootCategories.map((category) => (
                  <div key={category._id} className="group relative">
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="transition hover:text-slate-900"
                    >
                      {category.name}
                    </Link>
                    {category.children && category.children.length > 0 ? (
                      <div className="absolute left-0 top-full z-50 hidden min-w-[220px] rounded-md border border-slate-200 bg-white p-3 shadow-lg group-hover:block">
                        <div className="grid gap-2">
                          {category.children.map((child) => (
                            <Link
                              key={child._id}
                              href={`/products?category=${child.slug}`}
                              className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 transition hover:text-slate-900"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </nav>

              <div className="ml-auto hidden w-[220px] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 md:flex">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-3.5-3.5" />
                </svg>
                <span>Search</span>
              </div>

              <HeaderActions />
            </div>
          </header>
          {children}
          <footer id="contact" className="border-t border-amber-100/60 bg-white">
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-400 text-base font-semibold text-white">
                    G
                  </span>
                  <span className="text-lg font-semibold">GroceryGo</span>
                </div>
                <p className="text-sm text-slate-500">
                  Best online grocery product selling platform with fresh
                  picks, weekly deals, and fast delivery.
                </p>
              </div>
              <div className="space-y-2 text-sm text-slate-500">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Company
                </p>
                <span>About</span>
                <span>Careers</span>
                <span>Blog</span>
              </div>
              <div className="space-y-2 text-sm text-slate-500">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Support
                </p>
                <span>Help Center</span>
                <span>Track Order</span>
                <span>Returns</span>
              </div>
              <div className="space-y-2 text-sm text-slate-500">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Contact
                </p>
                <span>hello@grocerygo.com</span>
                <span>+1 (800) 222-0148</span>
                <span>101 Fresh Market Ave</span>
              </div>
            </div>
            <div className="border-t border-amber-100/60">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-xs text-slate-400">
                <span>© 2026 GroceryGo</span>
                <span>Fast, fresh, reliable.</span>
              </div>
            </div>
          </footer>
            </div>
          </CartDrawerProvider>
        </CartProvider>
      </body>
    </html>
  );
}
