import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Base360 Shop",
  description: "Modern ecommerce storefront powered by Base360",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-950`}
      >
        <div className='min-h-screen'>
          <header className='border-b border-slate-200 bg-white/90 backdrop-blur'>
            <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4'>
              <Link href='/' className='text-lg font-semibold tracking-tight'>
                Base360 Shop
              </Link>
              <nav className='flex items-center gap-6 text-sm text-slate-600'>
                <Link href='/products' className='hover:text-slate-900'>
                  Products
                </Link>
                <Link href='/#featured' className='hover:text-slate-900'>
                  Featured
                </Link>
                <Link href='/#about' className='hover:text-slate-900'>
                  About
                </Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className='border-t border-slate-200 bg-white'>
            <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-500'>
              <span>© 2026 Base360</span>
              <span>Built for multi-tenant commerce</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
