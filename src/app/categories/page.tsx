import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { apiGetSafe } from "@/lib/api";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const response = await apiGetSafe<Category[]>("/ecommerce/categories/tree");
  const categories = response.data || [];

  return (
    <main className="store-shell category-page">
      <header className="catalog-heading">
        <div>
          <p>Catalog directory</p>
          <h1>Shop by category</h1>
          <span>Browse every active product collection.</span>
        </div>
        <Link href="/products" className="catalog-clear">
          Shop all
          <ArrowRight size={16} />
        </Link>
      </header>

      {categories.length ? (
        <div className="category-directory">
          {categories.map((category) => (
            <article key={category._id} className="category-directory-item">
              <Link
                href={`/products?category=${category._id}`}
                className="category-directory-media"
              >
                <Image
                  src={category.image || "/store-hero.jpg"}
                  alt={category.name}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  className="object-cover"
                />
              </Link>
              <div className="category-directory-copy">
                <Link href={`/products?category=${category._id}`}>
                  <h2>{category.name}</h2>
                  <ArrowRight size={17} />
                </Link>
                {category.children?.length ? (
                  <div>
                    {category.children.map((child) => (
                      <Link
                        href={`/products?category=${child._id}`}
                        key={child._id}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span>Explore this collection</span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="store-empty">
          Categories published from the dashboard will appear here.
        </div>
      )}
    </main>
  );
}
