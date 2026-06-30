export type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  children?: Category[];
};

export type ProductVariant = {
  sku?: string;
  barcode?: string;
  price?: number;
  salePrice?: number;
  stock?: number;
  reserved?: number;
  lowStockThreshold?: number;
  attributes?: Record<string, string>;
  image?: string;
  isActive?: boolean;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductFile = {
  name: string;
  url: string;
  type?: string;
  size?: number;
  isPublic?: boolean;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  features?: string[];
  sku?: string;
  price: number;
  salePrice?: number;
  currency?: string;
  images?: string[];
  thumbnail?: string;
  categories?: Category[];
  brand?: string;
  tags?: string[];
  trackStock?: boolean;
  stock?: number;
  reserved?: number;
  variants?: ProductVariant[];
  options?: ProductOption[];
  attributes?: Record<string, string>;
  faqs?: ProductFaq[];
  files?: ProductFile[];
  isFeatured?: boolean;
  status?: "draft" | "active" | "archived";
};

export type ReviewSummary = {
  total: number;
  average: number;
  breakdown: Array<{ rating: number; count: number }>;
};

export type Slider = {
  _id?: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
  priority?: number;
};

export type Branding = {
  logoDesktop?: string;
  logoMobile?: string;
  storeName?: string;
  tagline?: string;
  announcement?: string;
  supportEmail?: string;
  supportPhone?: string;
  address?: string;
  currency?: string;
};

export type ProductFacets = {
  brands: Array<{ value: string; count: number }>;
  tags: Array<{ value: string; count: number }>;
  categories: Array<{
    id: string;
    name?: string;
    slug?: string;
    count: number;
  }>;
  attributes: Array<{
    key: string;
    values: Array<{ value: string; count: number }>;
  }>;
};
