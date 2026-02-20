import Image from "next/image";
import { apiGetSafe } from "@/lib/api";
import type { Category, Product, Slider } from "@/lib/types";
import HeroSlider from "./components/HeroSlider";

const categoryColors = [
  "bg-emerald-100",
  "bg-amber-100",
  "bg-sky-100",
  "bg-rose-100",
  "bg-orange-100",
  "bg-teal-100",
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
  const sliderRes = await apiGetSafe<Slider[]>(
    "/ecommerce/sliders/active?limit=5",
  );
  const sliders = sliderRes.data || [];
  const categoriesRes = await apiGetSafe<Category[]>(
    "/ecommerce/categories?limit=6&status=active&parent=root",
  );
  const categories = categoriesRes.data || [];

  return (
    <main>
      <section className="hero-sheen">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
          <HeroSlider slides={sliders} />
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
          <a href="/categories" className="text-sm font-semibold text-sage">
            Browse all categories
          </a>
        </div>
        {categories.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-amber-100/70 bg-white px-6 py-8 text-sm text-slate-500">
            No categories found yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const color = categoryColors[index % categoryColors.length];
              return (
                <div
                  key={category._id}
                  className="flex items-center justify-between rounded-2xl border border-amber-100/70 bg-white px-5 py-5 shadow-sm transition hover:-translate-y-1"
                >
                  <div>
                    <h3 className="text-base font-semibold text-deep">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500">Browse items</p>
                  </div>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-2xl object-cover shadow-inner"
                    />
                  ) : (
                    <span
                      className={`h-12 w-12 rounded-2xl ${color} shadow-inner`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
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
