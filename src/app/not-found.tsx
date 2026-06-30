import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="store-shell flex min-h-[62vh] items-center justify-center py-16">
      <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-10 text-center">
        <p className="text-xs font-black uppercase text-emerald-700">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          This page is not on the shelf
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The link may have changed, or the product is no longer available.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-deep px-5 text-sm font-semibold text-white"
          >
            <ArrowLeft size={17} />
            Store home
          </Link>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700"
          >
            <Search size={17} />
            Browse products
          </Link>
        </div>
      </section>
    </main>
  );
}
