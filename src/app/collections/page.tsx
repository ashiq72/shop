import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { apiGetSafe } from "@/lib/api";
import type { Collection } from "@/lib/types";

export default async function CollectionsPage() {
  const response = await apiGetSafe<Collection[]>("/ecommerce/collections/public");
  const collections = response.data || [];

  return (
    <main className="store-shell store-list-page">
      <div className="store-list-title">
        <div>
          <p>Curated shopping</p>
          <h1>Collections</h1>
          <span>Useful groups assembled by the store team.</span>
        </div>
      </div>
      {collections.length ? (
        <div className="merch-card-grid">
          {collections.map((collection) => (
            <Link
              href={`/collections/${collection.slug}`}
              key={collection._id}
              className="merch-card"
            >
              <div className="merch-card-media">
                <Image
                  src={collection.image || "/store-hero.jpg"}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 720px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div>
                <span>{collection.isFeatured ? "Featured collection" : "Collection"}</span>
                <h2>{collection.name}</h2>
                <p>{collection.description || "Explore this curated product group."}</p>
                <strong>
                  View collection
                  <ArrowRight size={16} />
                </strong>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <section className="store-state-page compact">
          <Layers3 size={42} />
          <h2>Collections are being curated</h2>
          <p>Browse the complete catalog in the meantime.</p>
          <Link href="/products">Shop all products</Link>
        </section>
      )}
    </main>
  );
}

