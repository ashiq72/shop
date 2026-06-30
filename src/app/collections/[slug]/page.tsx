import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Collection } from "@/lib/types";
import ProductCard from "@/app/components/ProductCard";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(params);
  let collection: Collection | null = null;
  try {
    const response = await apiGet<Collection>(
      `/ecommerce/collections/public/${encodeURIComponent(slug)}`,
    );
    collection = response.data;
  } catch {
    collection = null;
  }

  if (!collection) {
    return (
      <main className="store-state-page store-shell">
        <h1>Collection unavailable</h1>
        <Link href="/collections">Browse collections</Link>
      </main>
    );
  }

  return (
    <main>
      <section className="merch-hero">
        <Image
          src={collection.image || "/store-hero.jpg"}
          alt={collection.name}
          fill
          priority
          className="object-cover"
        />
        <div className="store-shell">
          <Link href="/collections">
            <ArrowLeft size={16} />
            Collections
          </Link>
          <p>Curated collection</p>
          <h1>{collection.name}</h1>
          <span>{collection.description}</span>
        </div>
      </section>
      <section className="store-section store-shell">
        <div className="store-section-heading">
          <div>
            <p>Selected for you</p>
            <h2>Collection products</h2>
          </div>
          <span>{collection.products?.length || 0} products</span>
        </div>
        {collection.products?.length ? (
          <div className="product-grid">
            {collection.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="store-empty">No active products match this collection yet.</div>
        )}
      </section>
    </main>
  );
}

