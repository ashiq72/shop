import Image from "next/image";
import { apiGetSafe } from "@/lib/api";
import type { Product } from "@/lib/types";

const categories = [
  { title: "Fresh Vegetables", items: "182 items", color: "bg-emerald-100" },
  { title: "Organic Fruits", items: "124 items", color: "bg-amber-100" },
  { title: "Dairy & Eggs", items: "86 items", color: "bg-sky-100" },
  { title: "Bakery", items: "56 items", color: "bg-rose-100" },
  { title: "Meat & Seafood", items: "94 items", color: "bg-orange-100" },
  { title: "Beverages", items: "102 items", color: "bg-teal-100" },
];

const blogs = [
  {
    title: "How to pick the freshest produce every time",
    tag: "Fresh Tips",
  },
  {
    title: "Meal prep shortcuts for a busy week",
    tag: "Grocery Hacks",
  },
  {
    title: "Build a balanced pantry for every season",
    tag: "Healthy Living",
  },
];

export default async function Home() {
  const productsRes = await apiGetSafe<Product[]>("/ecommerce/products?limit=8");
  const products = productsRes.data || [];

  return (
    <main>
      <section className="hero-sheen">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage shadow-sm">
              Only this week
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-deep md:text-5xl">
              Shopping with us for better quality and the best price.
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              Your everyday grocery partner with fresh picks, local farms, and
              same-day delivery across the city.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/products"
                className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-200/60"
              >
                Shop now
              </a>
              <a
                href="#featured"
                className="rounded-full border border-sage/20 px-6 py-3 text-sm font-semibold text-sage"
              >
                View deals
              </a>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {[
                { label: "Daily fresh", value: "200+" },
                { label: "Local farms", value: "54" },
                { label: "Avg. delivery", value: "38 min" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-amber-100/70 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm"
                >
                  <p className="text-lg font-semibold text-deep">
                    {item.value}
                  </p>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-4 top-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="glass-card relative overflow-hidden rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Weekly combo
                  </p>
                  <p className="font-display text-2xl font-semibold text-deep">
                    Fresh juice bundle
                  </p>
                </div>
                <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-white">
                  -25%
                </span>
              </div>
              <div className="mt-8 grid grid-cols-3 items-end gap-4">
                <div className="float-slow h-40 rounded-2xl bg-gradient-to-b from-amber-200 to-amber-50 shadow-sm" />
                <div className="float-fast h-52 rounded-2xl bg-gradient-to-b from-rose-200 to-rose-50 shadow-sm" />
                <div className="float-slow h-44 rounded-2xl bg-gradient-to-b from-emerald-200 to-emerald-50 shadow-sm" />
              </div>
              <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
                <span>Orange, beet, green detox</span>
                <span className="font-semibold text-deep">$18.75</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Shop by
            </p>
            <h2 className="font-display text-3xl font-semibold text-deep">
              Popular categories
            </h2>
          </div>
          <a href="/products" className="text-sm font-semibold text-sage">
            Browse all categories
          </a>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className="flex items-center justify-between rounded-2xl border border-amber-100/70 bg-white px-5 py-5 shadow-sm transition hover:-translate-y-1"
            >
              <div>
                <h3 className="text-base font-semibold text-deep">
                  {category.title}
                </h3>
                <p className="text-sm text-slate-500">{category.items}</p>
              </div>
              <span
                className={`h-12 w-12 rounded-2xl ${category.color} shadow-inner`}
              />
            </div>
          ))}
        </div>
      </section>

      <section id="search" className="mx-auto w-full max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-amber-100/70 bg-white px-6 py-10 shadow-sm md:px-10">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-semibold text-deep">
                Find groceries in a flash
              </h3>
              <p className="text-sm text-slate-500">
                Search by brand, category, or fresh deals curated daily.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                placeholder="Search for apples, milk, bread..."
                className="min-w-[220px] flex-1 rounded-full border border-amber-100/70 px-4 py-3 text-sm text-slate-600 outline-none focus:border-sage"
              />
              <a
                href="/products"
                className="rounded-full bg-deep px-5 py-3 text-sm font-semibold text-white"
              >
                Search
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Best picks
            </p>
            <h2 className="font-display text-3xl font-semibold text-deep">
              Featured products
            </h2>
          </div>
          <a href="/products" className="text-sm font-semibold text-sage">
            View all products
          </a>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <a
              key={product._id}
              href={`/products/${product._id}`}
              className="group rounded-3xl border border-amber-100/70 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative overflow-hidden rounded-2xl bg-cream-strong">
                <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-semibold text-white">
                  Fresh
                </span>
                <Image
                  src={product.thumbnail || "/next.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-base font-semibold text-deep">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {product.brand || "GroceryGo"}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-deep">
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

      <section id="gallery" className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Our promise
            </p>
            <h3 className="font-display text-3xl font-semibold text-deep">
              Farm-fresh produce, everyday essentials, delivered with care.
            </h3>
            <p className="text-sm text-slate-500">
              We partner with nearby farms and local suppliers to keep your
              pantry stocked with the freshest selection.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Live order tracking",
                "Cold chain storage",
                "Hand-picked quality",
                "Eco-friendly packaging",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-amber-100/70 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["bg-emerald-100", "bg-amber-100", "bg-rose-100", "bg-sky-100"].map(
              (color, index) => (
                <div
                  key={`${color}-${index}`}
                  className={`h-40 rounded-3xl ${color} shadow-inner`}
                />
              )
            )}
          </div>
        </div>
      </section>

      <section id="blogs" className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-amber-100/70 bg-white px-6 py-10 shadow-sm md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Grocery stories
              </p>
              <h3 className="font-display text-2xl font-semibold text-deep">
                Fresh ideas for your kitchen
              </h3>
            </div>
            <a href="#" className="text-sm font-semibold text-sage">
              Read more
            </a>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog.title}
                className="rounded-2xl border border-amber-100/70 bg-cream px-5 py-6 text-sm shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {blog.tag}
                </p>
                <p className="mt-3 text-base font-semibold text-deep">
                  {blog.title}
                </p>
                <p className="mt-4 text-xs text-slate-500">5 min read</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
