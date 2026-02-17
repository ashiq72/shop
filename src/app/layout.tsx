import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${bodyFont.variable} ${displayFont.variable} antialiased bg-cream text-slate-900`}
      >
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-amber-100/60 bg-white/80 backdrop-blur">
            <div className="border-b border-amber-100/60 bg-amber-50/70">
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
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400 text-lg font-semibold text-white shadow-sm">
                  G
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  GroceryGo
                </span>
              </Link>
              <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                <Link href="/" className="hover:text-slate-900">
                  Home
                </Link>
                <Link href="/#categories" className="hover:text-slate-900">
                  Category
                </Link>
                <Link href="/#search" className="hover:text-slate-900">
                  Search
                </Link>
                <Link href="/#gallery" className="hover:text-slate-900">
                  Gallery
                </Link>
                <Link href="/#blogs" className="hover:text-slate-900">
                  Blogs
                </Link>
                <Link href="/#contact" className="hover:text-slate-900">
                  Contact Us
                </Link>
              </nav>
              <div className="flex items-center gap-3">
                <button className="hidden rounded-full border border-amber-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 md:inline-flex">
                  USD
                </button>
                <button className="relative grid h-10 w-10 place-items-center rounded-full border border-amber-200 text-slate-700 hover:bg-amber-50">
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[10px] font-semibold text-white">
                    0
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6h15l-1.5 9h-12z" />
                    <circle cx="9" cy="20" r="1.5" />
                    <circle cx="18" cy="20" r="1.5" />
                  </svg>
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-amber-200 text-slate-700 hover:bg-amber-50">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
              </div>
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
      </body>
    </html>
  );
}
