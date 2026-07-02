import Link from "next/link";
import { Download, FileText, PackageCheck, Star } from "lucide-react";
import { apiGet, apiGetSafe } from "@/lib/api";
import type { Product, ReviewSummary } from "@/lib/types";
import ProductCard from "@/app/components/ProductCard";
import ProductExperience from "@/app/components/ProductExperience";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

const fileSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default async function ProductDetail({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const rawId = decodeURIComponent(resolvedParams.id || "").trim();
  const safeId = rawId.match(/[0-9a-fA-F]{24}/)?.[0] || "";
  if (!safeId) {
    return (
      <main className="store-state-page store-shell">
        <h1>Invalid product link</h1>
        <Link href="/products">Return to the catalog</Link>
      </main>
    );
  }

  let product: Product;
  try {
    const response = await apiGet<Product>(`/ecommerce/products/${safeId}`);
    product = response.data;
  } catch {
    return (
      <main className="store-state-page store-shell">
        <h1>Product unavailable</h1>
        <p>This product may be unpublished or no longer available.</p>
        <Link href="/products">Browse products</Link>
      </main>
    );
  }

  const [reviewResponse, relatedResponse] = await Promise.all([
    apiGetSafe<ReviewSummary>(
      `/ecommerce/products/${product._id}/reviews/summary`,
    ),
    apiGetSafe<Product[]>(
      product.categories?.[0]?._id
        ? `/ecommerce/products?category=${product.categories[0]._id}&limit=5&inStock=true`
        : "/ecommerce/products?limit=5&inStock=true",
    ),
  ]);
  const reviews = reviewResponse.data || {
    total: 0,
    average: 0,
    breakdown: [],
  };
  const related = (relatedResponse.data || [])
    .filter((item) => item._id !== product._id)
    .slice(0, 4);
  const features = product.features || [];
  const attributes = Object.entries(product.attributes || {});
  const faqs = product.faqs || [];
  const publicFiles = (product.files || []).filter((file) => file.isPublic);
  const categories = product.categories || [];

  return (
    <main className="product-detail-page">
      <nav className="product-breadcrumb store-shell" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">Products</Link>
        {categories[0] ? (
          <>
            <span>/</span>
            <Link href={`/products?category=${categories[0]._id}`}>
              {categories[0].name}
            </Link>
          </>
        ) : null}
        <span>/</span>
        <strong>{product.name}</strong>
      </nav>

      <div className="store-shell">
        <ProductExperience product={product} reviews={reviews} />
      </div>

      <section className="product-information">
        <div className="store-shell product-information-grid">
          <article className="product-overview">
            <p className="product-section-kicker">Product overview</p>
            <h2>About {product.name}</h2>
            <div className="product-description">
              {product.description ||
                product.shortDescription ||
                "Product information is being prepared."}
            </div>
            {features.length ? (
              <ul className="product-feature-list">
                {features.map((feature) => (
                  <li key={feature}>
                    <PackageCheck size={17} />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>

          <aside className="product-specifications">
            <div className="product-section-heading-small">
              <div>
                <p className="product-section-kicker">Specifications</p>
                <h2>Product details</h2>
              </div>
            </div>
            <dl>
              {product.brand ? (
                <div>
                  <dt>Brand</dt>
                  <dd>{product.brand}</dd>
                </div>
              ) : null}
              {product.sku ? (
                <div>
                  <dt>SKU</dt>
                  <dd>{product.sku}</dd>
                </div>
              ) : null}
              {attributes.map(([name, value]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              {categories.length ? (
                <div>
                  <dt>Categories</dt>
                  <dd>{categories.map((category) => category.name).join(", ")}</dd>
                </div>
              ) : null}
              {product.tags?.length ? (
                <div>
                  <dt>Tags</dt>
                  <dd>{product.tags.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
            {!product.brand &&
            !product.sku &&
            !attributes.length &&
            !categories.length &&
            !product.tags?.length ? (
              <p className="product-information-empty">
                Specifications will appear when they are added by the store.
              </p>
            ) : null}
          </aside>
        </div>
      </section>

      {publicFiles.length ? (
        <section className="store-shell product-downloads">
          <div className="product-section-heading-small">
            <div>
              <p className="product-section-kicker">Resources</p>
              <h2>Downloads and documents</h2>
            </div>
          </div>
          <div className="product-file-grid">
            {publicFiles.map((file) => (
              <a
                key={`${file.name}-${file.url}`}
                href={file.url}
                target="_blank"
                rel="noreferrer"
              >
                <FileText size={20} />
                <span>
                  <strong>{file.name}</strong>
                  <small>
                    {[file.type, fileSize(file.size)].filter(Boolean).join(" / ") ||
                      "Product document"}
                  </small>
                </span>
                <Download size={18} />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="product-reviews store-shell">
        <div className="product-section-heading-small">
          <div>
            <p className="product-section-kicker">Customer feedback</p>
            <h2>Ratings and reviews</h2>
          </div>
        </div>
        <div className="review-summary-panel">
          <div className="review-score">
            <strong>{reviews.average.toFixed(1)}</strong>
            <span className="stars">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={17}
                  fill={index < Math.round(reviews.average) ? "currentColor" : "none"}
                />
              ))}
            </span>
            <small>
              {reviews.total
                ? `Based on ${reviews.total} reviews`
                : "Be the first to review this product"}
            </small>
          </div>
          <div className="review-breakdown">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                reviews.breakdown.find((row) => row.rating === rating)?.count || 0;
              const percentage = reviews.total
                ? Math.round((count / reviews.total) * 100)
                : 0;
              return (
                <div key={rating}>
                  <span>{rating} star</span>
                  <i>
                    <b style={{ width: `${percentage}%` }} />
                  </i>
                  <strong>{count}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {faqs.length ? (
        <section className="product-faq">
          <div className="store-shell">
            <div className="product-section-heading-small">
              <div>
                <p className="product-section-kicker">Questions answered</p>
                <h2>Product FAQ</h2>
              </div>
            </div>
            <div className="product-faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="store-section store-shell">
          <div className="store-section-heading">
            <div>
              <p>Continue browsing</p>
              <h2>You may also like</h2>
            </div>
            <Link href="/products">View all products</Link>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

