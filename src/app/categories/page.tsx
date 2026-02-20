import Image from "next/image";
import { apiGetSafe } from "@/lib/api";
import type { Category } from "@/lib/types";

const fallbackColors = [
  "bg-emerald-100",
  "bg-amber-100",
  "bg-sky-100",
  "bg-rose-100",
  "bg-orange-100",
  "bg-teal-100",
];

export default async function CategoriesPage() {
  const categoriesRes = await apiGetSafe<Category[]>(
    "/ecommerce/categories?limit=24&status=active&parent=root",
  );
  const categories = categoriesRes.data || [];

  return (
    <main className="bg-gradient-to-b from-cream via-cream to-white">
      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-deep">
              Popular categories
            </h1>
          </div>
          <a href="/products" className="text-sm font-semibold text-sage">
            Browse all categories
          </a>
        </div>

        {categories.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-amber-100/70 bg-white px-6 py-10 text-sm text-slate-500 shadow-sm">
            No categories found yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {categories.map((category, index) => {
              const fallback = fallbackColors[index % fallbackColors.length];
              return (
                <div
                  key={category._id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-amber-100/70 bg-white px-6 py-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <span
                      className={`h-14 w-14 rounded-2xl ${fallback} shadow-inner`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
