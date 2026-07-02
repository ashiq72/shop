import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { apiGetSafe } from "@/lib/api";
import type { Brand } from "@/lib/types";

export default async function BrandsPage() {
  const response = await apiGetSafe<Brand[]>("/ecommerce/brands/public");
  const brands = response.data || [];

  return (
    <main className="store-shell store-list-page">
      <div className="store-list-title">
        <div>
          <p>Shop by maker</p>
          <h1>Brands</h1>
          <span>Discover products from brands available in this store.</span>
        </div>
      </div>

      {brands.length ? (
        <div className="brand-directory">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand.slug}`}
              className="brand-directory-item"
            >
              <div className="brand-directory-logo">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                ) : (
                  <strong>{brand.name.slice(0, 1).toUpperCase()}</strong>
                )}
              </div>
              <div>
                <span>{brand.isFeatured ? "Featured brand" : "Brand"}</span>
                <h2>{brand.name}</h2>
                <p>{brand.description || "Explore products from this brand."}</p>
              </div>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      ) : (
        <section className="store-state-page compact">
          <BadgeCheck size={42} />
          <h2>Brands are being prepared</h2>
          <p>Browse the complete product catalog in the meantime.</p>
          <Link href="/products">Shop all products</Link>
        </section>
      )}
    </main>
  );
}

