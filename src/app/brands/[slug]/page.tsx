import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Brand } from "@/lib/types";
import ProductCard from "@/app/components/ProductCard";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(params);
  let brand: Brand | null = null;
  try {
    const response = await apiGet<Brand>(
      `/ecommerce/brands/public/${encodeURIComponent(slug)}`,
    );
    brand = response.data;
  } catch {
    brand = null;
  }

  if (!brand) {
    return (
      <main className="store-state-page store-shell">
        <h1>Brand unavailable</h1>
        <Link href="/brands">Browse brands</Link>
      </main>
    );
  }

  return (
    <main>
      <section className="brand-profile-hero">
        {brand.coverImage ? (
          <Image
            src={brand.coverImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="store-shell">
          <Link href="/brands">
            <ArrowLeft size={16} />
            All brands
          </Link>
          <div className="brand-profile-logo">
            {brand.logo ? (
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                sizes="130px"
                className="object-contain"
              />
            ) : (
              <strong>{brand.name.slice(0, 1).toUpperCase()}</strong>
            )}
          </div>
          <div>
            <p>Featured maker</p>
            <h1>{brand.name}</h1>
            <span>{brand.description}</span>
            {brand.website ? (
              <a href={brand.website} target="_blank" rel="noreferrer">
                Visit website
                <ExternalLink size={15} />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="store-section store-shell">
        <div className="store-section-heading">
          <div>
            <p>From {brand.name}</p>
            <h2>Brand products</h2>
          </div>
          <span>{brand.products?.length || 0} products</span>
        </div>
        {brand.products?.length ? (
          <div className="product-grid">
            {brand.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="store-empty">
            No active products are assigned to this brand yet.
          </div>
        )}
      </section>
    </main>
  );
}

