import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { apiGetSafe } from "@/lib/api";
import type { Category, Product, Slider } from "@/lib/types";
import HeroSlider from "@/app/components/HeroSlider";
import ProductCard from "@/app/components/ProductCard";

export default async function Home() {
  const [productsResponse, sliderResponse, categoriesResponse] =
    await Promise.all([
      apiGetSafe<Product[]>("/ecommerce/products?limit=12&inStock=true"),
      apiGetSafe<Slider[]>("/ecommerce/sliders/active?limit=5"),
      apiGetSafe<Category[]>("/ecommerce/categories/tree"),
    ]);

  const products = productsResponse.data || [];
  const sliders = sliderResponse.data || [];
  const categories = (categoriesResponse.data || []).slice(0, 8);
  const saleProducts = products
    .filter(
      (product) =>
        product.salePrice !== undefined && product.salePrice < product.price,
    )
    .slice(0, 4);

  return (
    <main>
      <HeroSlider slides={sliders} />

      <section className="store-benefits">
        <div className="store-shell">
          <div>
            <Truck size={21} />
            <span>
              <strong>Reliable delivery</strong>
              Clear fulfillment from checkout to arrival
            </span>
          </div>
          <div>
            <ShieldCheck size={21} />
            <span>
              <strong>Secure ordering</strong>
              Tenant-isolated catalog and order processing
            </span>
          </div>
          <div>
            <RefreshCcw size={21} />
            <span>
              <strong>Simple returns</strong>
              Helpful support when an order is not right
            </span>
          </div>
        </div>
      </section>

      <section className="store-section store-shell">
        <div className="store-section-heading">
          <div>
            <p>Browse the store</p>
            <h2>Shop by category</h2>
          </div>
          <Link href="/categories">
            View categories
            <ArrowRight size={17} />
          </Link>
        </div>

        {categories.length ? (
          <div className="category-showcase">
            {categories.map((category) => (
              <Link
                href={`/products?category=${category._id}`}
                key={category._id}
                className="category-showcase-item"
              >
                <div>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/store-hero.jpg"
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <strong>{category.name}</strong>
                <span>{category.children?.length || 0} collections</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="store-empty">Categories will appear here when published.</div>
        )}
      </section>

      <section className="store-section store-shell">
        <div className="store-section-heading">
          <div>
            <p>Available now</p>
            <h2>Featured products</h2>
          </div>
          <Link href="/products">
            Shop all
            <ArrowRight size={17} />
          </Link>
        </div>

        {products.length ? (
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                badge={product.isFeatured ? "Featured" : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="store-empty">
            Products published from the dashboard will appear here.
          </div>
        )}
      </section>

      {saleProducts.length ? (
        <section className="store-sale-band">
          <div className="store-shell">
            <div className="store-section-heading inverse">
              <div>
                <p>Limited offers</p>
                <h2>Current price drops</h2>
              </div>
              <Link href="/products">
                Browse deals
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="product-grid">
              {saleProducts.map((product) => (
                <ProductCard key={product._id} product={product} badge="Sale" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
