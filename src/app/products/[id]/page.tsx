import Image from "next/image";
import { Download } from "lucide-react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { Product, ReviewSummary } from "@/lib/types";
import AddToCart from "@/app/components/AddToCart";
import WishlistButton from "@/app/components/WishlistButton";

const formatMoney = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function ProductDetail({ params }: PageProps) {
  let productRes: { data: Product };
  let summaryRes: { data: ReviewSummary } | null = null;
  const resolvedParams = await Promise.resolve(params);
  const rawId = decodeURIComponent(resolvedParams.id || "").trim();
  const safeId = rawId.match(/[0-9a-fA-F]{24}/)?.[0] || "";
  if (!safeId) {
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
  try {
    productRes = await apiGet<Product>(`/ecommerce/products/${safeId}`);
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

  if (!productRes?.data || Array.isArray(productRes.data)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold">Product unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">
            We could not load this product. Please try again.
          </p>
        </div>
      </main>
    );
  }

  try {
    const summaryId = productRes.data._id || safeId;
    summaryRes = await apiGet<ReviewSummary>(
      `/ecommerce/products/${summaryId}/reviews/summary`,
    );
  } catch (err) {
    console.error(err);
  }

  const product = productRes.data;
  const summary = summaryRes?.data || {
    total: 0,
    average: 0,
    breakdown: [],
  };
  const images = product.images && product.images.length
    ? product.images
    : [product.thumbnail || "/next.svg"];
  const price = product.salePrice ?? product.price;
  const hasSale = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasSale
    ? Math.round((1 - price / product.price) * 100)
    : 0;
  const stockLabel =
    product.trackStock === false
      ? "Unlimited stock"
      : `${Math.max(0, (product.stock || 0) - (product.reserved || 0))} in stock`;
  const description =
    product.shortDescription || product.description || "No description provided.";
  const categoryNames =
    product.categories?.map((category) => category.name).filter(Boolean) || [];
  const tags = product.tags || [];
  const features = product.features || [];
  const attributes = Object.entries(product.attributes || {});
  const faqs = product.faqs || [];
  const publicFiles = (product.files || []).filter((file) => file.isPublic);
  const currency = product.currency || "USD";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-700">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-slate-700">
          Products
        </Link>
        <span>/</span>
        <span className="text-slate-700">{product.name}</span>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <Image
              src={images[0] || "/next.svg"}
              alt={product.name}
              width={720}
              height={720}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 4).map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <Image
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
              <span>{product.brand || "Base360"}</span>
              {product.sku ? <span>SKU {product.sku}</span> : null}
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">
              {product.name}
            </h1>
            <p className="text-sm text-slate-600">{description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-semibold text-slate-900">
              {formatMoney(price, currency)}
            </span>
            {hasSale ? (
              <>
                <span className="text-slate-400 line-through">
                  {formatMoney(product.price, currency)}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Save {discountPercent}%
                </span>
              </>
            ) : null}
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {stockLabel}
            </span>
          </div>

          <AddToCart product={product} />
          <WishlistButton product={product} />

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Delivery options calculated at checkout",
              "Inventory checked when your order is placed",
              "Tenant-secured order processing",
              "Support details available in the store footer",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-amber-100/70 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Review summary
            </h3>
            <div className="mt-3 flex items-center gap-6">
              <div>
                <p className="text-2xl font-semibold">
                  {summary.average.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">
                  {summary.total} reviews
                </p>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                {summary.breakdown.map((row) => (
                  <div key={row.rating} className="flex items-center gap-2">
                    <span>{row.rating}*</span>
                    <span>{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Product details
          </h2>
          <p className="mt-3 text-sm text-slate-600">{description}</p>
          {categoryNames.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Categories
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categoryNames.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {tags.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tags
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {features.length > 0 ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Highlights
              </p>
              <ul className="mt-2 grid gap-2 text-sm text-slate-600">
                {features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {attributes.length > 0 ? (
            <dl className="mt-5 grid gap-2">
              {attributes.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between border-b border-slate-100 py-2 text-sm"
                >
                  <dt className="capitalize text-slate-500">{key}</dt>
                  <dd className="font-semibold text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {publicFiles.length > 0 ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Downloads
              </p>
              <div className="mt-2 grid gap-2">
                {publicFiles.map((file) => (
                  <a
                    key={`${file.name}-${file.url}`}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    <span>{file.name}</span>
                    <Download size={16} />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Shipping and returns
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Available carriers and rates are shown for your country.</li>
            <li>Delivery estimates are configured by the store team.</li>
            <li>Stock and delivery prices are verified before order creation.</li>
            <li>Contact the store directly for return eligibility.</li>
          </ul>
        </div>
      </div>

      {faqs.length > 0 ? (
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Product questions
          </h2>
          <div className="mt-4 grid gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
