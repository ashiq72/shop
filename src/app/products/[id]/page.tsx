import Image from "next/image";
import { apiGet } from "@/lib/api";
import type { Product, ReviewSummary } from "@/lib/types";

type PageProps = {
  params: { id: string };
};

export default async function ProductDetail({ params }: PageProps) {
  const isValidId = /^[0-9a-fA-F]{24}$/.test(params.id);
  if (!isValidId) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold">Invalid product</h1>
          <p className="mt-2 text-sm text-slate-500">
            The product link is invalid. Please return to the catalog.
          </p>
        </div>
      </main>
    );
  }
  let productRes: { data: Product };
  let summaryRes: { data: ReviewSummary };
  try {
    productRes = await apiGet<Product>(`/ecommerce/products/${params.id}`);
    summaryRes = await apiGet<ReviewSummary>(
      `/ecommerce/products/${params.id}/reviews/summary`,
    );
  } catch (err) {
    console.error(err);
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold">Product unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">
            We could not load this product. Please check your tenant id and API
            base URL.
          </p>
        </div>
      </main>
    );
  }

  const product = productRes.data;
  const summary = summaryRes.data;
  const images = product.images && product.images.length
    ? product.images
    : [product.thumbnail || "/next.svg"];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <Image
              src={images[0] || "/next.svg"}
              alt={product.name}
              width={720}
              height={720}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {images.slice(0, 3).map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <Image
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  width={240}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-slate-500">{product.brand || "Base360"}</p>
            <h1 className="text-3xl font-semibold">{product.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-slate-900">
              ${product.salePrice ?? product.price}
            </span>
            {product.salePrice && (
              <span className="text-slate-400 line-through">
                ${product.price}
              </span>
            )}
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {product.trackStock === false
                ? "Unlimited"
                : `${product.stock ?? 0} in stock`}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {product.description || "No description provided."}
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Review summary
            </h3>
            <div className="mt-3 flex items-center gap-6">
              <div>
                <p className="text-2xl font-semibold">{summary.average.toFixed(1)}</p>
                <p className="text-xs text-slate-500">
                  {summary.total} reviews
                </p>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                {summary.breakdown.map((row) => (
                  <div key={row.rating} className="flex items-center gap-2">
                    <span>{row.rating}★</span>
                    <span>{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-700">
                Variants
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                {product.variants.map((variant) => (
                  <div
                    key={variant.sku}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <span>{variant.sku || "Variant"}</span>
                    <span className="font-semibold">
                      ${variant.salePrice ?? variant.price ?? product.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
