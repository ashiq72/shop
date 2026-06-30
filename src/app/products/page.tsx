import Link from "next/link";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { apiGetSafe } from "@/lib/api";
import type { Category, Product, ProductFacets } from "@/lib/types";
import ProductCard from "@/app/components/ProductCard";

type SearchParams = Record<string, string | string[] | undefined>;

const flattenCategories = (
  categories: Category[],
  depth = 0,
): Array<Category & { depth: number }> =>
  categories.flatMap((category) => [
    { ...category, depth },
    ...flattenCategories(category.children || [], depth + 1),
  ]);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  const params = await Promise.resolve(searchParams);
  const read = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] || "" : value || "";
  };

  const search = read("search");
  const category = read("category");
  const brand = read("brand");
  const minPrice = read("minPrice");
  const maxPrice = read("maxPrice");
  const inStock = read("inStock");
  const page = Math.max(1, Number(read("page")) || 1);

  const query = new URLSearchParams({
    limit: "24",
    page: String(page),
  });
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (brand) query.set("brand", brand);
  if (minPrice) query.set("minPrice", minPrice);
  if (maxPrice) query.set("maxPrice", maxPrice);
  if (inStock) query.set("inStock", "true");

  const [productsResponse, categoriesResponse, facetsResponse] =
    await Promise.all([
      apiGetSafe<Product[]>(`/ecommerce/products?${query.toString()}`),
      apiGetSafe<Category[]>("/ecommerce/categories/tree"),
      apiGetSafe<ProductFacets>("/ecommerce/products/facets"),
    ]);

  const products = productsResponse.data || [];
  const categories = flattenCategories(categoriesResponse.data || []);
  const facets =
    facetsResponse.data && !Array.isArray(facetsResponse.data)
      ? facetsResponse.data
      : {
          brands: [],
          tags: [],
          categories: [],
          attributes: [],
        };
  const total = productsResponse.meta?.total || products.length;
  const totalPages = productsResponse.meta?.totalPage || 1;
  const hasFilters = Boolean(
    search || category || brand || minPrice || maxPrice || inStock,
  );

  const pageHref = (nextPage: number) => {
    const next = new URLSearchParams(query);
    next.set("page", String(nextPage));
    return `/products?${next.toString()}`;
  };

  return (
    <main className="store-shell catalog-page">
      <header className="catalog-heading">
        <div>
          <p>Tenant catalog</p>
          <h1>{search ? `Results for "${search}"` : "All products"}</h1>
          <span>{total} products matched</span>
        </div>
        {hasFilters ? (
          <Link href="/products" className="catalog-clear">
            <X size={16} />
            Clear filters
          </Link>
        ) : null}
      </header>

      <div className="catalog-layout">
        <aside className="catalog-filters">
          <div className="catalog-filter-title">
            <Filter size={18} />
            <strong>Filters</strong>
          </div>
          <form action="/products">
            <label>
              Search
              <span className="catalog-search-input">
                <Search size={16} />
                <input name="search" defaultValue={search} placeholder="Product name" />
              </span>
            </label>
            <label>
              Category
              <select name="category" defaultValue={category}>
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option value={item._id} key={item._id}>
                    {"- ".repeat(item.depth)}
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Brand
              <select name="brand" defaultValue={brand}>
                <option value="">All brands</option>
                {facets.brands.map((item) => (
                  <option value={item.value} key={item.value}>
                    {item.value} ({item.count})
                  </option>
                ))}
              </select>
            </label>
            <div className="catalog-price-fields">
              <label>
                Min price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="minPrice"
                  defaultValue={minPrice}
                />
              </label>
              <label>
                Max price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="maxPrice"
                  defaultValue={maxPrice}
                />
              </label>
            </div>
            <label className="catalog-check">
              <input
                type="checkbox"
                name="inStock"
                value="true"
                defaultChecked={Boolean(inStock)}
              />
              In-stock products only
            </label>
            <button type="submit">
              <SlidersHorizontal size={16} />
              Apply filters
            </button>
          </form>
        </aside>

        <section>
          {products.length ? (
            <div className="product-grid catalog-products">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="store-empty">
              No products match these filters. Try broadening your search.
            </div>
          )}

          {totalPages > 1 ? (
            <nav className="catalog-pagination" aria-label="Catalog pages">
              <Link
                href={pageHref(Math.max(1, page - 1))}
                aria-disabled={page === 1}
              >
                Previous
              </Link>
              <span>
                Page {page} of {totalPages}
              </span>
              <Link
                href={pageHref(Math.min(totalPages, page + 1))}
                aria-disabled={page === totalPages}
              >
                Next
              </Link>
            </nav>
          ) : null}
        </section>
      </div>
    </main>
  );
}
