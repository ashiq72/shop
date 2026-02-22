import { apiGetSafe } from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/app/components/ProductCard";

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
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}
