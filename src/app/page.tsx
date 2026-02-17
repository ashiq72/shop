import Image from "next/image";
import { apiGetSafe } from "@/lib/api";
import type { Product } from "@/lib/types";

export default async function Home() {
  const productsRes = await apiGetSafe<Product[]>("/ecommerce/products?limit=8");
  const products = productsRes.data || [];

  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
              New season
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Curated products for modern commerce teams.
            </h1>
            <p className="text-base leading-relaxed text-white/70">
              Built on Base360&apos;s multi-tenant backend. Fast search, flexible
              categories, and inventory-aware checkout ready for scale.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/products"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900"
              >
                Browse products
              </a>
              <a
                href="#featured"
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white"
              >
                View featured
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-white/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
              <Image
                src="/next.svg"
                alt="Hero graphic"
                width={480}
                height={320}
                className="h-56 w-full object-contain"
                priority
              />
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/70">
                <div>
                  <p className="text-2xl font-semibold text-white">30+</p>
                  <p>Categories ready</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">99%</p>
                  <p>Inventory accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">24/7</p>
                  <p>Ops visibility</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">1-click</p>
                  <p>Restock actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured products</h2>
            <p className="text-sm text-slate-500">
              Hand-picked items available now.
            </p>
          </div>
          <a href="/products" className="text-sm font-semibold text-slate-700">
            View all
          </a>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <a
              key={product._id}
              href={`/products/${product._id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={product.thumbnail || "/next.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-base font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {product.brand || "Base360"}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-slate-900">
                    ${product.salePrice ?? product.price}
                  </span>
                  {product.salePrice && (
                    <span className="text-slate-400 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">Inventory aware</h3>
              <p className="text-sm text-slate-500">
                Track stock, reserve units, and commit orders without leaving the
                dashboard.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Review ready</h3>
              <p className="text-sm text-slate-500">
                Moderate customer reviews and highlight trusted feedback.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Facet search</h3>
              <p className="text-sm text-slate-500">
                Filter by brand, tags, and attributes instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
