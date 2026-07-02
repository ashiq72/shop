"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import type {
  Product,
  ProductOption,
  ProductVariant,
  ReviewSummary,
} from "@/lib/types";
import { useCart } from "@/app/components/CartProvider";
import { useCartDrawer } from "@/app/components/CartDrawerProvider";
import WishlistButton from "@/app/components/WishlistButton";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const variantStock = (product: Product, variant: ProductVariant) =>
  product.trackStock === false
    ? Number.POSITIVE_INFINITY
    : Math.max(0, Number(variant.stock || 0) - Number(variant.reserved || 0));

const unique = (values: Array<string | undefined>) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value))));

const buildOptions = (
  options: ProductOption[],
  variants: ProductVariant[],
) => {
  const valuesByName = new Map<string, string[]>();
  options.forEach((option) => {
    valuesByName.set(option.name, unique(option.values));
  });
  variants.forEach((variant) => {
    Object.entries(variant.attributes || {}).forEach(([name, value]) => {
      valuesByName.set(
        name,
        unique([...(valuesByName.get(name) || []), value]),
      );
    });
  });
  return Array.from(valuesByName, ([name, values]) => ({ name, values })).filter(
    (option) => option.name && option.values.length,
  );
};

export default function ProductExperience({
  product,
  reviews,
}: {
  product: Product;
  reviews: ReviewSummary;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { openDrawer } = useCartDrawer();
  const variants = useMemo(
    () =>
      (product.variants || []).filter(
        (variant) => variant.isActive !== false && Boolean(variant.sku?.trim()),
      ),
    [product.variants],
  );
  const options = useMemo(
    () => buildOptions(product.options || [], variants),
    [product.options, variants],
  );
  const firstAvailableVariant = useMemo(
    () =>
      variants.find((variant) => variantStock(product, variant) > 0) ||
      variants[0],
    [product, variants],
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(() => ({ ...(firstAvailableVariant?.attributes || {}) }));
  const [selectedSku, setSelectedSku] = useState(
    firstAvailableVariant?.sku || "",
  );
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const selectedVariant = useMemo(() => {
    if (!variants.length) return undefined;
    if (!options.length) {
      return variants.find((variant) => variant.sku === selectedSku);
    }
    return variants.find((variant) =>
      options.every(
        (option) =>
          variant.attributes?.[option.name] === selectedAttributes[option.name],
      ),
    );
  }, [options, selectedAttributes, selectedSku, variants]);

  const galleryImages = useMemo(
    () => {
      const images = unique([
        selectedVariant?.image,
        product.thumbnail,
        ...(product.images || []),
        ...variants.map((variant) => variant.image),
      ]);
      return images.length ? images : ["/store-hero.jpg"];
    },
    [product.images, product.thumbnail, selectedVariant?.image, variants],
  );
  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  const price =
    selectedVariant?.salePrice ??
    selectedVariant?.price ??
    product.salePrice ??
    product.price;
  const compareAtPrice =
    selectedVariant?.salePrice !== undefined &&
    selectedVariant.price !== undefined &&
    selectedVariant.salePrice < selectedVariant.price
      ? selectedVariant.price
      : product.salePrice !== undefined && product.salePrice < product.price
        ? product.price
        : undefined;
  const availableStock = selectedVariant
    ? variantStock(product, selectedVariant)
    : product.trackStock === false
      ? Number.POSITIVE_INFINITY
      : Math.max(0, Number(product.stock || 0) - Number(product.reserved || 0));
  const requiresVariant = variants.length > 0;
  const unavailable =
    (requiresVariant && !selectedVariant) || availableStock <= 0;
  const currency = product.currency || "USD";

  const canChooseValue = (optionName: string, optionValue: string) =>
    variants.some((variant) => {
      const matches = options.every((option) => {
        const expected =
          option.name === optionName
            ? optionValue
            : selectedAttributes[option.name];
        return !expected || variant.attributes?.[option.name] === expected;
      });
      return matches && variantStock(product, variant) > 0;
    });

  const chooseOption = (name: string, value: string) => {
    const next = { ...selectedAttributes, [name]: value };
    setSelectedAttributes(next);
    const match = variants.find((variant) =>
      options.every(
        (option) => variant.attributes?.[option.name] === next[option.name],
      ),
    );
    if (match?.sku) setSelectedSku(match.sku);
    if (match?.image) setActiveImage(match.image);
    setQuantity(1);
    setMessage("");
  };

  const changeImage = (direction: number) => {
    const currentIndex = Math.max(0, galleryImages.indexOf(activeImage));
    const nextIndex =
      (currentIndex + direction + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[nextIndex]);
  };

  const addCurrentItem = () => {
    setMessage("");
    if (unavailable) {
      setMessage(
        selectedVariant
          ? "This selection is currently unavailable."
          : "Choose an available product option.",
      );
      return false;
    }
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    if (safeQuantity > availableStock) {
      setMessage(`Only ${availableStock} available.`);
      return false;
    }
    addItem({
      productId: product._id,
      name: product.name,
      price,
      currency,
      quantity: safeQuantity,
      variantSku: selectedVariant?.sku,
      image: selectedVariant?.image || product.thumbnail || product.images?.[0],
    });
    setMessage("Added to your bag.");
    return true;
  };

  const buyNow = () => {
    if (addCurrentItem()) router.push("/checkout");
  };

  return (
    <section className="product-buy-layout">
      <div className="product-gallery">
        <div className="product-gallery-stage">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 55vw"
            className="object-contain"
          />
          {compareAtPrice !== undefined ? (
            <span className="product-gallery-sale">
              Save {Math.round((1 - price / compareAtPrice) * 100)}%
            </span>
          ) : null}
          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                className="gallery-arrow previous"
                onClick={() => changeImage(-1)}
                aria-label="Previous product image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="gallery-arrow next"
                onClick={() => changeImage(1)}
                aria-label="Next product image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          ) : null}
        </div>
        {galleryImages.length > 1 ? (
          <div className="product-gallery-thumbs">
            {galleryImages.map((image, index) => (
              <button
                type="button"
                key={image}
                className={image === activeImage ? "active" : ""}
                onClick={() => setActiveImage(image)}
                aria-label={`View product image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="76px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="product-purchase">
        <div className="product-identity">
          <div className="product-kicker">
            {product.brand ? (
              <Link href={`/products?brand=${encodeURIComponent(product.brand)}`}>
                {product.brand}
              </Link>
            ) : (
              <span>Store selection</span>
            )}
            {product.sku ? <span>SKU {product.sku}</span> : null}
          </div>
          <h1>{product.name}</h1>
          <div className="product-review-line">
            <span className="stars" aria-label={`${reviews.average} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={15}
                  fill={index < Math.round(reviews.average) ? "currentColor" : "none"}
                />
              ))}
            </span>
            <span>
              {reviews.total
                ? `${reviews.average.toFixed(1)} from ${reviews.total} reviews`
                : "No reviews yet"}
            </span>
          </div>
          <p>{product.shortDescription || product.description}</p>
        </div>

        <div className="product-price-row">
          <strong>{money(price, currency)}</strong>
          {compareAtPrice !== undefined ? (
            <del>{money(compareAtPrice, currency)}</del>
          ) : null}
          <span className={unavailable ? "out" : ""}>
            {unavailable
              ? "Unavailable"
              : Number.isFinite(availableStock)
                ? `${availableStock} available`
                : "In stock"}
          </span>
        </div>

        {options.map((option) => (
          <fieldset className="variant-group" key={option.name}>
            <legend>
              <span>{option.name}</span>
              <strong>{selectedAttributes[option.name] || "Choose"}</strong>
            </legend>
            <div className="variant-values">
              {option.values.map((value) => {
                const selected = selectedAttributes[option.name] === value;
                const available = canChooseValue(option.name, value);
                return (
                  <button
                    type="button"
                    key={value}
                    className={selected ? "selected" : ""}
                    disabled={!available}
                    onClick={() => chooseOption(option.name, value)}
                    aria-pressed={selected}
                  >
                    {selected ? <Check size={14} /> : null}
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        {variants.length > 0 && options.length === 0 ? (
          <fieldset className="variant-group">
            <legend>
              <span>Style</span>
              <strong>{selectedVariant?.sku || "Choose"}</strong>
            </legend>
            <div className="variant-values">
              {variants.map((variant) => {
                const selected = selectedSku === variant.sku;
                const available = variantStock(product, variant) > 0;
                const label =
                  Object.values(variant.attributes || {}).join(" / ") ||
                  variant.sku;
                return (
                  <button
                    type="button"
                    key={variant.sku}
                    className={selected ? "selected" : ""}
                    disabled={!available}
                    onClick={() => {
                      setSelectedSku(variant.sku || "");
                      if (variant.image) setActiveImage(variant.image);
                      setQuantity(1);
                      setMessage("");
                    }}
                  >
                    {selected ? <Check size={14} /> : null}
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <div className="product-order-controls">
          <div className="quantity-control" aria-label="Quantity">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              min={1}
              max={Number.isFinite(availableStock) ? availableStock : undefined}
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Math.floor(Number(event.target.value) || 1)))
              }
              aria-label="Product quantity"
            />
            <button
              type="button"
              onClick={() =>
                setQuantity((value) =>
                  Number.isFinite(availableStock)
                    ? Math.min(availableStock, value + 1)
                    : value + 1,
                )
              }
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            type="button"
            className="add-bag-button"
            onClick={() => {
              if (addCurrentItem()) openDrawer();
            }}
            disabled={unavailable}
          >
            <ShoppingBag size={18} />
            Add to bag
          </button>
          <button
            type="button"
            className="buy-now-button"
            onClick={buyNow}
            disabled={unavailable}
          >
            <Zap size={18} />
            Buy now
          </button>
        </div>

        <div className="product-save-row">
          <WishlistButton product={product} />
          {selectedVariant?.sku ? (
            <span>Selected SKU: {selectedVariant.sku}</span>
          ) : null}
        </div>
        {message ? (
          <p className={message.startsWith("Added") ? "buy-message success" : "buy-message"}>
            {message}
          </p>
        ) : null}

        <div className="purchase-assurances">
          <div>
            <Truck size={19} />
            <span>
              <strong>Flexible delivery</strong>
              Rates and estimates at checkout
            </span>
          </div>
          <div>
            <ShieldCheck size={19} />
            <span>
              <strong>Verified ordering</strong>
              Stock rechecked before confirmation
            </span>
          </div>
          <div>
            <RotateCcw size={19} />
            <span>
              <strong>Need help?</strong>
              Contact the store for return support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
