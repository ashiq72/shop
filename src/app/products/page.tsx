import Image from "next/image";
import { apiGetSafe } from "@/lib/api";
import type { Product } from "@/lib/types";

export default async function ProductsPage() {
  const productsRes = await apiGetSafe<Product[]>("/ecommerce/products?limit=24");
  const products = productsRes.data || [];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">All products</h1>
        <p className="text-sm text-slate-500">
          Browse the full Base360 catalog.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="text-base font-semibold text-slate-900">
                {product.name}
              </h2>
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
    </main>
  );
}
