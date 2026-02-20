import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-6 py-16">
      <div className="glass-card relative w-full max-w-2xl overflow-hidden rounded-[32px] p-10 text-center">
        <div
          className="hero-sheen pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="relative z-10 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            404
          </p>
          <h1 className="font-display text-4xl text-slate-900">
            This page is not on the shelf
          </h1>
          <p className="text-sm text-slate-600">
            The link may be broken or the product moved. Try these instead.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Back to home
            </Link>
            <Link
              href="/#search"
              className="rounded-full border border-amber-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-amber-50"
            >
              Search products
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
