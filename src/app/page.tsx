import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { apiGetSafe } from "@/lib/api";
import type {
  Campaign,
  Brand,
  Category,
  Collection,
  Product,
  Slider,
} from "@/lib/types";
import HeroSlider from "@/app/components/HeroSlider";
import ProductCard from "@/app/components/ProductCard";

export default async function Home() {
  const [
    productsResponse,
    sliderResponse,
    categoriesResponse,
    collectionsResponse,
    campaignsResponse,
    brandsResponse,
  ] =
    await Promise.all([
      apiGetSafe<Product[]>("/ecommerce/products?limit=12&inStock=true"),
      apiGetSafe<Slider[]>("/ecommerce/sliders/active?limit=5"),
      apiGetSafe<Category[]>("/ecommerce/categories/tree"),
      apiGetSafe<Collection[]>("/ecommerce/collections/public?featured=true"),
      apiGetSafe<Campaign[]>("/ecommerce/campaigns/active?featured=true"),
      apiGetSafe<Brand[]>("/ecommerce/brands/public?featured=true"),
    ]);

  const products = productsResponse.data || [];
  const sliders = sliderResponse.data || [];
  const categories = (categoriesResponse.data || []).slice(0, 8);
  const collections = (collectionsResponse.data || []).slice(0, 3);
  const campaigns = (campaignsResponse.data || []).slice(0, 1);
  const brands = (brandsResponse.data || []).slice(0, 8);
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

      {campaigns.map((campaign) => (
        <section className="home-campaign" key={campaign._id}>
          <Image
            src={campaign.image || "/store-hero.jpg"}
            alt={campaign.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="store-shell">
            <p>{campaign.badge || "Limited-time offer"}</p>
            <h2>{campaign.name}</h2>
            <span>{campaign.description}</span>
            <Link href={`/campaigns/${campaign.slug}`}>
              Shop campaign
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      ))}

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

      {collections.length ? (
        <section className="store-section store-shell">
          <div className="store-section-heading">
            <div>
              <p>Curated by the store</p>
              <h2>Shop collections</h2>
            </div>
            <Link href="/collections">
              View all
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="home-collection-grid">
            {collections.map((collection) => (
              <Link
                key={collection._id}
                href={`/collections/${collection.slug}`}
                className="home-collection"
              >
                <Image
                  src={collection.image || "/store-hero.jpg"}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 720px) 100vw, 33vw"
                  className="object-cover"
                />
                <span>
                  <strong>{collection.name}</strong>
                  <small>{collection.description || "Explore collection"}</small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {brands.length ? (
        <section className="store-section store-shell home-brands-section">
          <div className="store-section-heading">
            <div>
              <p>Trusted makers</p>
              <h2>Featured brands</h2>
            </div>
            <Link href="/brands">
              View all brands
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="home-brand-grid">
            {brands.map((brand) => (
              <Link key={brand._id} href={`/brands/${brand.slug}`}>
                <span className="home-brand-logo">
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
                </span>
                <strong>{brand.name}</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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
